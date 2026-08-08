import Sequelize from 'sequelize';
import db from '../config/db.js';

const Comment = db.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    post_id: { type: Sequelize.INTEGER, allowNull: false },
    user_id: { type: Sequelize.INTEGER, allowNull: false },
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
