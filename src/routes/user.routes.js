import express from 'express'
const router = express()
import {signup, login, logout} from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', authenticate, logout)

export default router