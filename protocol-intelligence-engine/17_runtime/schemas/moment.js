'use strict';

/**
 * Moment / Event — type + optional phase.
 * phase ∈ before_event | during_event | after_event | recovery_after_event
 */

const PHASES = new Set(['before_event', 'during_event', 'after_event', 'recovery_after_event']);

function buildMoment(partial = {}) {
  const p = partial || {};
  const phase = p.phase && PHASES.has(p.phase) ? p.phase : p.phase || null;
  return {
    type: p.type || p.upcoming_event_tag || p.tag || 'none',
    phase: phase && PHASES.has(phase) ? phase : phase || null,
    stakes: p.stakes || null,
    label: p.label || null,
  };
}

function fromFlatInput(flat = {}) {
  const f = flat || {};
  return buildMoment({
    type: f.upcoming_event_tag || 'none',
    phase: f.moment_phase || f.event_phase || null,
    stakes: f.stakes || null,
  });
}

module.exports = { PHASES, buildMoment, fromFlatInput };
