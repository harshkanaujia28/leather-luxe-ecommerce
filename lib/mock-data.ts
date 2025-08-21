import type { Product, Category, User, Coupon } from "@/types"

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Leather Belts",
    slug: "leather-belts",
    subtitle: "Crafted to last",
    image: "/category/leather-belt.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Backpacks",
    slug: "backpacks",
    subtitle: "Carry in style",
    image: "/category/backpack.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Laptop Bags",
    slug: "laptop-bags",
    subtitle: "Work-ready gear",
    image: "/category/laptop-bag.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Combo Gift Set",
    slug: "combo-gift-set",
    subtitle: "Gifts made easy",
    image: "/category/combo-set.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Women's Bags",
    slug: "womens-bags",
    subtitle: "Chic & timeless",
    image: "/category/womens-bag.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    subtitle: "Essentials redefined",
    image: "/category/accessory.jpeg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];




export const mockProducts: Product[] = [
  // Leather Belts (6 products)
  {
    id: "prod-1",
    title: "Premium Leather Belt",
    slug: "premium-leather-belt",
    description:
      "Handcrafted genuine leather belt with brass buckle. Perfect for formal and casual wear. Made from top-grain leather with meticulous attention to detail.",
    price: 89.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/This Baroque Faux Leather Belt brings a vintage….jpeg"],
    stock: 25,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "prod-2",
    title: "Classic Brown Belt",
    slug: "classic-brown-belt",
    description:
      "Timeless brown leather belt with silver buckle. A wardrobe essential that pairs perfectly with both casual and business attire.",
    price: 69.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/Men's Western Leather Belt - Retro Engraved Style with Alloy Buckle _ Genuine Leather Jeans Belt _ Gift for Him, Dad, or Husband.jpeg"],
    stock: 30,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "prod-3",
    title: "Executive Black Belt",
    slug: "executive-black-belt",
    description:
      "Professional black leather belt perfect for business attire. Sleek design with premium leather construction and polished buckle.",
    price: 79.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/brown.jpeg"],
    stock: 20,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "prod-4",
    title: "Vintage Leather Belt",
    slug: "vintage-leather-belt",
    description:
      "Distressed leather belt with antique brass hardware for a vintage look. Each belt has unique character and patina.",
    price: 95.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/7e65ddea-9f2a-464d-b1b1-6a1f501bb8b4.jpeg"],
    stock: 15,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: "prod-5",
    title: "Reversible Leather Belt",
    slug: "reversible-leather-belt",
    description:
      "Two belts in one! Black on one side, brown on the other. Versatile design with rotating buckle mechanism.",
    price: 109.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/PRICES MAY VARY_ PREMIUM LEATHER--The Kemisant men….jpeg"],
    stock: 18,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "prod-6",
    title: "Braided Leather Belt",
    slug: "braided-leather-belt",
    description:
      "Hand-braided leather belt with unique texture and style. Artisan crafted with intricate braiding pattern.",
    price: 119.99,
    category_id: "cat-1",
    category: mockCategories[0],
    images: ["/belt/dark.jpeg"],
    stock: 12,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },

  // Backpacks (5 products)
  {
    id: "prod-7",
    title: "Executive Leather Backpack",
    slug: "executive-leather-backpack",
    description:
      "Professional leather backpack with laptop compartment and multiple pockets. Perfect for business professionals and students.",
    price: 249.99,
    category_id: "cat-2",
    category: mockCategories[1],
    images: ["/bagpacks/Heirloom Backpack 14_5 - Tan.jpeg"],
    stock: 15,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-07T00:00:00Z",
    updated_at: "2024-01-07T00:00:00Z",
  },
  {
    id: "prod-8",
    title: "Vintage Travel Backpack",
    slug: "vintage-travel-backpack",
    description:
      "Spacious vintage-style leather backpack perfect for travel and adventure. Features multiple compartments and durable construction.",
    price: 299.99,
    category_id: "cat-2",
    category: mockCategories[1],
    images: ["/bagpacks/dark.jpeg"],
    stock: 10,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "prod-9",
    title: "Urban Commuter Backpack",
    slug: "urban-commuter-backpack",
    description:
      "Modern leather backpack designed for daily commuting with tech-friendly features and sleek urban design.",
    price: 199.99,
    category_id: "cat-2",
    category: mockCategories[1],
    images: ["/bagpacks/6edab2cf-5566-4839-a772-61639928d8d0.jpeg"],
    stock: 22,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-09T00:00:00Z",
    updated_at: "2024-01-09T00:00:00Z",
  },
  {
    id: "prod-10",
    title: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    description:
      "Clean, minimalist design with premium leather construction. Perfect for those who appreciate simplicity and quality.",
    price: 179.99,
    category_id: "cat-2",
    category: mockCategories[1],
    images: ["/bagpacks/Leather Backpack Purse, Designer Backpacks for….jpeg"],
    stock: 18,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "prod-11",
    title: "Rugged Outdoor Backpack",
    slug: "rugged-outdoor-backpack",
    description:
      "Durable leather backpack built for outdoor adventures and harsh conditions. Weather-resistant and extremely durable.",
    price: 329.99,
    category_id: "cat-2",
    category: mockCategories[1],
    images: ["/bagpacks/Jefferson Leather Duffle _ Elderwood.jpeg"],
    stock: 8,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-11T00:00:00Z",
    updated_at: "2024-01-11T00:00:00Z",
  },

  // Laptop Bags (5 products)
  {
    id: "prod-12",
    title: "Business Laptop Bag",
    slug: "business-laptop-bag",
    description:
      "Sleek leather laptop bag designed for modern professionals. Features padded laptop compartment and document organizer.",
    price: 179.99,
    category_id: "cat-3",
    category: mockCategories[2],
    images: ["/laptop bag/The Porter Leather Laptop Organizer Bag is….jpeg"],
    stock: 20,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z",
  },
  {
    id: "prod-13",
    title: "Executive Briefcase",
    slug: "executive-briefcase",
    description:
      "Traditional leather briefcase with modern laptop protection. Classic design meets contemporary functionality.",
    price: 259.99,
    category_id: "cat-3",
    category: mockCategories[2],
    images: ["/laptop bag/We make our leather bags individually for your….jpeg"],
    stock: 12,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-13T00:00:00Z",
    updated_at: "2024-01-13T00:00:00Z",
  },
  {
    id: "prod-14",
    title: "Messenger Laptop Bag",
    slug: "messenger-laptop-bag",
    description:
      "Stylish messenger-style laptop bag with adjustable strap. Perfect for creative professionals and students.",
    price: 149.99,
    category_id: "cat-3",
    category: mockCategories[2],
    images: ["/laptop bag/Latest Laptop Lather Bags Designs For Women's….jpeg"],
    stock: 25,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-14T00:00:00Z",
    updated_at: "2024-01-14T00:00:00Z",
  },
  {
    id: "prod-15",
    title: "Convertible Laptop Tote",
    slug: "convertible-laptop-tote",
    description: "Versatile bag that converts from tote to laptop bag. Perfect for professionals who need flexibility.",
    price: 189.99,
    category_id: "cat-3",
    category: mockCategories[2],
    images: ["/laptop bag/Personalized Leather Sleeve, Ultra-Slim Waterproof….jpeg"],
    stock: 16,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "prod-16",
    title: "Slim Portfolio Case",
    slug: "slim-portfolio-case",
    description:
      "Ultra-slim leather portfolio for tablets and thin laptops. Minimalist design with maximum protection.",
    price: 99.99,
    category_id: "cat-3",
    category: mockCategories[2],
    images: ["/laptop bag/Our leather laptop sleeve provides heavy-duty….jpeg"],
    stock: 30,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-16T00:00:00Z",
    updated_at: "2024-01-16T00:00:00Z",
  },

  // Gift Sets (4 products)
  {
    id: "prod-17",
    title: "Luxury Gift Set",
    slug: "luxury-gift-set",
    description:
      "Complete leather accessories gift set including belt, wallet, and keychain. Perfect for special occasions.",
    price: 199.99,
    category_id: "cat-4",
    category: mockCategories[3],
    images: ["/combo gift set/daf2068d-8736-46f0-a30b-ccadcfc037ce.jpeg"],
    stock: 10,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-17T00:00:00Z",
    updated_at: "2024-01-17T00:00:00Z",
  },
  {
    id: "prod-18",
    title: "Executive Gift Collection",
    slug: "executive-gift-collection",
    description:
      "Premium gift set with briefcase, belt, and business card holder. Ideal for corporate gifts and executives.",
    price: 349.99,
    category_id: "cat-4",
    category: mockCategories[3],
    images: ["/combo gift set/Urban Forest Brian Black Leather Wallet & Black….jpeg"],
    stock: 5,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-18T00:00:00Z",
    updated_at: "2024-01-18T00:00:00Z",
  },
  {
    id: "prod-19",
    title: "Travel Essentials Set",
    slug: "travel-essentials-set",
    description:
      "Perfect travel companion set with passport holder, luggage tag, and travel wallet. Everything you need for travel.",
    price: 159.99,
    category_id: "cat-4",
    category: mockCategories[3],
    images: ["/combo gift set/✨ WildHorn Gift Hamper for Men I Leather Wallet….jpeg"],
    stock: 8,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-19T00:00:00Z",
    updated_at: "2024-01-19T00:00:00Z",
  },
  {
    id: "prod-20",
    title: "Gentleman's Collection",
    slug: "gentlemans-collection",
    description:
      "Classic gentleman's set with wallet, belt, and cufflinks case. Timeless elegance for the modern gentleman.",
    price: 229.99,
    category_id: "cat-4",
    category: mockCategories[3],
    images: ["/combo gift set/₹599_0 WildHorn Gift Hamper for Men I Leather….jpeg"],
    stock: 7,
    featured: false,
  bestSeller: true,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },

  // Women's Bags (6 products)
  {
    id: "prod-21",
    title: "Designer Handbag",
    slug: "designer-handbag",
    description: "Elegant leather handbag perfect for any occasion. Sophisticated design with premium craftsmanship.",
    price: 159.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/Equestrian-inspired and versatile, The Bridle Bag….jpeg"],
    stock: 18,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-21T00:00:00Z",
    updated_at: "2024-01-21T00:00:00Z",
  },
  {
    id: "prod-22",
    title: "Luxury Tote Bag",
    slug: "luxury-tote-bag",
    description: "Spacious luxury tote bag crafted from premium leather. Perfect for work, shopping, or everyday use.",
    price: 219.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/buy leather handbags Women's handbags are the….jpeg"],
    stock: 14,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-22T00:00:00Z",
    updated_at: "2024-01-22T00:00:00Z",
  },
  {
    id: "prod-23",
    title: "Evening Clutch",
    slug: "evening-clutch",
    description: "Sophisticated leather clutch perfect for evening events. Compact design with elegant details.",
    price: 89.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/a15322cf-199d-4e7b-b602-41416a281b23.jpeg"],
    stock: 25,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-23T00:00:00Z",
    updated_at: "2024-01-23T00:00:00Z",
  },
  {
    id: "prod-24",
    title: "Crossbody Bag",
    slug: "crossbody-bag",
    description:
      "Versatile crossbody bag for hands-free convenience. Perfect for travel, shopping, or daily activities.",
    price: 129.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/Available on order In different beautiful prints….jpeg"],
    stock: 20,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-24T00:00:00Z",
    updated_at: "2024-01-24T00:00:00Z",
  },
  {
    id: "prod-25",
    title: "Shoulder Bag",
    slug: "shoulder-bag",
    description: "Classic leather shoulder bag with timeless appeal. Versatile design suitable for any occasion.",
    price: 169.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/Leather and grace_ Armani and Bugatti want you to….jpeg"],
    stock: 16,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
  {
    id: "prod-26",
    title: "Mini Backpack",
    slug: "mini-backpack",
    description: "Stylish mini leather backpack perfect for casual outings. Compact size with maximum style.",
    price: 139.99,
    category_id: "cat-5",
    category: mockCategories[4],
    images: ["/womens bag/Exquisitely crafted in beautiful ruby-red….jpeg"],
    stock: 22,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-26T00:00:00Z",
    updated_at: "2024-01-26T00:00:00Z",
  },

  // Accessories (4 products)
  {
    id: "prod-27",
    title: "Premium Leather Wallet",
    slug: "premium-leather-wallet",
    description:
      "Premium leather wallet with RFID protection and multiple card slots. Essential accessory for everyday use.",
    price: 49.99,
    category_id: "cat-6",
    category: mockCategories[5],
    images: ["/asseoseries/3c675fd1-5ed7-4d21-9351-f95e726240df.jpeg"],
    stock: 30,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-27T00:00:00Z",
    updated_at: "2024-01-27T00:00:00Z",
  },
  {
    id: "prod-28",
    title: "Leather Card Holder",
    slug: "leather-card-holder",
    description: "Slim leather card holder for minimalist carry. Perfect for those who prefer to travel light.",
    price: 29.99,
    category_id: "cat-6",
    category: mockCategories[5],
    images: ["/asseoseries/Anthropologie Cylindrical Cord Holder.jpeg"],
    stock: 40,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-28T00:00:00Z",
    updated_at: "2024-01-28T00:00:00Z",
  },
  {
    id: "prod-29",
    title: "Leather Key Fob",
    slug: "leather-key-fob",
    description: "Elegant leather key fob with metal ring. Stylish way to organize and carry your keys.",
    price: 19.99,
    category_id: "cat-6",
    category: mockCategories[5],
    images: ["/asseoseries/Leather SD Card Holder Photography Tools Leather….jpeg"],
    stock: 50,
    featured: false,
  bestSeller: false,
    created_at: "2024-01-29T00:00:00Z",
    updated_at: "2024-01-29T00:00:00Z",
  },
  {
    id: "prod-30",
    title: "Leather Phone Case",
    slug: "leather-phone-case",
    description: "Protective leather phone case with card slots. Combines protection with functionality and style.",
    price: 39.99,
    category_id: "cat-6",
    category: mockCategories[5],
    images: ["/asseoseries/Check out this item in my Etsy shop….jpeg"],
    stock: 35,
    featured: true,
  bestSeller: false,
    created_at: "2024-01-30T00:00:00Z",
    updated_at: "2024-01-30T00:00:00Z",
  },
]

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@leatherluxe.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "customer@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "customer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export const mockCoupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "WELCOME10",
    discount_percent: 10,
    expiry_date: "2024-12-31",
    usage_limit: 100,
    used_count: 15,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "coupon-2",
    code: "SAVE20",
    discount_percent: 20,
    expiry_date: "2024-12-31",
    usage_limit: 50,
    used_count: 8,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "coupon-3",
    code: "LUXURY25",
    discount_percent: 25,
    expiry_date: "2024-12-31",
    usage_limit: 25,
    used_count: 3,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Helper functions to simulate database operations
export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((product) => product.featured)
}
export function getBestSellerProducts(): Product[] {
  return mockProducts.filter((product) => product.bestSeller)
}

