import express from 'express'
import dotenv from 'dotenv'
import riddlesRouter from './routes/riddles.js'
import playersRoutes from './routes/players.js';

dotenv.config();

const app =express();
app.use(express.json())

app.use('/api',riddlesRouter)
app.use('/api',playersRoutes)



const PORT =process.env.PORT

app.listen(PORT,()=>{
    console.log(`server listening in ${PORT}`)
})