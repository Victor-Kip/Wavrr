import Sequelize from 'sequelize';
import db from '../config/db.js';

const Comment = db.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    post_id: { type: Sequelize.INTEGER, allowNull: true },
    post_uuid: { type: Sequelize.UUID, allowNull: false },
    user_id: { type: Sequelize.INTEGER, allowNull: true },
    actor_id: { type: Sequelize.INTEGER, allowNull: true },
    actor_uuid: { type: Sequelize.UUID, allowNull: true },
    actor_type: {
        type: Sequelize.ENUM('user', 'artist'),
        allowNull: false,
        defaultValue: 'user'
    },
    text: { type: Sequelize.TEXT, allowNull: false }
}, {
    timestamps: true,
    tableName: 'comments',
    freezeTableName: true
});

export default Comment;
