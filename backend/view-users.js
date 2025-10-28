const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'lamdongapp_new',
  user: 'postgres',
  password: 'postgres',
});

async function viewUsers() {
  try {
    console.log('🔍 Đang kết nối database...\n');
    
    // Lấy tất cả người dùng
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log(`📊 Tổng số người dùng: ${result.rows.length}\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ Chưa có người dùng nào đăng ký');
      return;
    }
    
    console.log('👥 DANH SÁCH NGƯỜI DÙNG:');
    console.log('═'.repeat(80));
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Tên: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ngày đăng ký: ${new Date(user.created_at).toLocaleString('vi-VN')}`);
      console.log(`   Cập nhật lần cuối: ${new Date(user.updated_at).toLocaleString('vi-VN')}`);
      console.log('-'.repeat(50));
    });
    
    // Thống kê thêm
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_this_week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_this_month
      FROM users
    `);
    
    const stats = statsResult.rows[0];
    console.log('\n📈 THỐNG KÊ:');
    console.log(`• Tổng số người dùng: ${stats.total_users}`);
    console.log(`• Đăng ký trong tuần: ${stats.new_users_this_week}`);
    console.log(`• Đăng ký trong tháng: ${stats.new_users_this_month}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi truy vấn database:', error);
  } finally {
    await pool.end();
  }
}

// Chạy script
viewUsers();