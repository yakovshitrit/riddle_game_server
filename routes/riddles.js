import express from 'express'
import { ObjectId } from 'mongodb'
import { getRiddlesCollection} from '../db/mongoClient.js'

const router = express.Router()

router.get('/riddles', async (req, res) => {
  try {
    const collection = await getRiddlesCollection()
    const riddles = await collection.find({}).toArray()
    res.json(riddles)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/riddle', async (req, res) => {
  try {
    const { question, answer, level } = req.body
    if (!question || !answer || !level) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    const collection = await getRiddlesCollection()
    const result = await collection.insertOne({ question, answer, level })
    res.status(201).json({ message: 'Riddle added', id: result.insertedId })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/riddle/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { question, answer, level } = req.body
    if (!question && !answer && !level) {
      return res.status(400).json({ error: 'No fields to update' })
    }
    const collection = await getRiddlesCollection()
    const updateFields = {}
    if (question) updateFields.question = question
    if (answer) updateFields.answer = answer
    if (level) updateFields.level = level
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Riddle not found' })
    }
    res.json({ message: 'Riddle updated' })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/riddle/:id', async (req, res) => {
  try {
    const { id } = req.params
    const collection = await getRiddlesCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Riddle not found' })
    }
    res.json({ message: 'Riddle deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/riddle/random', async (req, res) => {
  try {
    const collection = await getRiddlesCollection()
    const result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray()
    if (result.length === 0) {
      return res.status(404).json({ error: 'No riddles found' })
    }
    res.json(result[0])
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router