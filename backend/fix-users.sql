-- Update existing users with correct password hashes
-- Password for admin: admin123
-- Password for user: user123

-- Update admin user
UPDATE users 
SET password = '$2b$10$YFQNL1JMAv77eCCvzzv6Y.54H/5N5n6UceOUvgcvBR7ni5V3UwgWi' 
WHERE email = 'admin@dacsanlamdong.vn';

-- Update user account  
UPDATE users 
SET password = '$2b$10$CVJEMMQJM33q6sEvzQirCOCBEO5.xieEHqv/pjqkz4nVNDizemcSO' 
WHERE email = 'user@example.com';

-- Or insert if they don't exist
INSERT INTO users (email, password, name, role) 
VALUES ('admin@dacsanlamdong.vn', '$2b$10$YFQNL1JMAv77eCCvzzv6Y.54H/5N5n6UceOUvgcvBR7ni5V3UwgWi', 'Administrator', 'admin') 
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

INSERT INTO users (email, password, name, role) 
VALUES ('user@example.com', '$2b$10$CVJEMMQJM33q6sEvzQirCOCBEO5.xieEHqv/pjqkz4nVNDizemcSO', 'Nguyễn Văn A', 'customer') 
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Verify users exist
SELECT id, email, name, role, created_at 
FROM users 
WHERE email IN ('admin@dacsanlamdong.vn', 'user@example.com');