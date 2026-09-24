import { useCallback, useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";
import { getErrorMessage, isCancelledRequest, isNotFoundError } from "../utils/errors";
import { isValidProductId } from "../utils/products";

/**
 * Loads a single product.
 * status: "loading" | "success" | "not-found" | "error"
 *
 * Only settled results are stored (tagged with the id they belong to);
 * "loading" is derived, so a stale result is never shown for a new id.
 */
export default function useProduct(id) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // The backend answers malformed ids with a 500, so treat them as
  // "not found" without sending a request that can't succeed.
  const isInvalidId = !isValidProductId(id);

  useEffect(() => {
    if (isInvalidId) return undefined;

    const controller = new AbortController();

    fetchProductById(id, { signal: controller.signal })
      .then((product) =>
        setResult(
          product
            ? { id, product, status: "success", error: "" }
            : { id, product: null, status: "not-found", error: "" },
        ),
      )
      .catch((error) => {
        if (isCancelledRequest(error)) return;
        if (isNotFoundError(error)) {
          setResult({ id, product: null, status: "not-found", error: "" });
          return;
        }
        setResult({
          id,
          product: null,
          status: "error",
          error: getErrorMessage(error, "Unable to load this product. Please try again."),
        });
      });

    return () => controller.abort();
  }, [id, attempt, isInvalidId]);

  const reload = useCallback(() => {
    setResult(null);
    setAttempt((n) => n + 1);
  }, []);

  if (isInvalidId) {
    return { product: null, status: "not-found", error: "", reload };
  }
  if (result?.id !== id) {
    return { product: null, status: "loading", error: "", reload };
  }
  return { product: result.product, status: result.status, error: result.error, reload };
}
