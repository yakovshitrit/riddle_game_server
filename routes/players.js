import express from 'express'
import pg from 'pg'

const { Pool } = pg
const router = express.Router()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI
})

router.post('/player', async (req, res) => {
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Username is required' })

  try {
    const result = await pool.query(
      'INSERT INTO players (username) VALUES ($1) RETURNING *',
      [username]
    )
    res.status(201).json({ message: 'Player created', player: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username already exists' })
    } else {
      console.error('Error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

router.get('/player/:username', async (req, res) => {
  const { username } = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM players WHERE username = $1',
      [username]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router