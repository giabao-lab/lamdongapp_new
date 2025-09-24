-- Lam Dong Specialties Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately in pgAdmin or psql)
-- CREATE DATABASE lamdongapp_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2) CHECK (original_price >= 0),
    image VARCHAR(500) NOT NULL,
    images TEXT[], -- Array of image URLs
    category VARCHAR(50) NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    tags TEXT[], -- Array of tags
    origin VARCHAR(100) NOT NULL,
    weight VARCHAR(50),
    ingredients TEXT[], -- Array of ingredients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL, -- Store shipping address as JSON
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0), -- Store price at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table (optional - for future use)
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_user_id ON product_reviews(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES 
('Cà phê', 'coffee', 'Cà phê Arabica và Robusta từ Đà Lạt'),
('Trà Atisô', 'tea', 'Trà atisô thảo dược từ Đà Lạt'),
('Rượu Vang', 'wine', 'Rượu vang từ nho Đà Lạt'),
('Trái Cây', 'fruits', 'Trái cây tươi từ Đà Lạt'),
('Mứt & Bánh Kẹo', 'preserves', 'Các sản phẩm chế biến truyền thống');

-- Insert sample admin user (password: admin123 - hashed)
INSERT INTO users (email, password, name, role) VALUES 
('admin@dacsanlamdong.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');

-- Insert sample customer user (password: user123 - hashed)
INSERT INTO users (email, password, name) VALUES 
('user@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn A');

-- Insert sample products
INSERT INTO products (
    name, description, price, original_price, image, images, category, 
    stock_quantity, rating, review_count, tags, origin, weight, ingredients
) VALUES 
(
    'Cà phê Arabica Đà Lạt',
    'Cà phê Arabica nguyên chất từ cao nguyên Đà Lạt, rang xay theo phương pháp truyền thống, hương vị đậm đà, thơm ngon.',
    250000, 300000,
    '/vietnamese-arabica-coffee-beans-dalat.jpg',
    ARRAY['/vietnamese-arabica-coffee-beans-dalat.jpg', '/coffee-plantation-dalat-highlands.jpg', '/roasted-coffee-beans-close-up.jpg'],
    'coffee',
    100, 4.8, 124,
    ARRAY['organic', 'premium', 'arabica'],
    'Đà Lạt, Lâm Đồng',
    '500g',
    ARRAY['100% cà phê Arabica']
),
(
    'Trà Atisô Đà Lạt',
    'Trà atisô tự nhiên từ Đà Lạt, giúp thanh nhiệt, giải độc, tốt cho sức khỏe gan và hệ tiêu hóa.',
    180000, NULL,
    '/vietnamese-artichoke-tea-dalat.jpg',
    ARRAY['/vietnamese-artichoke-tea-dalat.jpg', '/artichoke-flowers-field-vietnam.jpg', '/dried-artichoke-tea-leaves.jpg'],
    'tea',
    80, 4.6, 89,
    ARRAY['herbal', 'healthy', 'natural'],
    'Đà Lạt, Lâm Đồng',
    '200g',
    ARRAY['100% hoa atisô khô']
),
(
    'Rượu Vang Đà Lạt',
    'Rượu vang đỏ cao cấp từ nho trồng tại Đà Lạt, hương vị đậm đà, phù hợp cho những dịp đặc biệt.',
    450000, 500000,
    '/vietnamese-red-wine-dalat-bottle.jpg',
    ARRAY['/vietnamese-red-wine-dalat-bottle.jpg', '/grape-vineyard-dalat-vietnam.jpg', '/wine-tasting-glass-red-wine.jpg'],
    'wine',
    25, 4.7, 56,
    ARRAY['premium', 'red wine', 'local'],
    'Đà Lạt, Lâm Đồng',
    '750ml',
    ARRAY['Nho đỏ Đà Lạt', 'Men rượu tự nhiên']
),
(
    'Dâu Tây Tươi Đà Lạt',
    'Dâu tây tươi ngon, ngọt tự nhiên từ các trang trại Đà Lạt, giàu vitamin C và chất chống oxy hóa.',
    120000, NULL,
    '/fresh-strawberries-dalat-vietnam.jpg',
    ARRAY['/fresh-strawberries-dalat-vietnam.jpg', '/strawberry-farm-dalat-greenhouse.jpg', '/ripe-red-strawberries-basket.jpg'],
    'fruits',
    50, 4.9, 203,
    ARRAY['fresh', 'organic', 'vitamin-c'],
    'Đà Lạt, Lâm Đồng',
    '500g',
    ARRAY['100% dâu tây tươi']
),
(
    'Mứt Dâu Tây Đà Lạt',
    'Mứt dâu tây thơm ngon, làm từ dâu tây tươi Đà Lạt, không chất bảo quản, phù hợp làm quà tặng.',
    85000, NULL,
    '/strawberry-jam-vietnamese-traditional.jpg',
    ARRAY['/strawberry-jam-vietnamese-traditional.jpg', '/homemade-strawberry-preserve-jar.jpg', '/strawberry-jam-on-bread.jpg'],
    'preserves',
    60, 4.5, 78,
    ARRAY['handmade', 'no-preservatives', 'gift'],
    'Đà Lạt, Lâm Đồng',
    '300g',
    ARRAY['Dâu tây tươi', 'Đường mía', 'Nước cốt chanh']
);