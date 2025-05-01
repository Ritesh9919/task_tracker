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


app.get('/', (req, res)=> {
    res.send("Hello World")
})
app.use(cors({
    origin:'https://task-tracker-12mern.netlify.app',
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
    
    
}))



app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/tasks', taskRouter)
app.use(errorHandlerMiddleware)

export default app


