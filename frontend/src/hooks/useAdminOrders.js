import { useCallback, useEffect, useState } from "react";
import { fetchAllOrders } from "../services/orderService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

/** Loads every order in the store (Admin). Returns { orders, status, error, reload, setOrders }. */
export default function useAdminOrders() {
  const [state, setState] = useState({ orders: [], status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchAllOrders({ signal: controller.signal })
      .then((orders) => setState({ orders, status: "success", error: "" }))
      .catch((error) => {
        if (isCancelledRequest(error)) return;
        setState({
          orders: [],
          status: "error",
          error: getErrorMessage(error, "Unable to load orders. Please try again."),
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    setAttempt((n) => n + 1);
  }, []);

  // Lets a status update reflect instantly without a full reload.
  const setOrders = useCallback((updater) => {
    setState((prev) => ({ ...prev, orders: updater(prev.orders) }));
  }, []);

  return { ...state, reload, setOrders };
}
