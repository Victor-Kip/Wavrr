import Sequelize from 'sequelize'
import db from '../config/db.js'


const Artist = db.define('artist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: true,
        unique: true
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    genre: Sequelize.STRING,
    bio: Sequelize.TEXT,
    token: Sequelize.STRING,
    favoriteSongId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
})



export default Artist