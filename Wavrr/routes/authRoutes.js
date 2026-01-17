
import { userRegister, userLogin, artistRegister, artistLogin } from '../controllers/authController.js';
import express from "express"

const app = express()
const router = express.Router();
app.use(express.urlencoded());


// register user
router.post('/register', userRegister)
router.post('/artist-register', artistRegister)
router.post('/login', userLogin)
router.post('/artist-login', artistLogin)
router.get('/register', (req, res) => {
    console.log("howdy")
    return res.status(200).json({success: true, message: "All fields are required"});
})
export default router