const fetch = require('node-fetch');

async function testUsersAPI() {
  try {
    console.log('🧪 Testing Users API...\n');
    
    // Test 1: Login to get token
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@dacsanlamdong.vn',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('Token:', loginData.data.token.substring(0, 30) + '...');
    
    const token = loginData.data.token;
    
    // Test 2: Get users with token
    console.log('\n2. Testing get users...');
    const usersResponse = await fetch('http://localhost:5000/api/v1/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Users API response status:', usersResponse.status);
    
    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();
      throw new Error(`Users API failed: ${usersResponse.status} - ${errorText}`);
    }
    
    const usersData = await usersResponse.json();
    console.log('✅ Users API successful');
    console.log('Total users:', usersData.data.total);
    console.log('First user:', usersData.data.users[0]?.name);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUsersAPI();