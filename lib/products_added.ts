// lib/products_added.ts
// Extra products for Urban Axis. These merge with lib/products.ts automatically via productUtils patch.
// Tip: adjust prices, tags, gender as needed.

const added = [
  // ==== JEANS SET A ====
  {
    title: 'Washed Straight Cargo Jeans',
    slug: 'washed-straight-cargo-jeans-a',
    price: 64.00,
    category: 'bottoms',
    gender: 'men',
    tags: ['jeans','denim','cargo','men','streetwear'],
    colors: ['washed-blue'],
    imagesByColor: {
      'washed-blue': [
        'https://ae-pic-a1.aliexpress-media.com/kf/S9dc10820328e4154bb6008a77e3e6366i.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sb3914d9ec5094d65a08886b0aed34269S.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S0ef43be212574348a11ecee783f52052B.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sc9ed731f9fc045cdb3139db738fca606U.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S9df1db45e27a4b0c8c66efd762aed1c9m.jpg_960x960q75.jpg_.avif'
      ]
    }
  },

  // ==== JEANS SET B ====
  {
    title: 'Vintage Baggy Denim',
    slug: 'vintage-baggy-denim-b',
    price: 59.00,
    category: 'bottoms',
    gender: 'men',
    tags: ['jeans','denim','baggy','men','streetwear'],
    colors: ['vintage-blue'],
    imagesByColor: {
      'vintage-blue': [
        'https://ae-pic-a1.aliexpress-media.com/kf/S0519433858b343dd85aab01a468be6c9N.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sff0175608eb54769bde51eabc298e5beE.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S53d293add987474c864dd510d723b846J.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sb9eb5ce5a16241bfabe8a7f1206ecb24i.jpg_960x960q75.jpg_.avif'
      ]
    }
  },

  // ==== FEATURED JEANS (ONLY OPTION COLOR: 3) ====
  {
    title: 'Featured Wide-Leg Jeans — Option 3',
    slug: 'featured-wide-leg-jeans-option-3',
    price: 72.00,
    category: 'bottoms',
    gender: 'men',
    tags: ['jeans','denim','wide-leg','featured','men'],
    colors: ['3'], // ONLY color 3 as requested
    imagesByColor: {
      '3': [
        'https://ae-pic-a1.aliexpress-media.com/kf/Sf667c7fa3d6940aeb38994f1842f7fedp.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sf5f12e50eeb44843809561b82196c742a.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S49623ac15c0540b78d8795ae8bb3360bN.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S477e84cc93804caa97539661ae24158ec.jpg_960x960q75.jpg_.avif'
      ]
    }
  },

  // ==== HOODIE (rename) ====
  {
    title: 'No Money But Love Pullover Hoodie',
    slug: 'no-money-but-love-hoodie',
    price: 48.00,
    category: 'tops',
    gender: 'men', // change to 'women' or remove for unisex if you prefer
    tags: ['hoodie','pullover','graphic','unisex','streetwear'],
    colors: ['picture'], // ONLY picture color option as requested
    imagesByColor: {
      'picture': [
        'https://ae-pic-a1.aliexpress-media.com/kf/S291fcf00a20f4e31bfb841abd2c88731Y.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S571fc69a155f461ea22ff74616120268J.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S60caa88b418240ae92e66594f15b1cd0x.jpg_960x960q75.jpg_.avif'
      ]
    },
    sizes: ['S','M','L','XL']
  },

  // ==== EXTRA TOP (no rename given; added as graphic tee/hoodie alt) ====
  {
    title: 'Minimal Street Graphic Top',
    slug: 'minimal-street-graphic-top',
    price: 32.00,
    category: 'tops',
    gender: 'men',
    tags: ['top','tee','graphic','streetwear','unisex'],
    colors: ['look-1'],
    imagesByColor: {
      'look-1': [
        'https://ae-pic-a1.aliexpress-media.com/kf/S95136b593cd54b6383b385b90551ee7ah.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sfd8e73dce4a94d0491cb82f0b85d85dd1.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S0e0ec4ffc8864f22bd90ca827360c38df.jpg_960x960q75.jpg_.avif'
      ]
    }
  },

  // ==== JACKET (rename) ====
  {
    title: 'Oversized Puffer Jacket',
    slug: 'oversized-puffer-jacket',
    price: 96.00,
    category: 'jackets',
    gender: 'men',
    tags: ['jacket','puffer','outerwear','winter','oversized'],
    colors: ['black','blue','khaki','white','gray'],
    imagesByColor: {
      'black': ['https://ae-pic-a1.aliexpress-media.com/kf/S7fe9390baf024a41b8f2e94c52357641Z.jpg_960x960q75.jpg_.avif'],
      'blue':  ['https://ae-pic-a1.aliexpress-media.com/kf/S75d99ef1873b49f1973d196e3a22be22G.jpg_960x960q75.jpg_.avif'],
      'khaki': ['https://ae-pic-a1.aliexpress-media.com/kf/S3608f5f9874349d8aa9a1e02e71add52K.jpg_960x960q75.jpg_.avif'],
      'white': ['https://ae-pic-a1.aliexpress-media.com/kf/Sdf1e94e8c00b406e82342e98bf5baa01T.jpg_960x960q75.jpg_.avif'],
      'gray':  ['https://ae-pic-a1.aliexpress-media.com/kf/Sf927065a821b40618a24fe49894c6418V.jpg_960x960q75.jpg_.avif']
    },
    sizes: ['S','M','L','XL']
  },

  // ==== VEST (rename) ====
  {
    title: 'Sleeveless Cargo Tech Vest',
    slug: 'sleeveless-cargo-tech-vest',
    price: 58.00,
    category: 'jackets',
    gender: 'men',
    tags: ['vest','techwear','utility','cargo','outerwear'],
    colors: ['black'],
    imagesByColor: {
      'black': [
        'https://ae-pic-a1.aliexpress-media.com/kf/S2f6292b2f23b4ff6a78e061e5cb4dfa6O.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/Sf351b77f7e4247ebbc5fc52a27ab0107S.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S67fe1b8f3f5d41029e80618912b51b92e.jpg_960x960q75.jpg_.avif',
        'https://ae-pic-a1.aliexpress-media.com/kf/S3c40bf6b6b884d66b812da2cc0485024u.jpg_960x960q75.jpg_.avif'
      ]
    },
    sizes: ['S','M','L','XL']
  }
];

export default added;
