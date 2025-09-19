// lib/products.ts
export type Product = {
  slug: string;
  name: string;
  price: number;        // USD
  description?: string;
  image?: string;       // a full URL you allowed in next.config.js
  sourceUrl?: string;   // AliExpress (for your fulfillment)
};

export const products: Product[] = [
  {
    slug: "oversized-puffer-jacket",
    name: "Oversized Puffer Jacket",
    price: 116.94,
    description:
      "Warm oversized puffer with a relaxed streetwear fit. Wind-resistant shell and lightweight fill for everyday wear.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc3824686fd794c51a341f60a97e032d3F.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256807592670922.html",
  },
  {
    slug: "3-pack-graphic-tees",
    name: "3-Pack Graphic Tees",
    price: 6.99,
    description:
      "3-pack casual streetwear tees. Slim fit. Ultra-soft cotton blend for daily wear.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/S3eeb50bf1685499ca1e2c6fc8950639dp.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256808142910422.html",
  },
  {
    slug: "oversized-knit-hoodie",
    name: "Oversized Knit Hoodie",
    price: 12.28,
    description:
      "Chunky-knit hoodie with oversized drape. Soft hand-feel with casual, relaxed silhouette.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/S6c2bcdc12ef547a9ba4a5040d4d39b30o.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256807826452830.html",
  },
  {
    slug: "zipper-streetwear-hoodie",
    name: "Zipper Streetwear Hoodie",
    price: 10.57,
    description:
      "Casual unisex streetwear hoodie with zipper detail. Soft fleece lining for everyday comfort.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc7e5bf0a231c4f1c90c64d4fde972bbe8.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256809250505795.html",
  },
  {
    slug: "retro-hooded-windbreaker",
    name: "Retro Hooded Windbreaker",
    price: 67.22,
    description:
      "Lightweight, water-repellent windbreaker with retro color-blocking. Urban-ready and packable.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/S26989e07241d42a5bb9e5876922da11bG.png_960x960.png_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256809776704174.html",
  },
  {
    slug: "oversized-graphic-tee",
    name: "Oversized Graphic Tee",
    price: 74.63, // set whatever price you want to charge
    description:
      "Soft cotton tee with oversized fit and bold front graphic. Unisex cut.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/S7349337a73b9400283e531901d8503c1Y.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256809234642944.html",
  },
  {
    slug: "minimalist-street-tee",
    name: "Minimalist Street Tee",
    price: 20.71,
    description:
      "Clean minimalist tee with durable neckline and smooth, breathable fabric.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/Se2d318002302421fbddd58d991b4d8f1a.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256808606874458.html",
  },
  {
    slug: "oversized-graphic-tee-alt",
    name: "Oversized Graphic Tee (Alt)",
    price: 23.34,
    description:
      "Oversized fit tee with bold graphic print. Street-ready and comfortable.",
    image:
      "https://ae-pic-a1.aliexpress-media.com/kf/Se2d318002302421fbddd58d991b4d8f1a.jpg_960x960q75.jpg_.avif",
    sourceUrl:
      "https://www.aliexpress.us/item/3256809111025598.html",
  },
];
