const axios = require('axios');

const API = 'http://localhost:3001/api';

(async () => {
  try {
    console.log('1) /health');
    const health = await axios.get(API.replace('/api','') + '/health');
    console.log(health.data);

    console.log('\n2) /forms');
    const forms = await axios.get(API + '/forms?page=1&pageSize=5');
    console.log(forms.data);

    console.log('\n3) /news');
    const news = await axios.get(API + '/news?page=1&pageSize=5');
    console.log(news.data);

  } catch (err) {
    console.error('请求失败:', err.message);
  }
})();