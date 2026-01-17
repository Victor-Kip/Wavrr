import Sequelize from 'sequelize'
import db from '../config/db.js'


const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    token: Sequelize.STRING,
})



export default User