export function getProductsByCategory(
  categorySlug: string,
  page = 1,
  limit = 10,
): { products: Product[]; totalCount: number } {
  const category = mockCategories.find((cat) => cat.slug === categorySlug)
  if (!category) return { products: [], totalCount: 0 }

  const categoryProducts = mockProducts.filter((product) => product.category_id === category.id)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    products: categoryProducts.slice(startIndex, endIndex),
    totalCount: categoryProducts.length,
  }
}

export function getAllProducts(page = 1, limit = 10): { products: Product[]; totalCount: number } {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    products: mockProducts.slice(startIndex, endIndex),
    totalCount: mockProducts.length,
  }
}

export function getProductBySlug(slug: string): Product | null {
  return mockProducts.find((product) => product.slug === slug) || null
}

export function getCategoryBySlug(slug: string): Category | null {
  return mockCategories.find((category) => category.slug === slug) || null
}

export function authenticateUser(email: string, password: string): User | null {
  // Simple mock authentication - in real app, you'd hash passwords
  const validCredentials = [
    { email: "admin@leatherluxe.com", password: "admin123" },
    { email: "customer@example.com", password: "customer123" },
  ]

  const credential = validCredentials.find((cred) => cred.email === email && cred.password === password)
  if (credential) {
    return mockUsers.find((user) => user.email === email) || null
  }

  return null
}

