export interface UAProduct {
  id: string;
  title: string;
  price: number;
  gender: "men" | "women";
  category: "tops" | "bottoms" | "jackets" | "accessories";
  images: string[];
  url: string;
  tags?: string[];
}

export const UA_NEW_PRODUCTS: UAProduct[] = [
  {
    id: "denim-1",
    title: "Street Patch Denim",
    price: 49.99,
    gender: "men",
    category: "bottoms",
    images: ["https://ae01.alicdn.com/kf/HTB1qtfzX9rqK1RjSZK9q6xyypXaw.jpg"],
    url: "https://www.aliexpress.us/item/1005006311390558.html",
    tags: ["denim","streetwear"]
  },
  {
    id: "knit-1",
    title: "Striped Knit Pullover",
    price: 32,
    gender: "women",
    category: "tops",
    images: ["https://ae01.alicdn.com/kf/S3cda1cd3a3565f2a108ef75d0.jpg"],
    url: "https://www.aliexpress.us/item/32660872608697.html",
    tags: ["knit","cozy"]
  }
];
