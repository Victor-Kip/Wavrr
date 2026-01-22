import User from '../models/user.js'
import Artist from '../models/artist.js';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';




dotenv.config();


const jwtSecret= process.env.JWT_SECRET_KEY
const JWT_SECRET = jwtSecret

export const userRegister= async(req, res) => {
    try {
        const { username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(401).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email : email,
            password: hashedPassword
        })
        .catch(err => {
            console.log(err)
        })


        const token = jwt.sign(
            {
                id: user._id, email
            }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2h"
            }
        )
        user.token = token
        user.password = undefined
        res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({success: false, message: "Error registering user"});
    }
}


export const userLogin = async(req, res) => {
    try {
        const {email, password} = req.body
        if(!email && !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
        return res.status(400).json({success: false, message: "User Not Found"});
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        return res.status(400).json({success: false, message: "Invalid password"});
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });
        user.token = token
        user.password = undefined

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie('token', token, options).json({ success:true, token });
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
}

export const artistRegister =  async(req, res) => {
    try {
        const { username, email, password, genre} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const existingArtist = await Artist.findOne({ where: { email: email } });

        if (existingArtist) {
            return res.status(401).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const artist = await Artist.create({
            username: username,
            email : email,
            genre: genre,
            password: hashedPassword
        })
        .catch(err => {
            res.status(500).json({success: false, message: "Internal Server Error"});
        })


        const token = jwt.sign(
            {
                id: artist._id, email
            }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2h"
            }
        )
        artist.token = token
        artist.password = undefined
        res.status(201).json(artist)


    } catch (error) {
        return res.status(500).json({success: false, message: "Error registering user"});
    }
}



export const artistLogin = async(req, res) => {
    try {
        const {email, password} = req.body
        if(!email && !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const artist = await Artist.findOne({ where: { email: email } });
        if (!artist) {
        return res.status(400).json({success: false, message: "User Not Found"});
        }
        const match = await bcrypt.compare(password, artist.password);
        if (!match) {
        return res.status(400).json({success: false, message: "Invalid password"});
        }

        const token = jwt.sign({ userId: artist._id }, JWT_SECRET, { expiresIn: "2h" });
        artist.token = token
        artist.password = undefined

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie('token', token, options).json({ success:true, token });
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
}



// export default register
