/**
 * AHF module SKU table (en product pages).
 *
 * One entry per product page. Each `rows` key MUST match a chip in the page's
 * Power capacity group (`data-group="a" data-val="..."`), so the SKU line, the
 * dimensions/weight tail and the price always resolve from the same table.
 *
 * dims : 'W × D × H' in mm  - copied from that page's Module Parameters table
 *        (row "Dimensions W×D×H (mm)").
 * kg   : net weight per module - row "Net Weight". Empty string = page has no
 *        net-weight data, so the SKU line simply omits the kg segment.
 * price: EXW USD per module. `null` = price not settled yet, which renders as
 *        the PRICE_TBD placeholder ('？？') on the pages and in
 *        docs/sku-table-*.html. Every 'Unlimited' row is currently null, so the
 *        summary bar, SKU line, WhatsApp text and the SSR markup all read from
 *        this table and show the placeholder.
 *
 * byVoltage: optional per-voltage override, keyed by the chip value
 *        ('480V'). Any rating that is not listed there falls back to `rows`.
 *        480V is a non-standard rating on the 4U lines ("480V please contact
 *        us" in the Parameters table), so it gets its own dimensions / weight /
 *        price. The values below still mirror 400V - replace them once the
 *        480V spec is confirmed.
 */

export const AHF_SKU = {
  // price = 2 x anti-pollution-ahf (same module, SiC version)
  'sic-ultra-ahf': {
    prefix: 'CHITEK-SiC-AHF-',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 2300 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 2640 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 3120 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 4100 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 5440 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    // 480V special case - pending, mirrors 400V until the 480V spec is fixed.
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 2800 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 3160 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 3800 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 4920 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 6520 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  'anti-pollution-ahf': {
    prefix: 'ANTI_POLLUTION_AHF_',
    defaultCurrent: '100A',
    rows: {
      '50A': { dims: '500 × 550 × 130', kg: '19', price: 1150 },
      '75A': { dims: '500 × 550 × 130', kg: '24', price: 1320 },
      '100A': { dims: '500 × 550 × 130', kg: '24', price: 1560 },
      '150A': { dims: '500 × 550 × 130', kg: '29', price: 2050 },
      '200A': { dims: '500 × 550 × 175', kg: '34', price: 2720 },
      'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
    },
    // 480V special case - pending, mirrors 400V until the 480V spec is fixed.
    byVoltage: {
      '480V': {
        '50A': { dims: '500 × 550 × 130', kg: '19', price: 1400 },
        '75A': { dims: '500 × 550 × 130', kg: '24', price: 1580 },
        '100A': { dims: '500 × 550 × 130', kg: '24', price: 1900 },
        '150A': { dims: '500 × 550 × 130', kg: '29', price: 2460 },
        '200A': { dims: '500 × 550 × 175', kg: '34', price: 3260 },
        'Unlimited': { dims: '500 × 550 × 130', kg: '19', price: null },
      },
    },
  },

  // Cabinet is 480×600×175 / 40 kg. The Module Parameters table only lists
  // APF 85A / APF 100A, so those two are the only module ratings this page
  // offers (2026-10-26: 50/75/150/200A dropped from the page + this table).
  'anti-pollution-hv-ahf': {
    prefix: 'ANTI_POLLUTION_HV_AHF_',
    defaultCurrent: '100A',
    rows: {
      '85A': { dims: '480 × 600 × 175', kg: '40', price: 4280 },
      '100A': { dims: '480 × 600 × 175', kg: '40', price: 4280 },
      'Unlimited': { dims: '480 × 600 × 175', kg: '40', price: null },
    },
  },

  'distributed-ahf': {
    prefix: 'DISTRIBUTED_AHF_',
    defaultCurrent: '50A',
    rows: {
      '30A': { dims: '380 × 400 × 88', kg: '11.5', price: 910 },
      '50A': { dims: '380 × 400 × 88', kg: '11.5', price: 1080 },
      'Unlimited': { dims: '380 × 400 × 88', kg: '11.5', price: null },
    },
  },

  'sic-fanless-ahf': {
    prefix: 'SIC_FANLESS_AHF_',
    defaultCurrent: '50A',
    rows: {
      '50A': { dims: '515 × 500 × 185', kg: '18', price: 2400 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  // 2026-10-26: this page ships a single 25A module (+ parallel) only.
  'ip65-sic-fanless-ahf': {
    prefix: 'SIC_FANLESS_AHF_',
    defaultCurrent: '25A',
    rows: {
      '25A': { dims: '515 × 500 × 185', kg: '18', price: 1900 },
      'Unlimited': { dims: '515 × 500 × 185', kg: '18', price: null },
    },
  },

  // This page has no Net Weight row, so the SKU line carries dimensions only.
  'ip65-ahf': {
    prefix: 'IP65_AHF_',
    defaultCurrent: '100A',
    rows: {
      '100A': { dims: '600 × 220 × 500', kg: '', price: 1900 },
      '150A': { dims: '600 × 220 × 500', kg: '', price: 2460 },
      'Unlimited': { dims: '600 × 220 × 500', kg: '', price: null },
    },
  },

  'ultra-slim-ahf': {
    prefix: 'ULTRA_SLIM_AHF_',
    defaultCurrent: '8A',
    rows: {
      '8A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      '15A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      '20A': { dims: '340 × 410 × 45', kg: '7.5', price: 910 },
      'Unlimited': { dims: '340 × 410 × 45', kg: '7.5', price: null },
    },
  },
};

// Formatting / lookup helpers live in ./sku.js so the SVG table can share them.
export { skuRow, skuTail, skuPrice, skuPartNo } from './sku.js';
