import express from 'express'
const router = express()
import {createProject, getProjects} from '../controllers/project.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

router.post('/', authenticate, createProject)
router.get('/', authenticate, getProjects)


export default router