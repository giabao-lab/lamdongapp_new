const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'lamdongapp_new',
  user: 'postgres',
  password: 'postgres'
});

async function testLogin() {
  try {
    console.log('Testing database connection and login...\n');
    
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Check if users exist
    const usersResult = await client.query('SELECT email, name, role, created_at FROM users');
    console.log(`\n📊 Found ${usersResult.rows.length} users in database:`);
    usersResult.rows.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.name}`);
    });
    
    // Test admin login
    console.log('\n🔐 Testing admin login...');
    const adminResult = await client.query('SELECT * FROM users WHERE email = $1', ['admin@dacsanlamdong.vn']);
    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log(`Found admin: ${admin.email}`);
      
      // Test password
      const isValidPassword = await bcrypt.compare('admin123', admin.password);
      console.log(`Password validation: ${isValidPassword ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isValidPassword) {
        console.log('Current hash:', admin.password);
        
        // Generate correct hash
        const correctHash = await bcrypt.hash('admin123', 10);
        console.log('Correct hash should be:', correctHash);
        
        // Update password
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [correctHash, 'admin@dacsanlamdong.vn']);
        console.log('✅ Password updated!');
      }
    } else {
      console.log('❌ Admin user not found');
      
      // Create admin user
      const adminHash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        ['admin@dacsanlamdong.vn', adminHash, 'Administrator', 'admin']
      );
      console.log('✅ Admin user created!');
    }
    
    // Test user login
    console.log('\n👤 Testing user login...');
    const userResult = await client.query('SELECT * FROM users WHERE email = $1', ['user@example.com']);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log(`Found user: ${user.email}`);
      
      const isValidPassword = await bcrypt.compare('user123', user.password);
      console.log(`Password validation: ${isValidPassword ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isValidPassword) {
        const correctHash = await bcrypt.hash('user123', 10);
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [correctHash, 'user@example.com']);
        console.log('✅ User password updated!');
      }
    } else {
      console.log('❌ User not found');
      
      const userHash = await bcrypt.hash('user123', 10);
      await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        ['user@example.com', userHash, 'Nguyễn Văn A', 'customer']
      );
      console.log('✅ User created!');
    }
    
    client.release();
    console.log('\n🎉 Database setup completed! Try logging in now.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

testLogin();