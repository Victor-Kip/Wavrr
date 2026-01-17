import Sequelize from 'sequelize'
import dotenv from 'dotenv';

dotenv.config();

const database= process.env.DB_NAME
const username= process.env.DB_USERNAME
const password= process.env.DB_PASSWORD
const host= process.env.DB_HOST
const port= process.env.DB_PORT

const db = new Sequelize(
    database, username, password,
    {
        dialect: 'postgres',
        host: host,
        port: port,
    }
)

// const db = new Sequelize(`postgres://${username}:${password}@${host}:${port}/${database}`);
export default db




