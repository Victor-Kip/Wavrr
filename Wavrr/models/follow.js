import Sequelize from 'sequelize';
import db from '../config/db.js';

const Follow = db.define('follow', {
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
    follower_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    follower_uuid: { type: Sequelize.UUID, allowNull: false },
    following_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    following_uuid: { type: Sequelize.UUID, allowNull: false },
    following_type: {
        type: Sequelize.ENUM('user', 'artist'),
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'follows',
    freezeTableName: true
});

export default Follow;
