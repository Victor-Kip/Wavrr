import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Artist from "../models/artist.js";
import User from "../models/user.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY;
const JWT_SECRET = jwtSecret;

export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    }).catch((err) => {
      console.log(err);
    });

    const token = jwt.sign(
      {
        actorUuid: user.uuid,
        actorType: "user",
        email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    user.token = token;
    user.password = undefined;
    res.status(201).json({ success: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({
      actorUuid: user.uuid,
      actorType: "user",
    }, JWT_SECRET, {
      expiresIn: "7d",
    });
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    user.password = undefined;

    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const artistRegister = async (req, res) => {
  try {
    const { username, email, password, genre } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingArtist = await Artist.findOne({ where: { email: email } });

    if (existingArtist) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const artist = await Artist.create({
      username: username,
      email: email,
      genre: genre,
      password: hashedPassword,
    }).catch((err) => {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });

    const token = jwt.sign(
      {
        actorUuid: artist.uuid,
        actorType: "artist",
        email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    artist.token = token;
    artist.password = undefined;
    res.status(201).json({ success: true, artist: artist });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

export const artistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const artist = await Artist.findOne({ where: { email: email } });
    if (!artist) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    const match = await bcrypt.compare(password, artist.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({
      actorUuid: artist.uuid,
      actorType: "artist",
    }, JWT_SECRET, {
      expiresIn: "7d",
    });
    artist.token = token;
    artist.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, artist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export default register
