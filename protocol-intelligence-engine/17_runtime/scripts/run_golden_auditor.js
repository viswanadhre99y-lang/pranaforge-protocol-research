'use strict';
/**
 * PIE Golden Auditor Steps 1–7 — failure taxonomy + reports.
 * Does NOT modify goldens. Does NOT retune GOAL_PROTOCOL_BOOST weights.
 */
const fs = require('fs');
const path = require('path');
const { recommend, CATALOG } = require('../ranker');
const { mapGoldenCase, softAgree, parseContext } = require('../golden_mapper');

const ROOT = path.join(__dirname, '..', '..');
const CASES = path.join(ROOT, '13_test_cases', 'test_cases.jsonl');
const QA = path.join(ROOT, '18_qa');

const TAXONOMY = {
  1: { id: 1, name: 'duration_hard_exclude', layer: 'candidate_gen', desc: 'Expected protocol hard-excluded because dose > gap' },
  2: { id: 2, name: 'micro_gap_catalog_min', layer: 'candidate_gen', desc: 'Micro gap vs catalog min_duration mismatch' },
  3: { id: 3, name: 'public_context_exclude', layer: 'candidate_gen', desc: 'Public/privacy hard-exclude of expected' },
  4: { id: 4, name: 'preference_breath', layer: 'candidate_gen_or_rank', desc: 'Breath preference exclude/penalty miss' },
  5: { id: 5, name: 'crisis_safety_false_positive', layer: 'safety', desc: 'Escalate/silence from crisis NLP/flag when golden expects protocol' },
  6: { id: 6, name: 'silence_policy_gate', layer: 'safety_or_mapper', desc: 'Silence/escalate expected vs suggested mismatch (policy/mapper)' },
  7: { id: 7, name: 'non_catalog_meta_selected', layer: 'golden_data', desc: 'Expected staff_/SEQUENCE_/clinician_ or non-catalog ID' },
  8: { id: 8, name: 'ambiguous_silence_or_label', layer: 'golden_data', desc: 'Ambiguous SILENCE_or_* / ESCALATE_or_* labels' },
  9: { id: 9, name: 'goal_need_inference_mismatch', layer: 'candidate_gen', desc: 'Goal→need inference leaves expected family under-generated' },
  10: { id: 10, name: 'context_event_mapper', layer: 'mapper', desc: 'Context/place/event mapper mismatch' },
  11: { id: 11, name: 'ranked_too_low_wrong_family', layer: 'ranking', desc: 'Expected survived filters but ranked outside Top-3 / wrong family Top-1' },
  12: { id: 12, name: 'impossible_or_stale_golden', layer: 'golden_data', desc: 'Impossible duration prescription, stale ID, or catalog mismatch in golden' },
};

function isSilenceLike(e) {
  return /^(SILENCE|ESCALATE)$/i.test(String(e)) || /SILENCE_or|ESCALATE_or/i.test(String(e));
}
function isMeta(e) {
  return /^(staff_|SEQUENCE_|clinician_)/i.test(String(e));
}
function catalogSet() {
  return new Set(CATALOG.map((p) => p.protocol_id));
}
function exactPie(row, got) {
  const expected = String(row.expected || '');
  if (isSilenceLike(expected)) return false; // pie.spec counts only protocol ID exact
  const top = ((got.recommendations || [])[0] || {}).protocol_id || null;
  return top === expected;
}
function exactOperational(row, got) {
  const expected = String(row.expected || '');
  const tops = (got.recommendations || []).map((r) => r.protocol_id);
  const top = tops[0] || null;
  const gotSilence = !!got.silence || got.action === 'escalate';
  if (isSilenceLike(expected)) {
    if (/^ESCALATE/i.test(expected) || /ESCALATE_or/i.test(expected)) return got.action === 'escalate';
    return !!gotSilence;
  }
  return top === expected;
}

