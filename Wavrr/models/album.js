import Sequelize from 'sequelize';
import db from '../config/db.js';

const Album = db.define('album', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    cover_url: Sequelize.STRING,
    release_date: Sequelize.DATEONLY,
    artist_uuid: { type: Sequelize.UUID, allowNull: false }
}, {
    timestamps: true,
    tableName: 'albums',
    freezeTableName: true
});

export default Album;
