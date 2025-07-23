import express from 'express'
import { supabase } from '../db/supabaseClient.js'
import { getRiddlesCollection } from '../db/mongoClient.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

router.post('/game/:riddleId/answer', async (req, res) => {
  const { riddleId } = req.params
  const { answer, playerId } = req.body

  if (!answer || !playerId) {
    return res.status(400).json({ error: 'Missing answer or playerId' })
  }

  try {
    const collection = await getRiddlesCollection()
    const riddle = await collection.findOne({ _id: new ObjectId(riddleId) })

    if (!riddle) {
      return res.status(404).json({ error: 'Riddle not found' })
    }

    const isCorrect = riddle.answer.toLowerCase().trim() === answer.toLowerCase().trim()

    if (isCorrect) {
      const { error: updateError } = await supabase
        .from('players')
        .update({ score: riddle.level === 'hard' ? 3 : riddle.level === 'medium' ? 2 : 1 })
        .eq('id', playerId)

      if (updateError) throw updateError
    }

    const { data: playerData, error: fetchError } = await supabase
      .from('players')
      .select('score')
      .eq('id', playerId)
      .single()

    if (fetchError) throw fetchError

    res.json({
      correct: isCorrect,
      newScore: playerData.score,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
