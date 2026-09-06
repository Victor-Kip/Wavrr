import Sequelize from 'sequelize';
import db from '../config/db.js';

const Follow = db.define('follow', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    follower_uuid: { type: Sequelize.UUID, allowNull: false },
    following_uuid: { type: Sequelize.UUID, allowNull: false },
    following_type: { type: Sequelize.ENUM('user', 'artist'), allowNull: false }
}, { timestamps: true, tableName: 'follows', freezeTableName: true });

export default Follow;
