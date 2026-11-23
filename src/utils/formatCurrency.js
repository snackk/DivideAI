/**
 * Formats a numeric amount as EUR currency using Intl.NumberFormat, honoring
 * locale-specific thousands/decimal separators (e.g. "1 234,56 €" for fr-FR).
 *
 * Falls back to a plain `value.toFixed(2) + ' €'` string if `value` is not a
 * finite number, or if constructing the Intl.NumberFormat instance itself
 * throws (e.g. a malformed locale string).
 *
 * @param {number} value - amount to format
 * @param {string} locale - BCP-47 locale tag or bare language code (e.g. "en", "fr-FR")
 * @returns {string}
 */
export function formatCurrency(value, locale) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return '0.00 €';
  }

  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(numericValue);
  } catch {
    return `${numericValue.toFixed(2)} €`;
  }
}
