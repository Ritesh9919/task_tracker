import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
import taskRouter from './routes/task.routes.js'
import errorHandlerMiddleware from './middlewares/error_handler.middleware.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    
    
}))



app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/tasks', taskRouter)
app.use(errorHandlerMiddleware)

export default app


