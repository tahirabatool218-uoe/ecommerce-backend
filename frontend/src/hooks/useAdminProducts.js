import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

/**
 * Loads the product list for the admin products page.
 * Same data source as the public useProducts hook, plus a setProducts
 * escape hatch so add/edit/delete can update the list without a refetch.
 */
export default function useAdminProducts() {
  const [state, setState] = useState({ products: [], status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal })
      .then((products) => setState({ products, status: "success", error: "" }))
      .catch((error) => {
        if (isCancelledRequest(error)) return;
        setState({
          products: [],
          status: "error",
          error: getErrorMessage(error, "Unable to load products. Please try again."),
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    setAttempt((n) => n + 1);
  }, []);

  const setProducts = useCallback((updater) => {
    setState((prev) => ({ ...prev, products: updater(prev.products) }));
  }, []);

  return { ...state, reload, setProducts };
}
