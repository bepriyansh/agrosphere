const axios = require('axios');
const POST_SERVICE_URL = process.env.POST_SERVICE_URL;

async function fetchPostData(postId) {
  const { data } = await axios.get(`${POST_SERVICE_URL}/api/posts/${postId}/ai-data`);
  return data;
}

module.exports = { fetchPostData };