function classifyABC(expected, got, catalog) {
  if (isSilenceLike(expected) || isMeta(expected)) {
    return { abc: null, label: isMeta(expected) ? 'META' : 'SILENCE_LIKE' };
  }
  const tops = (got.recommendations || []).map((r) => r.protocol_id);
  if (tops.includes(expected)) {
    return { abc: null, label: tops[0] === expected ? 'PASS' : 'SOFT_TOP3' };
  }
  if (!catalog.has(expected)) {
    return { abc: 'A', label: 'A_never_generated' };
  }
  const excl = (got.exclusions || []).find((e) => e.protocol_id === expected);
  if (excl) return { abc: 'B', label: 'B_incorrectly_excluded', exclusion: excl };
  const inScores = got.scores && Object.prototype.hasOwnProperty.call(got.scores, expected);
  return { abc: 'C', label: 'C_ranked_too_low', in_top10_scores: !!inScores };
}

function taxonomyIds(tc, row, got, abcInfo, catalog) {
  const ids = new Set();
  const expected = String(row.expected || '');
  const soft = softAgree(row, got);
  const tops = (got.recommendations || []).map((r) => r.protocol_id);
  const excl = (got.exclusions || []).find((e) => e.protocol_id === expected);

  if (isMeta(expected) || (!catalog.has(expected) && !isSilenceLike(expected))) ids.add(7);
  if (/SILENCE_or|ESCALATE_or/i.test(expected)) ids.add(8);
  if (got.action === 'escalate' && !isSilenceLike(expected)) ids.add(5);
  if (isSilenceLike(expected) && !(got.silence || got.action === 'escalate')) ids.add(6);
  if (excl) {
    const rs = excl.reasons || [];
    if (rs.some((r) => /duration_exceeds_gap/.test(r))) {
      ids.add(1);
      const p = CATALOG.find((x) => x.protocol_id === expected);
      if (p && (Number(row.input.available_minutes) || 0) <= 1) ids.add(2);
      if (p && (p.min_duration_sec || 0) >= 900) ids.add(12);
    }
    if (rs.some((r) => /public_discrete/.test(r))) ids.add(3);
    if (rs.some((r) => /prefers_breath/.test(r))) ids.add(4);
  }
  if (abcInfo.abc === 'C' && !soft) ids.add(11);
  if (abcInfo.abc === 'A') ids.add(7);
  if (!soft && String(tc.goal || '') && abcInfo.abc === 'C') ids.add(9);
  if (!soft && (/elevator|hallway/.test(String(tc.context || '').toLowerCase()))) ids.add(10);
  if (!soft && !ids.size) ids.add(11);
  if (soft && !exactPie(row, got) && !isSilenceLike(expected)) {
    // soft-only — still may note ranking
  }
  return [...ids].sort((a, b) => a - b);
}

function scoreBreakdown(rec) {
  if (!rec) return null;
  if (rec.score_breakdown) return rec.score_breakdown;
  const f = rec.features || {};
  return {
    goal_fit: f.need_match ?? null,
    state_fit: f.expected_benefit ?? null,
    context_fit: f.context_match ?? null,
    duration_fit: f.feasibility ?? null,
    preference_fit: f.preference ?? null,
    historical_response: f.history ?? null,
    event_fit: f.timing ?? null,
    sequence_fit: null,
    safety_status: 'ok',
    final_score: rec.score ?? null,
  };
}

