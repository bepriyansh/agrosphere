const express = require('express');
const { getAIResponse } = require('../db/db');
const router = express.Router();

router.get('/:dataId', async (req, res) => {
  const dataId = req.params.dataId;
  const response = await getAIResponse(dataId);
  if (!response) {
    return res.status(404).json({ success: false, message: "No AI response found for this post." });
  }
  res.json({
    success: true,
    dataId,
    aiResponse: response
  });
});

module.exports = router;