export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
};

const KEY = "ua_cart";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

let serverCart: CartItem[] = []; // SSR fallback

function readCart(): CartItem[] {
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
  return serverCart;
}

function writeCart(items: CartItem[]): CartItem[] {
  if (isBrowser()) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  } else {
    serverCart = items;
  }
  return items;
}

/** Public API used around the app */
export function getCart(): CartItem[] {
  return readCart();
}

export function setCart(items: CartItem[]): CartItem[] {
  return writeCart(items);
}

export function addItem(item: CartItem): CartItem[] {
  const cart = readCart();
  const idx = cart.findIndex(i => i.id === item.id && i.size === item.size);
  if (idx >= 0) {
    cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + (item.quantity || 1) };
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  return writeCart(cart);
}

export function updateQty(id: string, qty: number, size?: string): CartItem[] {
  const cart = readCart().map(i =>
    i.id === id && (size === undefined || i.size === size)
      ? { ...i, quantity: Math.max(1, Math.floor(qty || 1)) }
      : i
  );
  return writeCart(cart);
}

export function updateSize(id: string, size: string): CartItem[] {
  const cart = readCart().map(i => (i.id === id ? { ...i, size } : i));
  return writeCart(cart);
}

export function removeItem(id: string, size?: string): CartItem[] {
  const cart = readCart().filter(i => !(i.id === id && (size === undefined || i.size === size)));
  return writeCart(cart);
}

export function clearCart(): CartItem[] {
  return writeCart([]);
}
