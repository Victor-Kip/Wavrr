import Sequelize from 'sequelize';
import db from '../config/db.js';

const Comment = db.define('comment', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    post_uuid: { type: Sequelize.UUID, allowNull: false },
    actor_uuid: { type: Sequelize.UUID, allowNull: false },
    actor_type: { type: Sequelize.ENUM('user', 'artist'), allowNull: false, defaultValue: 'user' },
    text: { type: Sequelize.TEXT, allowNull: false }
}, { timestamps: true, tableName: 'comments', freezeTableName: true });

export default Comment;
