import Sequelize from 'sequelize';
import db from '../config/db.js';

const Like = db.define('like', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    actor_uuid: { type: Sequelize.UUID, allowNull: false },
    actor_type: { type: Sequelize.ENUM('user', 'artist'), allowNull: false, defaultValue: 'user' },
    target_uuid: { type: Sequelize.UUID, allowNull: false },
    target_type: { type: Sequelize.ENUM('POST', 'SONG'), allowNull: false }
}, { timestamps: true, tableName: 'likes', freezeTableName: true });

export default Like;
