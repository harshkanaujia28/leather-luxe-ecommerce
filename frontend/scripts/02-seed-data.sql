-- Seed data for the e-commerce site

-- Insert categories
INSERT INTO categories (name, slug) VALUES
('Leather Belts', 'leather-belts'),
('Backpacks', 'backpacks'),
('Laptop Bags', 'laptop-bags'),
('Combo Gift Set', 'combo-gift-set'),
('Women''s Bags', 'womens-bags'),
('Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- Replace the existing product inserts with this comprehensive set of 35 products

-- Insert sample products (35 total across all categories)
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Premium Leather Belt',
  'premium-leather-belt',
  'Handcrafted genuine leather belt with brass buckle. Perfect for formal and casual wear.',
  89.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  25,
  true
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Classic Brown Belt',
  'classic-brown-belt',
  'Timeless brown leather belt with silver buckle. A wardrobe essential.',
  69.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  30,
  false
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Executive Black Belt',
  'executive-black-belt',
  'Professional black leather belt perfect for business attire.',
  79.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  20,
  false
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Vintage Leather Belt',
  'vintage-leather-belt',
  'Distressed leather belt with antique brass hardware for a vintage look.',
  95.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  15,
  true
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Reversible Leather Belt',
  'reversible-leather-belt',
  'Two belts in one! Black on one side, brown on the other.',
  109.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  18,
  false
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Braided Leather Belt',
  'braided-leather-belt',
  'Hand-braided leather belt with unique texture and style.',
  119.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  12,
  false
FROM categories c WHERE c.slug = 'leather-belts'
ON CONFLICT (slug) DO NOTHING;

-- Backpacks
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Executive Leather Backpack',
  'executive-leather-backpack',
  'Professional leather backpack with laptop compartment and multiple pockets.',
  249.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  15,
  true
FROM categories c WHERE c.slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Vintage Travel Backpack',
  'vintage-travel-backpack',
  'Spacious vintage-style leather backpack perfect for travel and adventure.',
  299.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  10,
  true
FROM categories c WHERE c.slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Urban Commuter Backpack',
  'urban-commuter-backpack',
  'Modern leather backpack designed for daily commuting with tech-friendly features.',
  199.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  22,
  false
FROM categories c WHERE c.slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Minimalist Leather Backpack',
  'minimalist-leather-backpack',
  'Clean, minimalist design with premium leather construction.',
  179.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  18,
  false
FROM categories c WHERE c.slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Rugged Outdoor Backpack',
  'rugged-outdoor-backpack',
  'Durable leather backpack built for outdoor adventures and harsh conditions.',
  329.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  8,
  false
FROM categories c WHERE c.slug = 'backpacks'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Bags
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Business Laptop Bag',
  'business-laptop-bag',
  'Sleek leather laptop bag designed for modern professionals.',
  179.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  20,
  false
FROM categories c WHERE c.slug = 'laptop-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Executive Briefcase',
  'executive-briefcase',
  'Traditional leather briefcase with modern laptop protection.',
  259.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  12,
  true
FROM categories c WHERE c.slug = 'laptop-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Messenger Laptop Bag',
  'messenger-laptop-bag',
  'Stylish messenger-style laptop bag with adjustable strap.',
  149.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  25,
  false
FROM categories c WHERE c.slug = 'laptop-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Convertible Laptop Tote',
  'convertible-laptop-tote',
  'Versatile bag that converts from tote to laptop bag.',
  189.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  16,
  false
FROM categories c WHERE c.slug = 'laptop-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Slim Portfolio Case',
  'slim-portfolio-case',
  'Ultra-slim leather portfolio for tablets and thin laptops.',
  99.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  30,
  false
FROM categories c WHERE c.slug = 'laptop-bags'
ON CONFLICT (slug) DO NOTHING;

-- Gift Sets
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Luxury Gift Set',
  'luxury-gift-set',
  'Complete leather accessories gift set including belt, wallet, and keychain.',
  199.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  10,
  true
FROM categories c WHERE c.slug = 'combo-gift-set'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Executive Gift Collection',
  'executive-gift-collection',
  'Premium gift set with briefcase, belt, and business card holder.',
  349.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  5,
  true
FROM categories c WHERE c.slug = 'combo-gift-set'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Travel Essentials Set',
  'travel-essentials-set',
  'Perfect travel companion set with passport holder, luggage tag, and travel wallet.',
  159.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  8,
  false
FROM categories c WHERE c.slug = 'combo-gift-set'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Gentleman''s Collection',
  'gentlemans-collection',
  'Classic gentleman''s set with wallet, belt, and cufflinks case.',
  229.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  7,
  false
FROM categories c WHERE c.slug = 'combo-gift-set'
ON CONFLICT (slug) DO NOTHING;

-- Women's Bags
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Designer Handbag',
  'designer-handbag',
  'Elegant leather handbag perfect for any occasion.',
  159.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  18,
  false
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Luxury Tote Bag',
  'luxury-tote-bag',
  'Spacious luxury tote bag crafted from premium leather.',
  219.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  14,
  true
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Evening Clutch',
  'evening-clutch',
  'Sophisticated leather clutch perfect for evening events.',
  89.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  25,
  false
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Crossbody Bag',
  'crossbody-bag',
  'Versatile crossbody bag for hands-free convenience.',
  129.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  20,
  false
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Shoulder Bag',
  'shoulder-bag',
  'Classic leather shoulder bag with timeless appeal.',
  169.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  16,
  false
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Mini Backpack',
  'mini-backpack',
  'Stylish mini leather backpack perfect for casual outings.',
  139.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  22,
  false
FROM categories c WHERE c.slug = 'womens-bags'
ON CONFLICT (slug) DO NOTHING;

-- Accessories
INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Leather Wallet',
  'leather-wallet',
  'Premium leather wallet with RFID protection and multiple card slots.',
  49.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  30,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Card Holder',
  'card-holder',
  'Slim leather card holder for minimalist carry.',
  29.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  40,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Key Fob',
  'key-fob',
  'Elegant leather key fob with metal ring.',
  19.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  50,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Phone Case',
  'phone-case',
  'Protective leather phone case with card slots.',
  39.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  35,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Passport Holder',
  'passport-holder',
  'Travel-ready leather passport holder with document slots.',
  34.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  28,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Money Clip',
  'money-clip',
  'Sleek leather money clip with magnetic closure.',
  24.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  45,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Watch Strap',
  'watch-strap',
  'Premium leather watch strap available in multiple sizes.',
  44.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  32,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Desk Organizer',
  'desk-organizer',
  'Leather desk organizer to keep your workspace tidy.',
  79.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  15,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Luggage Tag',
  'luggage-tag',
  'Durable leather luggage tag for travel identification.',
  14.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  60,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (title, slug, description, price, category_id, images, stock, featured) 
SELECT 
  'Bookmark',
  'bookmark',
  'Elegant leather bookmark for book lovers.',
  12.99,
  c.id,
  ARRAY['/placeholder.svg?height=400&width=400'],
  75,
  false
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@leatherluxe.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, discount_percent, expiry_date, usage_limit) VALUES
('WELCOME10', 10, '2024-12-31', 100),
('SAVE20', 20, '2024-12-31', 50),
('LUXURY25', 25, '2024-12-31', 25)
ON CONFLICT (code) DO NOTHING;
