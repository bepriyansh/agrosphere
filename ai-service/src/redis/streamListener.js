const Redis = require('ioredis');
const processAI = require('../ai/processAI1');

const redis = new Redis(process.env.REDIS_URL);
const STREAM_KEY = 'ai_trigger_queue';
let lastId = '$';

async function listenToStream() {
  console.log("Listening to Redis stream...");
  while (true) {
    try {
      const result = await redis.xread(
        'BLOCK', 0,
        'STREAMS', STREAM_KEY, lastId
      );

      const [stream, messages] = result[0];
      for (const [id, fields] of messages) {
        // fields is an array like [ 'dataId', 'uuid-1234', ... ]
        const fieldObj = {};
        for (let i = 0; i < fields.length; i += 2) {
          fieldObj[fields[i]] = fields[i + 1];
        }
        const dataId = fieldObj.dataId;
        console.log(`Trigger received for dataId: ${dataId}`);

        // Fetch full post data from Redis
        const postDataStr = await redis.get(`data:${dataId}`);
        if (!postDataStr) {
          console.error(`No post data found in Redis for ${dataId}`);
          lastId = id;
          continue;
        }
        const postData = JSON.parse(postDataStr);

        // Pass dataId and postData to processAI
        await processAI(dataId, postData);

        lastId = id;
      }
    } catch (err) {
      console.error("Error reading Redis stream:", err);
    }
  }
}

module.exports = { listenToStream };