function buildCase(tc, catalog) {
  const row = mapGoldenCase(tc);
  const cx = parseContext(tc.context);
  const input = { ...row.input, raw_gap_sec: cx.raw_gap_sec };
  const got = recommend(input);
  const tops = (got.recommendations || []).map((r) => r.protocol_id);
  const top = tops[0] || null;
  const gotSilence = !!got.silence || got.action === 'escalate';
  const actualTop = got.action === 'escalate' ? 'ESCALATE' : got.silence ? 'SILENCE' : top;
  const abcInfo = classifyABC(row.expected, got, catalog);
  const soft = softAgree(row, got);
  const exact = exactPie(row, got);
  const exact_ops = exactOperational(row, got);
  const tax = taxonomyIds(tc, { ...row, input }, got, abcInfo, catalog);

  let classification = 'PASS';
  if (exact) classification = 'PASS';
  else if (soft) classification = 'soft-pass';
  else if (abcInfo.abc === 'A') classification = 'A';
  else if (abcInfo.abc === 'B') classification = 'B';
  else if (abcInfo.abc === 'C') classification = 'C';
  else if (isMeta(row.expected)) classification = 'META_MISS';
  else if (isSilenceLike(row.expected)) classification = 'SILENCE_MISS';
  else classification = 'OTHER';

  const candidates = (got.decision_record && got.decision_record.candidates) || got.recommendations || [];
  return {
    case_id: tc.id,
    expected: row.expected,
    actual_top: actualTop,
    top3: tops.slice(0, 3),
    scores_top10: got.scores || {},
    exact,
    exact_operational: exact_ops,
    soft_match: soft,
    classification,
    abc: abcInfo.abc,
    abc_label: abcInfo.label,
    taxonomy_ids: tax,
    taxonomy_labels: tax.map((i) => TAXONOMY[i].name),
    exclusion_reasons_for_expected: abcInfo.exclusion ? abcInfo.exclusion.reasons : null,
    exclusions_sample: (got.exclusions || []).slice(0, 15).map((e) => ({
      protocol_id: e.protocol_id,
      reasons: e.reasons,
    })),
    exclusions_total: got.exclusions_total != null ? got.exclusions_total : (got.exclusions || []).length,
    golden_candidates: row.candidates || [],
    ambiguous: !!row.ambiguous,
    goal: tc.goal,
    reason: tc.reason,
    context: tc.context,
    mapped_input: {
      place_class: input.place_class,
      available_minutes: input.available_minutes,
      raw_gap_sec: input.raw_gap_sec,
      upcoming_event_tag: input.upcoming_event_tag,
      prefers_breath: input.prefers_breath,
      force_silence: input.force_silence,
      crisis_flag: input.crisis_flag,
      goal: input.goal,
      stress: input.stress,
      energy: input.energy,
    },
    action: got.action,
    silence: !!got.silence,
    below_threshold: !!got.below_threshold,
    candidate_protocols: candidates.slice(0, 10).map((r, i) => ({
      rank: i + 1,
      protocol_id: r.protocol_id,
      score: r.score,
      score_breakdown: scoreBreakdown(r),
      features: r.features || null,
      why: r.why || [],
    })),
    top_score_breakdown: scoreBreakdown((got.recommendations || [])[0]),
  };
}

