'use strict';

/**
 * travel integration stub — NOT connected.
 * Phase 1 intentionally provides interface only; no fake data.
 */
module.exports = {
  status: 'not_connected',
  name: 'travel',
  async fetch() {
    return { available: false, status: 'not_connected', data: null };
  },
};
