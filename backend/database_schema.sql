-- Lam Dong Specialties Database Schema
-- PostgreSQL Database for E-commerce Application

-- Create database (run this manually in pgAdmin)
-- CREATE DATABASE lamdongapp_db;

-- Use the database
-- \c lamdongapp_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cod', 'bank_transfer');

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    original_price DECIMAL(10,2) CHECK (original_price > 0),
    image VARCHAR(255) NOT NULL,
    images TEXT[], -- Array of image URLs
    category VARCHAR(100) NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    tags TEXT[], -- Array of tags
    origin VARCHAR(100) NOT NULL,
    weight VARCHAR(50),
    ingredients TEXT[], -- Array of ingredients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Cart Items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(12,2) NOT NULL CHECK (total > 0),
    status order_status DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    payment_method payment_method NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0), -- Price at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews table (for future implementation)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_description ON products USING gin(to_tsvector('english', description));
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Create triggers to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('coffee', 'Cà phê đặc sản từ cao nguyên Lâm Đồng'),
('tea', 'Trà atisô và các loại trà thảo dược'),
('wine', 'Rượu vang địa phương từ nho Đà Lạt'),
('fruits', 'Trái cây tươi và đặc sản'),
('preserves', 'Mứt, bánh kẹo và đồ chế biến');

-- Insert sample admin user (password: admin123)
-- Note: In production, hash this password properly
INSERT INTO users (email, password, name, role) VALUES
('admin@dacsanlamdong.vn', '$2b$10$rOZhqKJ8kqKqKzKzKzKzKe7YvqKzKzKzKzKzKzKzKzKzKzKzKzKzKO', 'Admin', 'admin');

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
    'coffee', 100, 4.8, 124,
    ARRAY['organic', 'premium', 'arabica'],
    'Đà Lạt, Lâm Đồng', '500g',
    ARRAY['100% cà phê Arabica']
),
(
    'Trà Atisô Đà Lạt',
    'Trà atisô tự nhiên từ Đà Lạt, giúp thanh nhiệt, giải độc, tốt cho sức khỏe gan và hệ tiêu hóa.',
    180000, NULL,
    '/vietnamese-artichoke-tea-dalat.jpg',
    ARRAY['/vietnamese-artichoke-tea-dalat.jpg', '/artichoke-flowers-field-vietnam.jpg', '/dried-artichoke-tea-leaves.jpg'],
    'tea', 50, 4.6, 89,
    ARRAY['herbal', 'healthy', 'natural'],
    'Đà Lạt, Lâm Đồng', '200g',
    ARRAY['100% hoa atisô khô']
),
(
    'Rượu Vang Đà Lạt',
    'Rượu vang đỏ cao cấp từ nho trồng tại Đà Lạt, hương vị đậm đà, phù hợp cho những dịp đặc biệt.',
    450000, 500000,
    '/vietnamese-red-wine-dalat-bottle.jpg',
    ARRAY['/vietnamese-red-wine-dalat-bottle.jpg', '/grape-vineyard-dalat-vietnam.jpg', '/wine-tasting-glass-red-wine.jpg'],
    'wine', 25, 4.7, 56,
    ARRAY['premium', 'red wine', 'local'],
    'Đà Lạt, Lâm Đồng', '750ml',
    ARRAY['Nho đỏ Đà Lạt', 'Men rượu tự nhiên']
),
(
    'Dâu Tây Tươi Đà Lạt',
    'Dâu tây tươi ngon, ngọt tự nhiên từ các trang trại Đà Lạt, giàu vitamin C và chất chống oxy hóa.',
    120000, NULL,
    '/fresh-strawberries-dalat-vietnam.jpg',
    ARRAY['/fresh-strawberries-dalat-vietnam.jpg', '/strawberry-farm-dalat-greenhouse.jpg', '/ripe-red-strawberries-basket.jpg'],
    'fruits', 30, 4.9, 203,
    ARRAY['fresh', 'organic', 'vitamin-c'],
    'Đà Lạt, Lâm Đồng', '500g',
    ARRAY['100% dâu tây tươi']
),
(
    'Mứt Dâu Tây Đà Lạt',
    'Mứt dâu tây thơm ngon, làm từ dâu tây tươi Đà Lạt, không chất bảo quản, phù hợp làm quà tặng.',
    85000, NULL,
    '/strawberry-jam-vietnamese-traditional.jpg',
    ARRAY['/strawberry-jam-vietnamese-traditional.jpg', '/homemade-strawberry-preserve-jar.jpg', '/strawberry-jam-on-bread.jpg'],
    'preserves', 75, 4.5, 78,
    ARRAY['handmade', 'no-preservatives', 'gift'],
    'Đà Lạt, Lâm Đồng', '300g',
    ARRAY['Dâu tây tươi', 'Đường mía', 'Nước cốt chanh']
);

-- Create a view for product listing with computed fields
CREATE VIEW product_view AS
SELECT 
    p.*,
    CASE 
        WHEN p.stock_quantity > 0 THEN true 
        ELSE false 
    END as in_stock,
    CASE 
        WHEN p.original_price IS NOT NULL AND p.original_price > p.price
        THEN ROUND(((p.original_price - p.price) / p.original_price * 100), 0)
        ELSE 0
    END as discount_percentage
FROM products p;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;