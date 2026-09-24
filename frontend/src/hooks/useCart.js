import { useCallback, useEffect, useState } from "react";
import { fetchCart } from "../services/cartService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

/**
 * Loads the logged-in user's cart.
 * Returns { cart, status, error, reload, setCart }.
 * `setCart` lets callers apply the cart returned by a mutation without
 * triggering a full reload (which would flash the loading state).
 */
export default function useCart() {
  const [state, setState] = useState({ cart: null, status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchCart({ signal: controller.signal })
      .then((cart) => setState({ cart, status: "success", error: "" }))
      .catch((error) => {
        if (isCancelledRequest(error)) return;
        setState({
          cart: null,
          status: "error",
          error: getErrorMessage(error, "Unable to load your cart. Please try again."),
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    setAttempt((n) => n + 1);
  }, []);

  const setCart = useCallback((cart) => {
    setState({ cart, status: "success", error: "" });
  }, []);

  return { ...state, reload, setCart };
}
