import express from 'express'
import riddlesRouter from './routes/riddles.js'
import playersRoutes from './routes/players.js';
import gameRouter from './routes/game.js'

const app =express();
app.use(express.json())

app.use('/riddle',riddlesRouter)
app.use('/player',playersRoutes)
app.use('/game', gameRouter)




const PORT =process.env.PORT

app.listen(PORT,()=>{
    console.log(`server listening in ${PORT}`)
})

