const express = require('express');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const redis = new Redis(process.env.REDIS_URL);

const router = express.Router();

router.post('/store-post-data', async (req, res) => {
  const postData = req.body;
  const dataId = uuidv4();
  await redis.set(`data:${dataId}`, JSON.stringify(postData));
  await redis.xadd('ai_trigger_queue', '*', 'dataId', dataId);
  res.json({ success: true, message: "Post data stored and trigger queued.", dataId });
});

module.exports = router;