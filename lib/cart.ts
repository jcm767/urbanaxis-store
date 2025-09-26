export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  gender: string;
  category: string;
  tags?: string[];
  quantity: number;
};

let cart: CartItem[] = [];

export function addItem(item: CartItem) {
  const existing = cart.find(p => p.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  return cart;
}

export function getCart() {
  return cart;
}
