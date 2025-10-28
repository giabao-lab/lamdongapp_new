const fetch = require('node-fetch');

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update API...\n');
    
    // Test 1: Login to get token
    console.log('1. Login to get token...');
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
    
    const token = loginData.data.token;
    console.log('Current user:', loginData.data.user.name);
    
    // Test 2: Update profile
    console.log('\n2. Testing profile update...');
    const updateData = {
      name: 'Admin Updated',
      phone: '0123456789',
      address: '123 Đà Lạt, Lâm Đồng'
    };
    
    const updateResponse = await fetch('http://localhost:5000/api/v1/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Update response status:', updateResponse.status);
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Update failed: ${updateResponse.status} - ${errorText}`);
    }
    
    const updateResult = await updateResponse.json();
    console.log('✅ Profile update successful');
    console.log('Updated user data:');
    console.log('- Name:', updateResult.data.name);
    console.log('- Phone:', updateResult.data.phone);
    console.log('- Address:', updateResult.data.address);
    
    // Test 3: Get profile to verify
    console.log('\n3. Verifying updated profile...');
    const profileResponse = await fetch('http://localhost:5000/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!profileResponse.ok) {
      throw new Error(`Get profile failed: ${profileResponse.status}`);
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ Profile verification successful');
    console.log('Current profile:');
    console.log(JSON.stringify(profileData.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProfileUpdate();