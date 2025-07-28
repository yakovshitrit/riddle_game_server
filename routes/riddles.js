import express from 'express'
import {getAllRiddles,addRiddle,updateRiddle,deleteRiddle} from './service/riddleService.js';

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const riddles = await getAllRiddles();
    res.json(riddles);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/',async(req,res)=>{
  try{
    const{question,answer,level} = req.body
    if(!question||!answer||!level){
      return res.status(400).json({error:"missing requires fields"})
    }
    const id = await addRiddle({question,answer,level})
    res.status(201).json({id})
  }catch(err){
    console.error(err)
    res.status(500).json({error:'internal server error'})
  }
})

router.put('/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const fields = req.body;
    const result = await updateRiddle(id,fields)
    if(result.matchedCount === 0){
        return res.status(404).json({ error: 'Riddle not found' });
    }
      return res.json({updated:true})
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteRiddle(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Riddle not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router