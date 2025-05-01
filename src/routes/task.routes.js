import express from 'express'
const router = express()
import {createTask, getAllTasks, readTask, updateTask, deleteTask} from '../controllers/task.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

router.post('/:projectId', authenticate, createTask)
router.get('/:taskId', authenticate, readTask)
router.get('/project/:projectId', authenticate, getAllTasks)
router.put('/:taskId', authenticate, updateTask)
router.delete('/:taskId', authenticate, deleteTask)


export default router