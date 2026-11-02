/** One-off generator — run with: node scripts/generate-products.mjs */

const brands = [
  "brand-chitenge-house",
  "brand-mwape-studio",
  "brand-copper-cloth",
  "brand-zambezi-atelier",
  "brand-lusaka-label",
  "brand-mutale-made",
  "brand-savannah-form",
  "brand-baobab-blue",
  "brand-nkwazi-wear",
  "brand-kapiri-knit",
];

const catalog = [
  // Chitenge House — traditional + dresses
  { brand: 0, cat: "traditional", name: "Lusaka Market Wrap Dress", price: 680, colours: ["Chitenge Print", "Navy"], tags: ["chitenge", "wrap"] },
  { brand: 0, cat: "traditional", name: "Kamwala Two-Piece Set", price: 890, colours: ["Chitenge Print", "Gold"], tags: ["set", "occasion"] },
  { brand: 0, cat: "dresses", name: "Sunday Chitenge Midi", price: 750, colours: ["Chitenge Print", "Red"], tags: ["midi", "church"] },
  { brand: 0, cat: "tops", name: "Ankara Collar Blouse", price: 420, colours: ["Chitenge Print", "White"], tags: ["blouse"] },
  { brand: 0, cat: "accessories", name: "Wax Print Headwrap", price: 180, colours: ["Chitenge Print", "Gold"], tags: ["headwrap"], sizes: ["One Size"] },
  { brand: 0, cat: "bottoms", name: "Pleated Chitenge Skirt", price: 520, colours: ["Chitenge Print", "Navy"], tags: ["skirt"] },
  // Mwape Studio — tailored
  { brand: 1, cat: "outerwear", name: "Copper Peak Blazer", price: 1450, colours: ["Navy", "Black", "Brown"], tags: ["blazer", "tailoring"] },
  { brand: 1, cat: "bottoms", name: "Ndola Tailored Trouser", price: 780, colours: ["Black", "Navy", "Grey"], tags: ["trouser"] },
  { brand: 1, cat: "tops", name: "Quiet Silk Shirt", price: 650, colours: ["White", "Cream", "Sky"], tags: ["shirt"] },
  { brand: 1, cat: "dresses", name: "Boardroom Sheath Dress", price: 980, colours: ["Navy", "Black"], tags: ["workwear"] },
  { brand: 1, cat: "accessories", name: "Brushed Copper Belt", price: 320, colours: ["Brown", "Black"], tags: ["belt"], sizes: ["S", "M", "L"] },
  { brand: 1, cat: "tops", name: "Kitwe Oxford Shirt", price: 540, colours: ["White", "Sky", "Blue"], tags: ["oxford"] },
  // Copper & Cloth — workwear
  { brand: 2, cat: "tops", name: "Mine Town Work Shirt", price: 480, colours: ["Olive", "Brown", "Navy"], tags: ["workwear"] },
  { brand: 2, cat: "outerwear", name: "Copperbelt Field Jacket", price: 1200, colours: ["Olive", "Brown"], tags: ["jacket"] },
  { brand: 2, cat: "bottoms", name: "Utility Canvas Pant", price: 620, colours: ["Olive", "Black", "Brown"], tags: ["utility"] },
  { brand: 2, cat: "tops", name: "Soft Flannel Overshirt", price: 560, colours: ["Brown", "Grey", "Red"], tags: ["overshirt"] },
  { brand: 2, cat: "footwear", name: "Kitwe Leather Boot", price: 1350, colours: ["Brown", "Black"], tags: ["boots"], sizes: ["S", "M", "L", "XL"] },
  { brand: 2, cat: "accessories", name: "Waxed Canvas Tote", price: 390, colours: ["Brown", "Olive", "Navy"], tags: ["bag"], sizes: ["One Size"] },
  // Zambezi Atelier — fluid
  { brand: 3, cat: "dresses", name: "River Drift Maxi", price: 820, colours: ["Sky", "Cream", "Blue"], tags: ["maxi"] },
  { brand: 3, cat: "dresses", name: "Falls Mist Slip Dress", price: 710, colours: ["White", "Sky", "Pink"], tags: ["slip"] },
  { brand: 3, cat: "tops", name: "Livingstone Linen Tee", price: 340, colours: ["White", "Cream", "Sky"], tags: ["linen"] },
  { brand: 3, cat: "bottoms", name: "Wide Flow Trouser", price: 590, colours: ["Cream", "Navy", "White"], tags: ["wide-leg"] },
  { brand: 3, cat: "outerwear", name: "Mist Light Kimono", price: 640, colours: ["Sky", "Cream"], tags: ["kimono"] },
  { brand: 3, cat: "accessories", name: "River Stone Pendant", price: 280, colours: ["Gold", "Blue"], tags: ["jewellery"], sizes: ["One Size"] },
  // Lusaka Label — staples
  { brand: 4, cat: "bottoms", name: "Cairo Road Straight Jean", price: 680, colours: ["Blue", "Black", "Grey"], tags: ["denim"] },
  { brand: 4, cat: "tops", name: "Levy Junction Tee", price: 220, colours: ["White", "Black", "Navy", "Sky"], tags: ["tee"] },
  { brand: 4, cat: "tops", name: "Manda Hill Poplin Shirt", price: 450, colours: ["White", "Sky", "Pink"], tags: ["poplin"] },
  { brand: 4, cat: "dresses", name: "Weekend Shirt Dress", price: 580, colours: ["White", "Navy", "Olive"], tags: ["shirt-dress"] },
  { brand: 4, cat: "bottoms", name: "Everyday Chino", price: 520, colours: ["Cream", "Navy", "Olive"], tags: ["chino"] },
  { brand: 4, cat: "outerwear", name: "City Denim Jacket", price: 890, colours: ["Blue", "Black"], tags: ["denim"] },
  // Mutale Made — handmade
  { brand: 5, cat: "accessories", name: "Chongwe Beaded Clutch", price: 450, colours: ["Gold", "Black", "Red"], tags: ["beaded", "bag"], sizes: ["One Size"] },
  { brand: 5, cat: "accessories", name: "Handloom Cotton Scarf", price: 260, colours: ["Cream", "Sky", "Olive"], tags: ["scarf"], sizes: ["One Size"] },
  { brand: 5, cat: "tops", name: "Soft Handknit Vest", price: 580, colours: ["Cream", "Grey", "Navy"], tags: ["knit"] },
  { brand: 5, cat: "accessories", name: "Copper Coil Earrings", price: 190, colours: ["Gold", "Brown"], tags: ["jewellery"], sizes: ["One Size"] },
  { brand: 5, cat: "footwear", name: "Woven Market Sandal", price: 420, colours: ["Brown", "Cream"], tags: ["sandal"], sizes: ["S", "M", "L", "XL"] },
  { brand: 5, cat: "accessories", name: "Raffia Market Basket", price: 310, colours: ["Cream", "Brown"], tags: ["basket"], sizes: ["One Size"] },
  // Savannah Form — architectural
  { brand: 6, cat: "dresses", name: "Column Cut Midi", price: 920, colours: ["Black", "Navy", "White"], tags: ["structured"] },
  { brand: 6, cat: "tops", name: "Angular Crop Top", price: 380, colours: ["Black", "White", "Sky"], tags: ["crop"] },
  { brand: 6, cat: "bottoms", name: "Panelled Culotte", price: 640, colours: ["Black", "Cream", "Olive"], tags: ["culotte"] },
  { brand: 6, cat: "outerwear", name: "Structured Cape Coat", price: 1580, colours: ["Navy", "Black"], tags: ["cape"] },
  { brand: 6, cat: "tops", name: "Asymmetric Hem Blouse", price: 490, colours: ["White", "Sky", "Black"], tags: ["blouse"] },
  { brand: 6, cat: "dresses", name: "Heatwave Shift Dress", price: 760, colours: ["White", "Olive", "Blue"], tags: ["shift"] },
  // Baobab & Blue — indigo/earth
  { brand: 7, cat: "dresses", name: "Indigo Baobab Dress", price: 840, colours: ["Blue", "Navy", "Sky"], tags: ["indigo"] },
  { brand: 7, cat: "tops", name: "Earth Dye Peasant Top", price: 410, colours: ["Cream", "Brown", "Olive"], tags: ["peasant"] },
  { brand: 7, cat: "bottoms", name: "Soft Indigo Skirt", price: 550, colours: ["Blue", "Navy"], tags: ["skirt"] },
  { brand: 7, cat: "dresses", name: "Cream Courtyard Dress", price: 780, colours: ["Cream", "White"], tags: ["courtyard"] },
  { brand: 7, cat: "tops", name: "Sky Lounge Set Top", price: 360, colours: ["Sky", "Cream", "White"], tags: ["lounge"] },
  { brand: 7, cat: "bottoms", name: "Sky Lounge Set Pant", price: 390, colours: ["Sky", "Cream", "White"], tags: ["lounge"] },
  // Nkwazi Wear — active
  { brand: 8, cat: "activewear", name: "Eagle Run Short", price: 320, colours: ["Black", "Navy", "Blue"], tags: ["run"] },
  { brand: 8, cat: "activewear", name: "Training Mesh Tee", price: 280, colours: ["Black", "White", "Sky"], tags: ["training"] },
  { brand: 8, cat: "activewear", name: "Lusaka Flex Legging", price: 450, colours: ["Black", "Navy", "Grey"], tags: ["legging"] },
  { brand: 8, cat: "activewear", name: "Weekend Track Jacket", price: 680, colours: ["Navy", "Black", "Blue"], tags: ["track"] },
  { brand: 8, cat: "footwear", name: "Court Trainer", price: 890, colours: ["White", "Black", "Navy"], tags: ["sneaker"], sizes: ["S", "M", "L", "XL"] },
  { brand: 8, cat: "tops", name: "Everyday Sport Polo", price: 340, colours: ["Navy", "White", "Sky"], tags: ["polo"] },
  // Kapiri Knit
  { brand: 9, cat: "tops", name: "Kapiri Cable Cardigan", price: 720, colours: ["Cream", "Grey", "Navy"], tags: ["cardigan"] },
  { brand: 9, cat: "tops", name: "Merino Polo Knit", price: 580, colours: ["Navy", "Black", "Sky"], tags: ["polo", "knit"] },
  { brand: 9, cat: "tops", name: "Ribbed Mock Neck", price: 490, colours: ["Black", "Cream", "Grey"], tags: ["knit"] },
  { brand: 9, cat: "outerwear", name: "Textured Knit Coatigan", price: 980, colours: ["Grey", "Navy", "Brown"], tags: ["coatigan"] },
  { brand: 9, cat: "accessories", name: "Soft Merino Beanie", price: 210, colours: ["Grey", "Navy", "Cream"], tags: ["beanie"], sizes: ["One Size"] },
  { brand: 9, cat: "tops", name: "Weekend Knit Hoodie", price: 640, colours: ["Grey", "Black", "Sky"], tags: ["hoodie"] },
];

