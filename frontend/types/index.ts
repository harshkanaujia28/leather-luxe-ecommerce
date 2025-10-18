export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  category_id: string
  category?: Category
  images: string[]
  stock: number
  featured: boolean
  bestSeller: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string; // URL of the image
  subtitle: string;
  created_at: string;
  updated_at: string;
}


export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: Address
  billing_address: Address
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
}

export interface Address {
  first_name: string
  last_name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Coupon {
  id: string
  code: string
  discount_percent: number
  expiry_date: string
  usage_limit?: number
  used_count: number
  created_at: string
}
