import Sequelize from 'sequelize';
import db from '../config/db.js';

const User = db.define('user', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    profile_picture_url: Sequelize.STRING,
    bio: Sequelize.TEXT,
    favorite_song_uuid: { type: Sequelize.UUID, allowNull: true },
    following: { type: Sequelize.JSONB, defaultValue: [] },
    followers_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    following_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
    role: { type: Sequelize.ENUM('user', 'artist', 'admin'), defaultValue: 'user' },
    token: Sequelize.STRING,
    is_active: { type: Sequelize.BOOLEAN, defaultValue: true }
});

export default User;
