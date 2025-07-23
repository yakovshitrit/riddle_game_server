import express from 'express'
import { supabase } from '../db/supabaseClient.js'

const router = express.Router()

router.post('/player/login', async (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ error: 'Missing username' })
  }
  try {
       const { data: existing, error: findError } = await supabase
      .from('players')
      .select('*')
      .eq('username', username)

    if (findError) throw findError

    if (existing.length > 0) {
      return res.json(existing[0])
    }

    const { data: inserted, error: insertError } = await supabase
      .from('players')
      .insert([{ username }])
      .select()

    if (insertError) throw insertError

    res.status(201).json(inserted[0])
  } catch (err) {
    console.error('', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})
router.get('/player/:id/score', async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabase
      .from('players')
      .select('score')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json({ score: data.score })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})


 


export default router
