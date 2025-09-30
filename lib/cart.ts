export type CartItem = {
  id: string;           // use product slug (or any unique id)
  title: string;
  price: number;        // numeric dollars
  image?: string;
  size?: string;        // optional variant size
  quantity: number;     // integer >= 1
};

let cart: CartItem[] = [];

// --- getters / setters ---
export function getCart(): CartItem[] {
  return cart;
}
export function setCart(items: CartItem[]): void {
  cart = Array.isArray(items) ? items : [];
}

// --- add / update / remove ---
export function addItem(
  item: Omit<CartItem, "quantity"> & { quantity?: number }
): void {
  const qty = Math.max(1, Math.floor(item.quantity ?? 1));
  const existing = cart.find(c => c.id === item.id && c.size === item.size);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
}

export function updateQty(
  id: string,
  size?: string | null,
  qty?: number
): void {
  const target = cart.find(c => c.id === id && (size ?? undefined) === c.size);
  if (!target) return;
  const next = Math.max(1, Math.floor(qty ?? target.quantity));
  target.quantity = next;
}

export function updateSize(id: string, newSize?: string | null): void {
  const from = cart.find(c => c.id === id);
  if (!from) return;
  const desired = (newSize ?? undefined);
  if (from.size === desired) return;

  // If an item with the same id+newSize already exists, merge quantities.
  const existing = cart.find(c => c.id === id && c.size === desired);
  if (existing) {
    existing.quantity += from.quantity;
    // remove the old record
    cart = cart.filter(c => !(c.id === from.id && c.size === from.size));
  } else {
    from.size = desired;
  }
}

export function removeItem(id: string, size?: string | null): void {
  const matchSize = (size ?? undefined);
  cart = cart.filter(c => {
    if (c.id !== id) return true;
    // If size provided -> remove only that variant; otherwise remove all with id.
    return matchSize !== undefined ? c.size !== matchSize : false;
  });
}

export function clearCart(): void {
  cart = [];
}
