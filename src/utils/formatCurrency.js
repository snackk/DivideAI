/**
 * Maps this app's bare i18n language codes to the BCP-47 regional locale tag
 * that produces the correct currency formatting convention for that
 * language's primary audience. Mirrors the mapping already used at
 * FriendDetailsView.jsx:22-24 for date formatting (same `i18n.language`
 * values, same choice of region per language, including 'en-US' not
 * 'en-GB'). Kept as an independent copy here rather than a shared helper,
 * per the task brief: this app is Portugal-focused, so the bare 'pt' code
 * must map to 'pt-PT' (symbol-last: "1234,56 €"), not be left bare, since
 * Intl.NumberFormat('pt', ...) defaults to the Brazilian convention
 * (symbol-first: "€ 1.234,56").
 */
const LOCALE_MAP = { pt: 'pt-PT', fr: 'fr-FR', en: 'en-US' };

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

  const resolvedLocale = LOCALE_MAP[locale] ?? locale;

  try {
    return new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: 'EUR' }).format(numericValue);
  } catch {
    return `${numericValue.toFixed(2)} €`;
  }
}
