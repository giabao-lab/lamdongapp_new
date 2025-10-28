// Script to generate proper bcrypt hash for passwords
const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating password hashes...\n');
  
  // Generate hash for admin123
  const adminPassword = 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  console.log(`Admin Password: ${adminPassword}`);
  console.log(`Admin Hash: ${adminHash}`);
  
  // Test admin hash
  const adminValid = await bcrypt.compare(adminPassword, adminHash);
  console.log(`Admin Hash Valid: ${adminValid}\n`);
  
  // Generate hash for user123
  const userPassword = 'user123';
  const userHash = await bcrypt.hash(userPassword, 10);
  console.log(`User Password: ${userPassword}`);
  console.log(`User Hash: ${userHash}`);
  
  // Test user hash
  const userValid = await bcrypt.compare(userPassword, userHash);
  console.log(`User Hash Valid: ${userValid}\n`);
  
  // SQL commands to update database
  console.log('Run these SQL commands in pgAdmin:');
  console.log('-----------------------------------');
  console.log(`UPDATE users SET password = '${adminHash}' WHERE email = 'admin@dacsanlamdong.vn';`);
  console.log(`UPDATE users SET password = '${userHash}' WHERE email = 'user@example.com';`);
  console.log('\nOr insert new users if they don\'t exist:');
  console.log(`INSERT INTO users (email, password, name, role) VALUES ('admin@dacsanlamdong.vn', '${adminHash}', 'Administrator', 'admin') ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`);
  console.log(`INSERT INTO users (email, password, name, role) VALUES ('user@example.com', '${userHash}', 'Nguyễn Văn A', 'customer') ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`);
}

generateHashes().catch(console.error);