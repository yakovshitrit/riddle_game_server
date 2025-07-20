import express from 'express'
import { getRiddlesCollection,ObjectId } from '../db/mongoClient.js'

const router = express.Router();

router.get('/riddles', async (req, res) => {
  try {
    const riddlesCollection = await getRiddlesCollection();
    const riddles = await riddlesCollection.find({}).toArray();
    res.json(riddles);
  } catch (err) {
    console.error('Error fetching riddles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/riddle', async (req, res) => {
  try {
    const { question, answer, level } = req.body;
    if (!question || !answer || !level) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const riddlesCollection = await getRiddlesCollection();
    const result = await riddlesCollection.insertOne({ question, answer, level });

    res.status(201).json({ message: 'Riddle added', id: result.insertedId });
  } catch (err) {
    console.error('Error adding riddle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/riddle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, level } = req.body;

    if (!question && !answer && !level) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const riddlesCollection = await getRiddlesCollection();

    const updateFields = {};
    if (question) updateFields.question = question;
    if (answer) updateFields.answer = answer;
    if (level) updateFields.level = level;

    const result = await riddlesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Riddle not found' });
    }

    res.json({ message: 'Riddle updated' });
  } catch (err) {
    console.error('Error updating riddle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/riddle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const riddlesCollection = await getRiddlesCollection();
    
    const result = await riddlesCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Riddle not found' });
    }

    res.json({ message: 'Riddle deleted' });
  } catch (err) {
    console.error('Error deleting riddle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/load-initial-riddles', async (req, res) => {
  try {
    const initialRiddles = [
      {
        question: "What has keys but can't open locks?",
        answer: "Keyboard",
        level: "easy"
      },
      {
        question: "I speak without a mouth and hear without ears. What am I?",
        answer: "Echo",
        level: "medium"
      },
      {
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        answer: "The letter M",
        level: "hard"
      }
    ];

    const riddlesCollection = await getRiddlesCollection();
    await riddlesCollection.insertMany(initialRiddles);

    res.status(201).json({ message: 'Initial riddles loaded' });
  } catch (err) {
    console.error('Error loading initial riddles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;