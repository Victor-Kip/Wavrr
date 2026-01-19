// import {authRoutes }from './routes/authRoutes.js';

import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/db.js';
import userRoutes from "./routes/authRoutes.js";


process.env.PORT = process.env.PORT || 5000;


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
