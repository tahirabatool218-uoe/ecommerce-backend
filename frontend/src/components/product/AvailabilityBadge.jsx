import { getAvailability } from "../../utils/formatters";

export default function AvailabilityBadge({ stock }) {
  const { key, label } = getAvailability(stock);
  return <span className={`badge badge--${key}`}>{label}</span>;
}
