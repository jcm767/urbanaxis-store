export type CartItem = {
  slug: string;
  title: string;
  price: number;
  qty: number;
  size?: string | null;
  color?: string | null;
  image?: string;
};

const CART_KEY = 'cart';

function read(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart:update'));
}

export function getCart(): CartItem[] { return read(); }
export function setCart(items: CartItem[]) { write(items); }

export function addItem(item: CartItem) {
  const cart = read();
  const idx = cart.findIndex(
    (x) =>
      x.slug === item.slug &&
      (x.size ?? null) === (item.size ?? null) &&
      (x.color ?? null) === (item.color ?? null)
  );
  if (idx >= 0) cart[idx].qty += item.qty;
  else cart.push({ ...item });
  write(cart);
}

export function updateQty(slug: string, size: string | null, qty: number, color: string | null = null) {
  const cart = read();
  const idx = cart.findIndex((x) => x.slug === slug && (x.size ?? null) === (size ?? null) && (x.color ?? null) === (color ?? null));
  if (idx >= 0) {
    cart[idx].qty = Math.max(1, Math.min(99, Math.floor(qty || 1)));
    write(cart);
  }
}

export function updateSize(slug: string, oldSize: string | null, newSize: string | null, color: string | null = null) {
  const cart = read();
  const idx = cart.findIndex((x) => x.slug === slug && (x.size ?? null) === (oldSize ?? null) && (x.color ?? null) === (color ?? null));
  if (idx >= 0) {
    cart[idx].size = newSize;
    write(cart);
  }
}

export function updateColor(slug: string, size: string | null, oldColor: string | null, newColor: string | null) {
  const cart = read();
  const idx = cart.findIndex((x) => x.slug === slug && (x.size ?? null) === (size ?? null) && (x.color ?? null) === (oldColor ?? null));
  if (idx >= 0) {
    cart[idx].color = newColor;
    write(cart);
  }
}

export function removeItem(slug: string, size: string | null, color: string | null = null) {
  const cart = read().filter((x) => !(x.slug === slug && (x.size ?? null) === (size ?? null) && (x.color ?? null) === (color ?? null)));
  write(cart);
}

export function clearCart() { write([]); }
