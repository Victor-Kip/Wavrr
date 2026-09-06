import Sequelize from 'sequelize';
import db from '../config/db.js';

const PlaylistSong = db.define('playlist_song', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    playlist_uuid: { type: Sequelize.UUID, allowNull: false },
    song_uuid: { type: Sequelize.UUID, allowNull: false }
}, {
    timestamps: true,
    tableName: 'playlist_songs',
    freezeTableName: true
});

export default PlaylistSong;
