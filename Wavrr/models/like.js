import Sequelize from 'sequelize';
import db from '../config/db.js';

const Like = db.define('like', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: { type: Sequelize.INTEGER, allowNull: true },
    actor_id: { type: Sequelize.INTEGER, allowNull: true },
    actor_type: {
        type: Sequelize.ENUM('user', 'artist'),
        allowNull: false,
        defaultValue: 'user'
    },
    target_id: { type: Sequelize.INTEGER, allowNull: false },
    target_type: { 
        type: Sequelize.ENUM('POST', 'SONG'), 
        allowNull: false 
    }
}, {
    timestamps: true,
    tableName: 'likes',
    freezeTableName: true
});

export default Like;
