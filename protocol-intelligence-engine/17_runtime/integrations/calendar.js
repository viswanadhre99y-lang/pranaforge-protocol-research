'use strict';

/**
 * calendar integration stub — NOT connected.
 * Phase 1 intentionally provides interface only; no fake data.
 */
module.exports = {
  status: 'not_connected',
  name: 'calendar',
  async fetch() {
    return { available: false, status: 'not_connected', data: null };
  },
};
