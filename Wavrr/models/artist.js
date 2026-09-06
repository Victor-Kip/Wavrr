import Sequelize from 'sequelize';
import db from '../config/db.js';

const Artist = db.define('artist', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    genre: Sequelize.STRING,
    bio: Sequelize.TEXT,
    token: Sequelize.STRING,
    favorite_song_uuid: { type: Sequelize.UUID, allowNull: true }
});

export default Artist;
