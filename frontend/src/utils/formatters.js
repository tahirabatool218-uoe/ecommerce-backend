import { CURRENCY, LOW_STOCK_THRESHOLD } from "../config";

const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? priceFormatter.format(amount) : "";
}

/** Maps a stock count to a display status used by badges and copy. */
export function getAvailability(stock) {
  const count = Number(stock);
  if (!Number.isFinite(count) || count <= 0) {
    return { key: "out", label: "Out of stock" };
  }
  if (count <= LOW_STOCK_THRESHOLD) {
    return { key: "low", label: `Only ${count} left` };
  }
  return { key: "in", label: "In stock" };
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
