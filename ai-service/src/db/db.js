const responses = new Map();

async function saveAIResponse(postId, response) {
  responses.set(postId, { response, timestamp: Date.now() });
}

async function getAIResponse(postId) {
  return responses.get(postId);
}

module.exports = { saveAIResponse, getAIResponse };
