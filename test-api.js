// Test API connection
fetch('http://localhost:5000/api/v1/products')
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });