import User from '../models/user.js'
import Artist from '../models/artist.js';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';



dotenv.config();

export const postAudio= async(req, res) => {
    return res.status(200).json({success: true, message: "New music added"});
}