const imagePools = {
  dresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80",
  ],
  tops: [
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80",
  ],
  bottoms: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80",
  ],
  outerwear: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80",
  ],
  traditional: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80",
  ],
  footwear: [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80",
  ],
  activewear: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
  ],
};

const defaultSizes = ["XS", "S", "M", "L", "XL"];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function descriptions(name, cat) {
  const openers = [
    `${name} is cut for Zambia’s heat and city pace.`,
    `A copr favourite — ${name} balances comfort with quiet polish.`,
    `Designed locally and finished with care, ${name} belongs in a weekly rotation.`,
  ];
  const bodies = {
    dresses: "Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.",
    tops: "Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.",
    bottoms: "Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.",
    outerwear: "A light layer for cool evenings and air-conditioned spaces, with durable hardware.",
    traditional: "Celebrates Zambian print culture with a contemporary cut suited to modern life.",
    footwear: "Built for pavement and packed markets — supportive sole, lasting materials.",
    accessories: "A finishing piece that elevates simple outfits without shouting.",
    activewear: "Moisture-aware fabric and a secure fit for training, walking, and weekend sport.",
  };
  return `${openers[name.length % 3]} ${bodies[cat]}`;
}

const products = catalog.map((item, index) => {
  const brandId = brands[item.brand];
  const slug = slugify(item.name);
  const pool = imagePools[item.cat];
  const imgA = pool[index % pool.length];
  const imgB = pool[(index + 1) % pool.length];
  const sizes = item.sizes || defaultSizes;
  const colours = item.colours;

  const variants = [];
  for (const colour of colours) {
    for (const size of sizes) {
      const stockBase = 2 + ((index + size.length + colour.length) % 8);
      variants.push({
        id: `var-${slug}-${colour.toLowerCase().replace(/\s+/g, "-")}-${size.toLowerCase().replace(/\s+/g, "-")}`,
        size,
        colour,
        stock: stockBase,
        price: item.price + (colour === colours[0] ? 0 : 20),
        sku: `COPR-${String(index + 1).padStart(3, "0")}-${colour.slice(0, 3).toUpperCase()}-${size}`,
      });
    }
  }

  return {
    id: `prod-${String(index + 1).padStart(3, "0")}`,
    slug,
    name: item.name,
    description: descriptions(item.name, item.cat),
    brandId,
    categorySlug: item.cat,
    images: [imgA, imgB],
    variants,
    tags: item.tags,
    featured: index % 7 === 0,
    trending: index % 5 === 0 || index % 11 === 0,
    isNew: index >= 48 || index % 9 === 0,
    rating: Number((3.8 + (index % 12) * 0.1).toFixed(1)),
    reviewCount: 4 + ((index * 3) % 40),
    createdAt: `2025-${String((index % 10) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}T10:00:00.000Z`,
  };
});

