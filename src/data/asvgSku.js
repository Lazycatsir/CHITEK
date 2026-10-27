/**
 * ASVG module SKU table (en product pages) - /en/products-asvg/*.
 *
 * Same shape as AHF_SKU in ./ahfSku.js: one entry per page, one `rows` key per
 * Power capacity chip, optional `byVoltage` override for a non-standard rating.
 *
 * PRICING RULE (2026-10-26, user): ASVG costs exactly USD 100 less than the AHF
 * module of the same rating, so every number here = the AHF sibling's price
 * minus 100. Rows whose rating does NOT exist on the AHF sibling page stay
 * `null` (rendered as the PRICE_TBD placeholder '？？') - they need a real
 * number, they were NOT guessed.
 *
 * dims : 'W × D × H' in mm  - copied from that page's Module Parameters table
 *        (row "Dimensions W×D×H (mm)"). For a page that lists one size for the
 *        whole module the same value repeats on every rating.
 * kg   : net weight per module - row "Net Weight". Empty string = page has no
 *        net-weight data.
 * price: EXW USD per module, `null` = not settled yet.
 */
export const ASVG_SKU = {
  // AHF: 1150 / 1320 / 1560 / 2050 / 2720  ->  -100
  'anti-pollution-asvg': {
    prefix: 'ANTI_POLLUTION_ASVG_',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 1130 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 1300 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 1540 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 2030 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 2700 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 1380 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 1560 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 1880 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 2440 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 3240 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  // The page's own Module Parameters table lists APF 85A / APF 100A only, same
  // as the AHF sibling - but the chip row still offers 50/75/150/200A. Those
  // four have no AHF counterpart, so they stay unpriced on purpose.
  'anti-pollution-hv-asvg': {
    prefix: 'ANTI_POLLUTION_HV_ASVG_',
    defaultCurrent: '100A',
    rows: {
      '85A': { dims: '480 × 600 × 175', kg: '40', price: 4260 },
      '100A': { dims: '480 × 600 × 175', kg: '40', price: 4260 },
      'Unlimited': { dims: '480 × 600 × 175', kg: '40', price: null },
    },
  },

  // AHF: 910 / 1080  ->  -100
  'distributed-asvg': {
    prefix: 'DISTRIBUTED_ASVG_',
    defaultCurrent: '50A',
    rows: {
      '30A': { dims: '380 × 400 × 88', kg: '11.5', price: 890 },
      '50A': { dims: '380 × 400 × 88', kg: '11.5', price: 1060 },
      'Unlimited': { dims: '380 × 400 × 88', kg: '11.5', price: null },
    },
  },

  // AHF ip65 only carries 100A / 150A, so 50/75/200A stay unpriced.
  'ip65-asvg': {
    prefix: 'IP65_ASVG_',
    defaultCurrent: '100A',
    rows: {
      '100A': { dims: '600 × 220 × 500', kg: '', price: 1880 },
      '150A': { dims: '600 × 220 × 500', kg: '', price: 2440 },
      'Unlimited': { dims: '600 × 220 × 500', kg: '', price: null },
    },
  },

  // AHF sibling carries 25A only (its Parameters table says 30A / 50A - the two
  // disagree, flagged 2026-10-26), so neither ASVG rating has a counterpart.
  'ip65-sic-fanless-asvg': {
    prefix: 'SIC_FANLESS_ASVG_',
    defaultCurrent: '25A',
    rows: {
      '25A': { dims: '515 × 500 × 185', kg: '18', price: 1880 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  // AHF: 50A = 2400  ->  2300. 30A has no AHF counterpart.
  'sic-fanless-asvg': {
    prefix: 'SIC_FANLESS_ASVG_',
    defaultCurrent: '50A',
    rows: {
      '50A': { dims: '515 × 500 × 185', kg: '18', price: 2380 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  // AHF: 2300 / 2640 / 3120 / 4100 / 5440  ->  -100
  'sic-ultra-asvg': {
    prefix: 'CHITEK-SiC-ASVG-',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 2280 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 2620 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 3100 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 4080 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 5420 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 2780 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 3140 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 3780 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 4900 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 6500 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  // AHF: 910 / 910 / 910  ->  -100
  'ultra-slim-asvg': {
    prefix: 'ULTRA_SLIM_ASVG_',
    defaultCurrent: '8A',
    rows: {
      '8A': { dims: '340 × 410 × 45', kg: '7.5', price: 890 },
      '15A': { dims: '340 × 410 × 45', kg: '7.5', price: 890 },
      '20A': { dims: '340 × 410 × 45', kg: '7.5', price: 890 },
      'Unlimited': { dims: '340 × 410 × 45', kg: '7.5', price: null },
    },
  },
};

// Same helpers as the other two lines - one implementation for all three.
export { skuRow, skuTail, skuPrice, skuPartNo } from './sku.js';
