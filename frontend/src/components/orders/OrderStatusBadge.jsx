import { orderStatusBadgeClass } from "../../utils/orders";

export default function OrderStatusBadge({ status }) {
  return <span className={orderStatusBadgeClass(status)}>{status || "Pending"}</span>;
}