import("fs").then((fs) => {
  const header = `import type { Product } from "@/types";\n\nexport const products: Product[] = `;
  const footer = `;\n\nexport function getProductBySlug(slug: string): Product | undefined {\n  return products.find((p) => p.slug === slug);\n}\n\nexport function getProductById(id: string): Product | undefined {\n  return products.find((p) => p.id === id);\n}\n\nexport function getProductsByBrand(brandId: string): Product[] {\n  return products.filter((p) => p.brandId === brandId);\n}\n\nexport function getFeaturedProducts(): Product[] {\n  return products.filter((p) => p.featured);\n}\n\nexport function getNewProducts(): Product[] {\n  return products.filter((p) => p.isNew);\n}\n\nexport function getTrendingProducts(): Product[] {\n  return products.filter((p) => p.trending);\n}\n\nexport function getMinPrice(product: Product): number {\n  return Math.min(...product.variants.map((v) => v.price));\n}\n\nexport function getAvailableColours(product: Product): string[] {\n  return [...new Set(product.variants.map((v) => v.colour))];\n}\n\nexport function getAvailableSizes(product: Product): string[] {\n  return [...new Set(product.variants.map((v) => v.size))];\n}\n`;
  const body = JSON.stringify(products, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, '"');
  // Keep as valid TS with quoted strings via JSON
  const content = `import type { Product } from "@/types";\n\nexport const products: Product[] = ${JSON.stringify(products, null, 2)} satisfies Product[];\n\nexport function getProductBySlug(slug: string): Product | undefined {\n  return products.find((p) => p.slug === slug);\n}\n\nexport function getProductById(id: string): Product | undefined {\n  return products.find((p) => p.id === id);\n}\n\nexport function getProductsByBrand(brandId: string): Product[] {\n  return products.filter((p) => p.brandId === brandId);\n}\n\nexport function getFeaturedProducts(): Product[] {\n  return products.filter((p) => p.featured);\n}\n\nexport function getNewProducts(): Product[] {\n  return products.filter((p) => p.isNew);\n}\n\nexport function getTrendingProducts(): Product[] {\n  return products.filter((p) => p.trending);\n}\n\nexport function getMinPrice(product: Product): number {\n  return Math.min(...product.variants.map((v) => v.price));\n}\n\nexport function getAvailableColours(product: Product): Product["variants"][number]["colour"][] {\n  return [...new Set(product.variants.map((v) => v.colour))];\n}\n\nexport function getAvailableSizes(product: Product): Product["variants"][number]["size"][] {\n  return [...new Set(product.variants.map((v) => v.size))];\n}\n`;
  fs.writeFileSync("src/data/products.ts", content);
  console.log(`Wrote ${products.length} products`);
});
