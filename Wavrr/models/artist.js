import Sequelize from 'sequelize'
import db from '../config/db.js'


const Artist = db.define('artist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    genre: Sequelize.STRING,
    token: Sequelize.STRING,
})



export default Artist