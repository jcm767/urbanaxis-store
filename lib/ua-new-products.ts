// lib/ua-new-products.ts
// Curated overlay: showcase items come first on Home & appear in category pages via loadAllProducts()
export type UACurated = {
  id?: string;
  title: string;
  price: number | string;
  gender: "men" | "women";
  category: "tops" | "bottoms" | "jackets" | "accessories";
  url: string;              // canonical product URL (AliExpress or your PDP)
  images: string[];         // first image is primary
  tags?: string[];
  // Optional extras that won't break anything else:
  slug?: string;            // derived if omitted
  image?: string;           // if present, takes precedence as primary
};

export const UA_NEW_PRODUCTS: UACurated[] = [
  {
    title: "UA Premium Distressed Denim — Grey",
    price: 79.0,
    gender: "men",
    category: "bottoms",
    url: "https://www.aliexpress.com/item/1005001234567890.html",
    images: [
      "https://ae01.alicdn.com/kf/Sabcd1234/grey-denim-1.jpg",
      "https://ae01.alicdn.com/kf/Sabcd1234/grey-denim-2.jpg"
    ],
    tags: ["denim", "streetwear", "grey"],
  },
  {
    title: "UA Oversized Black Hoodie — Heavyweight",
    price: 69.0,
    gender: "men",
    category: "tops",
    url: "https://www.aliexpress.com/item/1005001234567891.html",
    images: [
      "https://ae01.alicdn.com/kf/Sbcde2345/black-hoodie-1.jpg",
      "https://ae01.alicdn.com/kf/Sbcde2345/black-hoodie-2.jpg"
    ],
    tags: ["hoodie", "oversized", "heavyweight"],
  },
  {
    title: "UA Cropped Puffer Jacket — Onyx",
    price: 119.0,
    gender: "women",
    category: "jackets",
    url: "https://www.aliexpress.com/item/1005001234567892.html",
    images: [
      "https://ae01.alicdn.com/kf/Scdef3456/onyx-puffer-1.jpg",
      "https://ae01.alicdn.com/kf/Scdef3456/onyx-puffer-2.jpg"
    ],
    tags: ["puffer", "cropped", "winter"],
  },
  {
    title: "UA Ribbed Tank 2-Pack — Jet Black",
    price: 34.0,
    gender: "women",
    category: "tops",
    url: "https://www.aliexpress.com/item/1005001234567893.html",
    images: [
      "https://ae01.alicdn.com/kf/Sdefg4567/ribbed-tank-1.jpg",
      "https://ae01.alicdn.com/kf/Sdefg4567/ribbed-tank-2.jpg"
    ],
    tags: ["tank", "essentials"],
  },
  {
    title: "UA Minimal Leather Belt — Matte Buckle",
    price: 39.0,
    gender: "men",
    category: "accessories",
    url: "https://www.aliexpress.com/item/1005001234567894.html",
    images: [
      "https://ae01.alicdn.com/kf/Sefff5678/leather-belt-1.jpg"
    ],
    tags: ["belt", "leather"],
  },
  {
    title: "UA Cargo Skirt — Utility Olive",
    price: 59.0,
    gender: "women",
    category: "bottoms",
    url: "https://www.aliexpress.com/item/1005001234567895.html",
    images: [
      "https://ae01.alicdn.com/kf/Sf1116789/cargo-skirt-1.jpg",
      "https://ae01.alicdn.com/kf/Sf1116789/cargo-skirt-2.jpg"
    ],
    tags: ["cargo", "utility"],
  },
  {
    title: "UA Tech Crossbody — Night Grey",
    price: 44.0,
    gender: "men",
    category: "accessories",
    url: "https://www.aliexpress.com/item/1005001234567896.html",
    images: [
      "https://ae01.alicdn.com/kf/Sf2227890/crossbody-1.jpg"
    ],
    tags: ["bag", "crossbody", "techwear"],
  },
  {
    title: "UA Cropped Zip Hoodie — Ash",
    price: 64.0,
    gender: "women",
    category: "tops",
    url: "https://www.aliexpress.com/item/1005001234567897.html",
    images: [
      "https://ae01.alicdn.com/kf/Sf3338901/cropped-hoodie-1.jpg",
      "https://ae01.alicdn.com/kf/Sf3338901/cropped-hoodie-2.jpg"
    ],
    tags: ["hoodie", "zip", "cropped"],
  }
];
