const axios = require('axios');

axios.post('http://localhost:5002/api/auth/login', {
  idToken: 'testtoken',
  mockName: 'Demo User',
  mockEmail: 'demo@travel.in'
}).then(r => console.log('SUCCESS:', r.data))
  .catch(e => console.error('ERROR:', e.response ? e.response.data : e.message));
