'use strict';

/**
 * Context — who/where/when/activity/privacy/travel/event abstractions.
 * No fake calendar integration; fields are staff-entered or unknown.
 */

function buildContext(partial = {}) {
  const p = partial || {};
  return {
    who: {
      client_type: p.who?.client_type ?? p.client_type ?? null,
      staff_id: p.who?.staff_id ?? p.staff_id ?? null,
    },
    where: {
      place_class: p.where?.place_class ?? p.place_class ?? null,
      privacy: p.where?.privacy ?? p.privacy ?? null,
    },
    when: {
      timezone: p.when?.timezone ?? p.timezone ?? null,
      time_available_min: p.when?.time_available_min ?? p.available_minutes ?? null,
      time_bucket: p.when?.time_bucket ?? null,
    },
    activity: {
      label: p.activity?.label ?? (typeof p.activity === 'string' ? p.activity : null) ?? null,
    },
    travel: {
      in_transit: p.travel?.in_transit ?? null,
      jetlag_hint: p.travel?.jetlag_hint ?? null,
      // Abstractions only — integrations/travel.js is not_connected
    },
    event: {
      upcoming_tag: p.event?.upcoming_tag ?? p.upcoming_event_tag ?? null,
      phase: p.event?.phase ?? null, // before_event|during_event|after_event|recovery_after_event
    },
    upcoming: {
      tag: p.upcoming?.tag ?? p.upcoming_event_tag ?? null,
      stakes: p.upcoming?.stakes ?? null,
    },
    time_available: {
      minutes: p.time_available?.minutes ?? p.available_minutes ?? null,
    },
    timezone: p.timezone ?? p.when?.timezone ?? null,
    privacy: p.privacy ?? p.where?.privacy ?? null,
  };
}

function fromFlatInput(flat = {}) {
  const f = flat || {};
  return buildContext({
    client_type: f.client_type,
    staff_id: f.staff_id || null,
    place_class: f.place_class,
    privacy: f.privacy,
    available_minutes: f.available_minutes,
    timezone: f.timezone || null,
    activity: f.activity || null,
    upcoming_event_tag: f.upcoming_event_tag,
    event: f.moment_phase ? { upcoming_tag: f.upcoming_event_tag, phase: f.moment_phase } : undefined,
  });
}

module.exports = { buildContext, fromFlatInput };
