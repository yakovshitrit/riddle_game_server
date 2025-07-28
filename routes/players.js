import express from 'express'
import { loginPlayer, getPlayerScore } from './service/supabaseService.js';

const router = express.Router()


router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }
  try {
    const player = await loginPlayer(username);
    res.status(201).json(player);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/score', async (req, res) => {
  const { id } = req.params;
  try {
    const score = await getPlayerScore(id);
    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router