export function createUser(email: string, password: string, firstName: string, lastName: string): User {
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    first_name: firstName,
    last_name: lastName,
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return newUser
}
export const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "upi", name: "UPI", icon: "📱" },
  { id: "netbanking", name: "Net Banking", icon: "🏦" },
  { id: "wallet", name: "Digital Wallet", icon: "💰" },
  { id: "cod", name: "Cash on Delivery", icon: "💵" },
]
export const shippingMethods = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "15-20 business days",
    price: 0,
    estimatedDays: "15-20",
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "7-10 business days",
    price: 2000,
    estimatedDays: "7-10",
  },
  {
    id: "priority",
    name: "Priority Delivery",
    description: "3-5 business days",
    price: 5000,
    estimatedDays: "3-5",
  },
]
export const orders = [
  {
    id: "ORD-001",
    userId: "user-1",
    customerName: "John Doe",
    date: "2024-01-15",
    status: "Processing",
    total: 85000,
    items: [
      { productId: "prod-1", name: "Premium Leather Belt", quantity: 1 },
      { productId: "prod-2", name: "Classic Brown Belt", quantity: 2 },
    ],
    shippingAddress: "123 Fashion Street, Mumbai, Maharashtra 400001",
    paymentMethod: "Credit Card",
    trackingId: "TRK123456789",
  },
  {
    id: "ORD-002",
    userId: "user-2",
    customerName: "Jane Smith",
    date: "2024-01-14",
    status: "Shipped",
    total: 75000,
    items: [
      { productId: "prod-3", name: "Leather Wallet", quantity: 1 },
      { productId: "prod-4", name: "Leather Wallet", quantity: 1 },
    ],
    shippingAddress: "456 Fashion Street, Mumbai, Maharashtra 400001",
    paymentMethod: "Credit Card",
    trackingId: "TRK987654321",
  },
]