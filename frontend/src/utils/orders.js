/** Short, human-friendly order reference, e.g. "#4F2A9C". */
export function shortOrderId(id) {
  return `#${String(id ?? "").slice(-6).toUpperCase()}`;
}

export function formatOrderDate(value, { withTime = false } = {}) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const options = withTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleString("en-PK", options);
}

/** Same status → badge mapping the dashboard already uses. */
export function orderStatusBadgeClass(status) {
  const key = (status || "").toLowerCase();
  if (key === "delivered") return "badge badge--in";
  if (key === "cancelled") return "badge badge--out";
  return "badge badge--low";
}
