require('dotenv').config();
const { fetchPostData } = require('./src/services/dataFetcher');

(async () => {
  try {
    const data = await fetchPostData('test123');
    console.log('Fetched data:', data);
  } catch (err) {
    console.error('Error fetching data:', err.message);
  }
})();