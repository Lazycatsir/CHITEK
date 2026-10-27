/**
 * SVG (Static Var Generator) module SKU table — en product pages.
 *
 * Same shape as AHF_SKU in ./ahfSku.js: one entry per page, one `rows` key per
 * Power capacity chip, optional `byVoltage` override for a non-standard rating.
 *
 * Source of the numbers = each page's own Module Parameters table
 * (Rated Current, Dimensions, Net Weight). The pages DO read this table now:
 * the summary bar, the SKU line and the SSR markup all come from here.
 *
 * price: EXW USD per module. `null` = price not settled yet, which renders as
 * the PRICE_TBD placeholder ('？？') on the pages and in docs/sku-table-*.html.
 * Every 'Unlimited' row is currently null.
 */

export const SVG_SKU = {
  'anti-pollution-svg': {
    prefix: 'ANTI_POLLUTION_SVG_',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 1120 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 1230 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 1560 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 1690 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 2460 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 1340 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 1490 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 1900 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 2030 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 2960 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  // Module table lists only APF 85A / APF 100A; 50/75/150/200A reuse the cabinet.
  'anti-pollution-hv-svg': {
    prefix: 'ANTI_POLLUTION_HV_SVG_',
    defaultCurrent: '100A',
    rows: {
      '85A': { dims: '480 × 600 × 175', kg: '40', price: 4280 },
      '100A': { dims: '480 × 600 × 175', kg: '40', price: 4280 },
      'Unlimited': { dims: '480 × 600 × 175', kg: '40', price: null },
    },
  },

  'distributed-svg': {
    prefix: 'DISTRIBUTED_SVG_',
    defaultCurrent: '50A',
    rows: {
      '30A': { dims: '380 × 400 × 88', kg: '11.5', price: 910 },
      '50A': { dims: '380 × 400 × 88', kg: '11.5', price: 910 },
      'Unlimited': { dims: '380 × 400 × 88', kg: '11.5', price: null },
    },
  },

  'sic-fanless-svg': {
    prefix: 'SIC_FANLESS_SVG_',
    defaultCurrent: '50A',
    rows: {
      '50A': { dims: '515 × 500 × 185', kg: '18', price: 910 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  'ip65-sic-fanless-svg': {
    prefix: 'SIC_FANLESS_SVG_',
    defaultCurrent: '25A',
    rows: {
      '25A': { dims: '515 × 500 × 185', kg: '18', price: 1900 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  // Module table has no Net Weight row and lists the size as W × H × D
  // (600 × 500 × 220) - converted here to the W × D × H order used site-wide.
  'ip65-svg': {
    prefix: 'IP65_SVG_',
    defaultCurrent: '100A',
    rows: {
      '100A': { dims: '600 × 220 × 500', kg: '', price: 1900 },
      '150A': { dims: '600 × 220 × 500', kg: '', price: 2460 },
      'Unlimited': { dims: '600 × 220 × 500', kg: '', price: null },
    },
  },

  'sic-ultra-svg': {
    prefix: 'CHITEK-SiC-SVG-',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 2240 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 2460 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 3120 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 3380 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 4920 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 2680 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 2980 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 3800 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 4060 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 5920 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  'ultra-slim-svg': {
    prefix: 'ULTRA_SLIM_SVG_',
    defaultCurrent: '8A',
    rows: {
      '8A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      '15A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      '20A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      'Unlimited': { dims: '340 × 410 × 45', kg: '7.5', price: null },
    },
  },
};

// Same helpers as the AHF table - one implementation for both lines.
export { skuRow, skuTail, skuPrice, skuPartNo } from './sku.js';
