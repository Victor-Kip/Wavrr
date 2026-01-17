// import {authRoutes }from './routes/authRoutes.js';

import sequelize  from'./config/db.js'
import User from './models/user.js'
import userRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import express from 'express';
import dotenv from 'dotenv';




const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/auth', userRoutes)
dotenv.config();
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})



sequelize.sync()
    .then(result => {
        app.listen(5432)
    })
    .catch(err => console.log(err))











let PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});
