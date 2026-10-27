/** Shared helpers for the SKU tables (AHF / SVG). */

/** Resolve one SKU row: per-voltage override first, then the shared rows. */
export function skuRow(table, current, voltage) {
  const ov = table.byVoltage && table.byVoltage[voltage];
  if (ov && ov[current]) return ov[current];
  return table.rows[current] || null;
}

/** "500 × 550 × 130 mm · 24 kg" — kg segment dropped when the page has no net weight. */
export function skuTail(row) {
  return row.dims + ' mm' + (row.kg ? ' · ' + row.kg + ' kg' : '');
}

/**
 * Shown instead of a number when the price is not settled yet, i.e. the row
 * carries `price: null`. Change this one string to relabel every such row
 * across all 16 AHF / SVG pages (and the ledgers).
 */
export const PRICE_TBD = '？？';

/** "Estimated 1300$(EXW)" — or the placeholder when price is null. */
export function skuPrice(row) {
  if (row.price === null || row.price === undefined) return PRICE_TBD;
  return 'Estimated ' + row.price + '$(EXW)';
}

/** Full part number for one configuration, e.g. CHITEK-SiC-AHF-100A-400V-Rack-IP20 */
export function skuPartNo(table, current, voltage, install, ip) {
  return table.prefix + current + '-' + voltage + '-' + install + '-' + ip;
}