function main() {
  const cases = fs.readFileSync(CASES, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const catalog = catalogSet();
  const rows = cases.map((tc) => buildCase(tc, catalog));

  const exact = rows.filter((r) => r.exact).length;
  const soft = rows.filter((r) => r.soft_match).length;
  const abcCounts = { A: 0, B: 0, C: 0, null: 0 };
  const classCounts = {};
  const taxCounts = {};
  for (const r of rows) {
    abcCounts[r.abc == null ? 'null' : r.abc] = (abcCounts[r.abc == null ? 'null' : r.abc] || 0) + 1;
    classCounts[r.classification] = (classCounts[r.classification] || 0) + 1;
    for (const t of r.taxonomy_ids) taxCounts[t] = (taxCounts[t] || 0) + 1;
  }

  const report = {
    generated_at: new Date().toISOString(),
    timezone_note: 'Asia/Calcutta (box-local)',
    n: rows.length,
    metrics: {
      exact_match: exact,
      exact_rate: exact / rows.length,
      soft_agree: soft,
      soft_rate: soft / rows.length,
      soft_fails: rows.length - soft,
      note_exact: 'pie.spec definition: top1 protocol_id === expected (silence/escalate not counted as exact)',
      note_soft: 'softAgree: exact OR top-in-golden-candidates OR expected-in-top3 OR silence-agree OR staff_*/SEQUENCE soft',
    },
    abc_counts: abcCounts,
    classification_counts: classCounts,
    taxonomy: TAXONOMY,
    taxonomy_counts: Object.entries(taxCounts)
      .map(([id, count]) => ({ id: Number(id), name: TAXONOMY[id].name, layer: TAXONOMY[id].layer, count }))
      .sort((a, b) => b.count - a.count),
    soft_fail_ids: rows.filter((r) => !r.soft_match).map((r) => r.case_id),
    cases: rows,
  };

  fs.mkdirSync(QA, { recursive: true });
  fs.writeFileSync(path.join(QA, 'GOLDEN_FAILURE_REPORT.json'), JSON.stringify(report, null, 2));

  // Human MD summary
  const patterns = report.taxonomy_counts.slice(0, 8);
  const md = [];
  md.push('# GOLDEN_FAILURE_REPORT');
  md.push('');
  md.push(`**Generated:** ${report.generated_at} (convert to Asia/Calcutta for display)`);
  md.push(`**Suite:** \`13_test_cases/test_cases.jsonl\` (${rows.length} cases)`);
  md.push('');
  md.push('## Live metrics (re-measured)');
  md.push('');
  md.push('| Metric | Count | Rate |');
  md.push('|--------|------:|-----:|');
  md.push(`| Exact (pie.spec) | ${exact}/${rows.length} | ${(exact / rows.length * 100).toFixed(1)}% |`);
  md.push(`| Soft agreement | ${soft}/${rows.length} | ${(soft / rows.length * 100).toFixed(1)}% |`);
  md.push('');
  md.push('Baseline claimed (QA_REPORT_v2): exact 23.6% (26/110), soft 78.2% (86/110).');
  md.push('');
  md.push('## A / B / C (expected protocol not in Top-3)');
  md.push('');
  md.push('| Class | Meaning | Count |');
  md.push('|-------|---------|------:|');
  md.push(`| A | Never generated (not in catalog / cannot produce) | ${abcCounts.A || 0} |`);
  md.push(`| B | Incorrectly hard-excluded | ${abcCounts.B || 0} |`);
  md.push(`| C | Ranked too low (survived filters, outside Top-3) | ${abcCounts.C || 0} |`);
  md.push(`| (null) | PASS / soft Top-3 / silence-like / meta | ${abcCounts.null || 0} |`);
  md.push('');
  md.push('## Classification counts');
  md.push('');
  for (const [k, v] of Object.entries(classCounts).sort((a, b) => b[1] - a[1])) {
    md.push(`- **${k}**: ${v}`);
  }
  md.push('');
  md.push('## Taxonomy 1–12 (counts on failing / tagged cases)');
  md.push('');
  md.push('| # | Name | Layer | Count |');
  md.push('|---|------|-------|------:|');
  for (const t of Object.values(TAXONOMY)) {
    md.push(`| ${t.id} | ${t.name} | ${t.layer} | ${taxCounts[t.id] || 0} |`);
  }
  md.push('');
  md.push('## Top systemic patterns (examples)');
  md.push('');
  const byTax = {};
  for (const r of rows) {
    for (const t of r.taxonomy_ids) {
      if (!byTax[t]) byTax[t] = [];
      if (!r.soft_match || r.abc) byTax[t].push(r.case_id);
    }
  }
  let n = 0;
  for (const t of report.taxonomy_counts) {
    if (n >= 5) break;
    const ex = [...new Set(byTax[t.id] || [])].slice(0, 6);
    if (!ex.length) continue;
    n++;
    md.push(`### ${n}. [${t.id}] ${t.name} (${t.layer}) — n≈${t.count}`);
    md.push(`Examples: ${ex.join(', ')}`);
    md.push('');
  }
  md.push('## Soft fail IDs');
  md.push('');
  md.push(report.soft_fail_ids.join(', ') || '(none)');
  md.push('');
  md.push('## Honesty');
  md.push('');
  md.push('Rates are offline agreement with author labels — **not** clinical validation or production readiness.');
  md.push('');
  fs.writeFileSync(path.join(QA, 'GOLDEN_FAILURE_REPORT.md'), md.join('\n'));

  console.log(JSON.stringify({
    exact: `${exact}/${rows.length}`,
    soft: `${soft}/${rows.length}`,
    abc: abcCounts,
    soft_fails: report.soft_fail_ids,
    out: ['18_qa/GOLDEN_FAILURE_REPORT.json', '18_qa/GOLDEN_FAILURE_REPORT.md'],
  }, null, 2));
}

main();
