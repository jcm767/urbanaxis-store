export type UACategory = "tops"|"bottoms"|"jackets"|"accessories";
export type UAGender = "men"|"women";
export type Curated = { id?: string; title: string; price: number|string; gender: UAGender; category: UACategory; url: string; images: string[]; tags?: string[]; };
export const UA_NEW_PRODUCTS: Curated[] = [
  { id:"ua-denim-1", title:"Street Patch Denim", price:49.99, gender:"men", category:"bottoms",
    url:"https://www.aliexpress.us/item/1005006311399558.html",
    images:["https://ae01.alicdn.com/kf/S9b9a9a70fb3a4f21b8b6b8b7d613a7b2G.jpg"], tags:["denim","streetwear"] },
  { id:"ua-knit-1", title:"Striped Knit Pullover", price:32, gender:"women", category:"tops",
    url:"https://www.aliexpress.us/item/3256806078260897.html",
    images:["https://ae01.alicdn.com/kf/Sb1c1b0d2c0a14cd6a335c5f2a0f8e75do.jpg"], tags:["knit","cozy"] },
  { id:"ua-hoodie-1", title:"Oversized Knit Hoodie", price:39, gender:"men", category:"tops",
    url:"https://www.aliexpress.us/item/3256806160734708.html",
    images:["https://ae01.alicdn.com/kf/Sd3d9c1a0bb8c4f1e8c1b516bd97f4f89B.jpg"], tags:["hoodie","oversized"] },
  { id:"ua-puffer-1", title:"Oversized Puffer Jacket", price:69, gender:"women", category:"jackets",
    url:"https://www.aliexpress.us/item/1005006391331906.html",
    images:["https://ae01.alicdn.com/kf/Sb9a5ad6b4b4143f2a4a2d9e1e6e6b8f72.jpg"], tags:["puffer","winter"] },
  { id:"ua-shell-1", title:"Utility Wind Jacket", price:59, gender:"men", category:"jackets",
    url:"https://www.aliexpress.us/item/1005006163236272.html",
    images:["https://ae01.alicdn.com/kf/Sb7c8e9f0123848b39d4ce5a0562a0b28F.jpg"], tags:["windbreaker","utility"] },
  { id:"ua-cap-1", title:"Washed Canvas Cap", price:14.5, gender:"women", category:"accessories",
    url:"https://www.aliexpress.us/item/1005006228601900.html",
    images:["https://ae01.alicdn.com/kf/S2c3c6d2bb4a04666ab2b3e9a74a30ff9C.jpg"], tags:["cap","accessory"] }
];
