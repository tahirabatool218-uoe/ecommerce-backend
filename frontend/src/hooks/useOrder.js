import { useCallback, useEffect, useState } from "react";
import { fetchOrderById } from "../services/orderService";
import {
  getErrorMessage,
  isCancelledRequest,
  isForbiddenError,
  isNotFoundError,
} from "../utils/errors";
import { isValidProductId } from "../utils/products";

/**
 * Loads a single order belonging to the logged-in user.
 * status: "loading" | "success" | "not-found" | "error"
 *
 * Mirrors useProduct: only settled results are stored (tagged with their id)
 * and "loading" is derived, so a stale order is never shown for a new id.
 * A 403 is reported as "not-found" so other users' order ids aren't confirmed.
 */
export default function useOrder(id) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // The backend answers malformed ids with a 500 (cast error), so treat them
  // as "not found" without sending a request that can't succeed.
  const isInvalidId = !isValidProductId(id);

  useEffect(() => {
    if (isInvalidId) return undefined;

    const controller = new AbortController();

    fetchOrderById(id, { signal: controller.signal })
      .then((order) =>
        setResult(
          order
            ? { id, order, status: "success", error: "" }
            : { id, order: null, status: "not-found", error: "" },
        ),
      )
      .catch((error) => {
        if (isCancelledRequest(error)) return;
        if (isNotFoundError(error) || isForbiddenError(error)) {
          setResult({ id, order: null, status: "not-found", error: "" });
          return;
        }
        setResult({
          id,
          order: null,
          status: "error",
          error: getErrorMessage(error, "Unable to load this order. Please try again."),
        });
      });

    return () => controller.abort();
  }, [id, attempt, isInvalidId]);

  const reload = useCallback(() => {
    setResult(null);
    setAttempt((n) => n + 1);
  }, []);

  if (isInvalidId) {
    return { order: null, status: "not-found", error: "", reload };
  }
  if (result?.id !== id) {
    return { order: null, status: "loading", error: "", reload };
  }
  return { order: result.order, status: result.status, error: result.error, reload };
}
