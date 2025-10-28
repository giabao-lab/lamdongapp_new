// Debug script to check authentication state
const checkAuthState = () => {
  console.log('=== Authentication Debug ===');
  
  // Check localStorage
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  console.log('Token:', token ? 'Present' : 'Not found');
  console.log('User Data:', userData ? JSON.parse(userData) : 'Not found');
  
  // Check if user is logged in
  if (token && userData) {
    const user = JSON.parse(userData);
    console.log('User:', user);
    console.log('Role:', user.role);
    console.log('Name:', user.name);
  } else {
    console.log('User is not logged in');
  }
};

// Auto-run when script loads
checkAuthState();

// Export for manual use
window.checkAuthState = checkAuthState;