'use strict';
/**
 * PIE Golden Auditor — full failure dump for all test_cases.jsonl rows.
 * Does NOT modify goldens. Uses recommend() + softAgree directly.
 *
 * Usage: node scripts/golden_failure_dump.js [--out path] [--cases path]
 */
const fs = require('fs');
const path = require('path');
const { recommend } = require('../ranker');
const { mapGoldenCase, softAgree } = require('../golden_mapper');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULT_CASES = path.join(ROOT, '13_test_cases', 'test_cases.jsonl');
const DEFAULT_OUT = path.join(ROOT, '18_qa', 'GOLDEN_FAILURE_DUMP.jsonl');
const DEFAULT_SUMMARY = path.join(ROOT, '18_qa', 'GOLDEN_FAILURE_DUMP_SUMMARY.json');

function parseArgs(argv) {
  const out = { cases: DEFAULT_CASES, out: DEFAULT_OUT, summary: DEFAULT_SUMMARY };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) out.out = path.resolve(argv[++i]);
    else if (argv[i] === '--cases' && argv[i + 1]) out.cases = path.resolve(argv[++i]);
    else if (argv[i] === '--summary' && argv[i + 1]) out.summary = path.resolve(argv[++i]);
  }
  return out;
}

function catalogIds() {
  const p = path.join(ROOT, '02_protocol_catalog', 'catalog.jsonl');
  return new Set(
    fs
      .readFileSync(p, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l).protocol_id)
  );
}

function isSilenceLike(expected) {
  const e = String(expected || '');
  return /^(SILENCE|ESCALATE)$/i.test(e) || /SILENCE_or|ESCALATE_or/i.test(e);
}

function isMetaSelected(expected) {
  return /^(staff_|SEQUENCE_|clinician_)/i.test(String(expected || ''));
}

function topIds(got) {
  return (got.recommendations || []).map((r) => r.protocol_id);
}

function exactAgree(row, got) {
  const expected = String(row.expected || '');
  const tops = topIds(got);
  const top = tops[0] || null;
  const gotSilence = !!got.silence || got.action === 'escalate';
  if (isSilenceLike(expected)) {
    if (/^ESCALATE/i.test(expected) || /ESCALATE_or/i.test(expected)) {
      return got.action === 'escalate';
    }
    return !!gotSilence;
  }
  return top === expected;
}

function classifyMissingGolden(expected, got, catalog) {
  if (isSilenceLike(expected) || isMetaSelected(expected)) {
    return null; // N/A for silence/meta labels
  }
  if (!catalog.has(expected)) {
    return 'never_generated'; // not in catalog → engine cannot produce it
  }
  const excl = (got.exclusions || []).find((e) => e.protocol_id === expected);
  if (excl) return 'incorrectly_excluded';
  // Prefer recommendations (full features/score_breakdown); fall back to decision_record candidates
  const ranked = (got.recommendations && got.recommendations.length
    ? got.recommendations
    : (got.decision_record && got.decision_record.candidates) || []) ;
  // Also check scores map / full ranking via recommendations + scores keys
  const inTop = topIds(got).includes(expected);
  const inScores = got.scores && Object.prototype.hasOwnProperty.call(got.scores, expected);
  // Scored candidates only top-10 in API; if excluded we already returned; else ranked_too_low
  if (!inTop && !inScores) {
    // Could be ranked below top-10 window — still "ranked_too_low" if not excluded
    return 'ranked_too_low';
  }
  if (!inTop) return 'ranked_too_low';
  return null; // present in ranking (exact or soft via top3)
}

function failureCategories(tc, row, got, missingABC) {
  const cats = [];
  const expected = String(row.expected || '');
  const tops = topIds(got);
  const top = tops[0] || null;
  const exact = exactAgree(row, got);
  const soft = softAgree(row, got);
  if (exact && soft) return cats;

  if (isSilenceLike(expected)) {
    if (!got.silence && got.action !== 'escalate') cats.push('silence_expected_but_suggested');
    else if (/^ESCALATE/i.test(expected) && got.action !== 'escalate') cats.push('escalate_expected_miss');
    else if (/SILENCE/i.test(expected) && got.action === 'escalate') cats.push('silence_vs_escalate_mismatch');
  }

  if (got.action === 'escalate' && !isSilenceLike(expected)) cats.push('false_positive_crisis_escalate');
  if (got.silence && got.below_threshold && !isSilenceLike(expected)) cats.push('below_tau_silence');
  if (got.silence && !got.below_threshold && got.action === 'silence' && !isSilenceLike(expected)) {
    cats.push('policy_gate_silence');
  }

  if (missingABC === 'never_generated') cats.push('golden_not_in_catalog');
  if (missingABC === 'incorrectly_excluded') cats.push('golden_incorrectly_excluded');
  if (missingABC === 'ranked_too_low') cats.push('golden_ranked_too_low');

  const exclGolden = (got.exclusions || []).find((e) => e.protocol_id === expected);
  if (exclGolden) {
    const rs = exclGolden.reasons || [];
    if (rs.some((r) => /duration_exceeds_gap/.test(r))) cats.push('duration_exclude_golden');
    if (rs.some((r) => /public_discrete/.test(r))) cats.push('public_context_exclude_golden');
    if (rs.some((r) => /equipment_missing/.test(r))) cats.push('equipment_exclude_golden');
    if (rs.some((r) => /clinician_only/.test(r))) cats.push('clinician_exclude_golden');
    if (rs.some((r) => /arousal_up/.test(r))) cats.push('arousal_exclude_golden');
    if (rs.some((r) => /prefers_breath/.test(r))) cats.push('breath_pref_exclude_golden');
  }

  // Candidate-set soft miss: top not in golden candidates and expected not in top3
  if (!soft && !isSilenceLike(expected)) {
    if (!(row.candidates || []).includes(top) && !tops.includes(expected)) {
      cats.push('wrong_family_top1');
    }
  }

  // Context / goal / preference signals
  const input = got.input || row.input || {};
  if (String(tc.context || '').toLowerCase().includes('hallway') || input.place_class === 'public') {
    if (!soft) cats.push('public_or_hallway_context');
  }
  if ((Number(input.available_minutes) || 0) <= 1 && !soft) cats.push('micro_gap_le_1min');
  if (input.prefers_breath === 'no' && !soft) cats.push('breath_preference_case');
  if (String(tc.goal || '') && !soft) cats.push(`goal:${tc.goal}`);

  // Historical response contribution absent
  const feats = (got.recommendations && got.recommendations[0] && got.recommendations[0].features) || {};
  if (feats.history != null && feats.history === 0.5 && !soft) cats.push('no_history_signal');

  if (!cats.length && !soft) cats.push('unclassified_soft_miss');
  if (!exact && soft) cats.push('exact_miss_soft_ok');

  return [...new Set(cats)];
}

function scoreBreakdownFromRec(rec) {
  if (!rec) return null;
  if (rec.score_breakdown) return rec.score_breakdown;
  const f = rec.features || {};
  // Legacy mapping until ranker exposes interpretable breakdown
  return {
    goal_fit: f.need_match != null ? f.need_match : null,
    state_fit: f.expected_benefit != null ? f.expected_benefit : null,
    context_fit: f.context_match != null ? f.context_match : null,
    duration_fit: f.feasibility != null ? f.feasibility : null,
    preference_fit: f.preference != null ? f.preference : null,
    historical_response: f.history != null ? f.history : null,
    event_fit: f.timing != null ? f.timing : null,
    sequence_fit: null,
    safety_status: 'ok',
    final_score: rec.score != null ? rec.score : null,
    _legacy_features: f,
  };
}

function compatibilityBlock(input, got) {
  const top = (got.recommendations || [])[0] || null;
  const f = (top && top.features) || {};
  const sb = scoreBreakdownFromRec(top) || {};
  return {
    duration: {
      available_minutes: input.available_minutes,
      raw_gap_sec: input.raw_gap_sec,
      duration_fit: sb.duration_fit,
      feasibility: f.feasibility,
    },
    preference: {
      prefers_breath: input.prefers_breath,
      preference_fit: sb.preference_fit,
    },
    context: {
      place_class: input.place_class,
      privacy: input.privacy,
      upcoming_event_tag: input.upcoming_event_tag,
      context_fit: sb.context_fit,
      event_fit: sb.event_fit,
    },
    goal: {
      goal: input.goal,
      inferred_need: got.inferred_need,
      inferred_needs: got.inferred_needs,
      goal_fit: sb.goal_fit,
    },
    state: {
      stress: input.stress,
      energy: input.energy,
      sleep_h: input.sleep_h,
      state_fit: sb.state_fit,
    },
    historical_response: {
      history_notes: input.history_notes,
      historical_response: sb.historical_response,
      history_feature: f.history,
    },
  };
}

function buildDumpRow(tc, catalog) {
  const row = mapGoldenCase(tc);
  // preserve raw_gap_sec on input if mapper put it only on parseContext — mapGoldenCase doesn't pass raw_gap_sec
  // Re-parse for dump completeness
  const { parseContext } = require('../golden_mapper');
  const cx = parseContext(tc.context);
  const input = { ...row.input, raw_gap_sec: cx.raw_gap_sec };
  const got = recommend(input);

  const exact = exactAgree(row, got);
  const soft = softAgree(row, got);
  const tops = topIds(got);
  const actualTop =
    got.action === 'escalate' ? 'ESCALATE' : got.silence ? 'SILENCE' : tops[0] || null;

  const missingABC = classifyMissingGolden(row.expected, got, catalog);

  // Candidate protocols actually scored (from decision_record / recommendations / scores)
  const candidate_protocols = [];
  const seen = new Set();
  const pushCand = (r, rank) => {
    if (!r || !r.protocol_id || seen.has(r.protocol_id)) return;
    seen.add(r.protocol_id);
    candidate_protocols.push({
      rank,
      protocol_id: r.protocol_id,
      final_score: r.score,
      features: r.features || null,
      score_breakdown: scoreBreakdownFromRec(r),
      why: r.why || [],
      availability: {
        public_discrete: r.public_discrete,
        min_duration_sec: r.min_duration_sec,
        recommended_duration_sec: r.recommended_duration_sec,
        max_duration_sec: r.max_duration_sec,
        clinician_only: r.clinician_only,
      },
    });
  };
  const ranked = (got.decision_record && got.decision_record.candidates) || got.recommendations || [];
  ranked.forEach((r, i) => pushCand(r, i + 1));
  // Fill from scores map if missing detail
  if (got.scores) {
    let rank = candidate_protocols.length + 1;
    for (const [pid, sc] of Object.entries(got.scores)) {
      if (seen.has(pid)) continue;
      candidate_protocols.push({
        rank: rank++,
        protocol_id: pid,
        final_score: sc,
        features: null,
        score_breakdown: { final_score: sc },
        why: [],
        availability: null,
      });
      seen.add(pid);
    }
  }

  const excluded = (got.exclusions || []).map((e) => ({
    protocol_id: e.protocol_id,
    reasons: e.reasons || [],
  }));

  const golden_exclusion = excluded.find((e) => e.protocol_id === row.expected) || null;

  const cats = failureCategories(tc, row, got, missingABC);

  return {
    case_id: tc.id,
    golden_ranking: {
      selected: row.expected,
      candidates: row.candidates || [],
      excluded_by_author: tc.excluded || [],
      ambiguous: !!row.ambiguous,
      goal: tc.goal,
      reason: tc.reason,
    },
    actual_ranking: {
      action: got.action,
      silence: !!got.silence,
      below_threshold: !!got.below_threshold,
      top1: actualTop,
      top3: tops.slice(0, 3),
      scores_top10: got.scores || {},
    },
    exact,
    soft,
    candidate_protocols,
    excluded,
    golden_exclusion,
    ranking_scores_features_components: candidate_protocols.map((c) => ({
      protocol_id: c.protocol_id,
      final_score: c.final_score,
      features: c.features,
      score_breakdown: c.score_breakdown,
    })),
    final_score: candidate_protocols[0] ? candidate_protocols[0].final_score : null,
    availability: candidate_protocols.map((c) => ({
      protocol_id: c.protocol_id,
      ...(c.availability || {}),
    })),
    compatibility: compatibilityBlock(input, got),
    historical_response_contribution: compatibilityBlock(input, got).historical_response,
    failure_categories: cats,
    missing_golden_ABC: missingABC,
    mapped_input: input,
    why_selected: got.why_selected || [],
    personalized_message: got.personalized_message || null,
  };
}

function main() {
  const args = parseArgs(process.argv);
  const lines = fs.readFileSync(args.cases, 'utf8').split('\n').filter(Boolean);
  const cases = lines.map((l) => JSON.parse(l));
  const catalog = catalogIds();

  const rows = [];
  let exact = 0;
  let soft = 0;
  const catCounts = {};
  const abcCounts = { never_generated: 0, incorrectly_excluded: 0, ranked_too_low: 0, null: 0 };

  for (const tc of cases) {
    const dump = buildDumpRow(tc, catalog);
    rows.push(dump);
    if (dump.exact) exact++;
    if (dump.soft) soft++;
    for (const c of dump.failure_categories) catCounts[c] = (catCounts[c] || 0) + 1;
    const k = dump.missing_golden_ABC == null ? 'null' : dump.missing_golden_ABC;
    abcCounts[k] = (abcCounts[k] || 0) + 1;
  }

  const outDir = path.dirname(args.out);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(args.out, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');

  const summary = {
    generated_at: new Date().toISOString(),
    cases_path: args.cases,
    n: cases.length,
    exact_match: exact,
    exact_rate: exact / cases.length,
    soft_agree: soft,
    soft_rate: soft / cases.length,
    soft_fails: cases.length - soft,
    missing_golden_ABC_counts: abcCounts,
    failure_category_counts: Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({ category: k, count: v })),
    soft_fail_ids: rows.filter((r) => !r.soft).map((r) => r.case_id),
    exact_fail_soft_ok_ids: rows.filter((r) => !r.exact && r.soft).map((r) => r.case_id),
  };
  fs.writeFileSync(args.summary, JSON.stringify(summary, null, 2));
  console.log(
    JSON.stringify(
      {
        out: args.out,
        summary: args.summary,
        exact: `${exact}/${cases.length} (${(summary.exact_rate * 100).toFixed(1)}%)`,
        soft: `${soft}/${cases.length} (${(summary.soft_rate * 100).toFixed(1)}%)`,
        top_categories: summary.failure_category_counts.slice(0, 10),
        abc: abcCounts,
      },
      null,
      2
    )
  );
}

main();
