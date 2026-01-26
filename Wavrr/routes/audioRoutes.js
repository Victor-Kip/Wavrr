import express from "express"
import { postAudio } from "../controllers/audioController.js";

const app = express()
const router = express.Router();
app.use(express.urlencoded());


// full routes are /audio/...
router.post('/new', postAudio)

export default router