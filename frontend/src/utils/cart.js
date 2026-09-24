/** Safe accessor: the cart (or its items) may be null before/after the API call. */
export function getCartItems(cart) {
  return Array.isArray(cart?.items) ? cart.items : [];
}

/**
 * Returns why a cart line can't currently be ordered, or null if it's fine.
 * - unavailable: the product was deleted (the API populates it as null)
 * - out:         the product has no stock left
 * - stock:       the requested quantity exceeds what's left
 */
export function getItemIssue(item) {
  const product = item?.product;
  if (!product || typeof product !== "object") {
    return { key: "unavailable", message: "This product is no longer available." };
  }
  const stock = Number(product.stock);
  if (!Number.isFinite(stock) || stock <= 0) {
    return { key: "out", message: "This product is out of stock." };
  }
  if (item.quantity > stock) {
    return {
      key: "stock",
      message: `Only ${stock} left in stock. Lower the quantity to continue.`,
    };
  }
  return null;
}

export function getLineTotal(price, quantity) {
  return Math.round(Number(price) * Number(quantity) * 100) / 100;
}

/** Totals are derived client-side; the API returns raw cart lines only. */
export function summarizeCart(cart) {
  const items = getCartItems(cart);
  let itemCount = 0;
  let total = 0;
  let issueCount = 0;

  for (const item of items) {
    if (getItemIssue(item)) issueCount += 1;
    // Deleted products have no price, so they count toward neither figure.
    if (item.product) {
      itemCount += Number(item.quantity) || 0;
      total += getLineTotal(item.product.price, item.quantity);
    }
  }

  return {
    items,
    itemCount,
    total: Math.round(total * 100) / 100,
    issueCount,
    isEmpty: items.length === 0,
    canCheckout: items.length > 0 && issueCount === 0,
  };
}
