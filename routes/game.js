import express from 'express';
import { checkAnswerAndUpdateScore } from './service/gameService.js';

const router = express.Router();


router.post('/answer', async (req, res) => {
  const { riddleId, answer, playerId } = req.body;

  if (!riddleId || !answer || !playerId) {
    return res.status(400).json({ error: 'Missing riddleId, answer, or playerId' });
  }

  try {
    const result = await checkAnswerAndUpdateScore(riddleId, answer, playerId);
    res.json(result);  
  } catch (err) {
    console.error('Error checking answer:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
