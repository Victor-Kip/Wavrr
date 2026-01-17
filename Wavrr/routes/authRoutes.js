
import { userRegister, userLogin, artistRegister, artistLogin } from '../controllers/authController.js';
import express from "express"

const app = express()
const router = express.Router();
app.use(express.urlencoded());


// register user

// full routes are /api/auth/...
router.post('/register', userRegister)
router.post('/artist-register', artistRegister)
router.post('/login', userLogin)
router.post('/artist-login', artistLogin)

export default router