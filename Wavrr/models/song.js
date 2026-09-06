import Sequelize from "sequelize";
import db from "../config/db.js";

const Song = db.define(
  "song",
  {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    album_uuid: { type: Sequelize.UUID, allowNull: true },
    release_date: Sequelize.DATEONLY,
    audio_url: Sequelize.STRING,
    cover_url: Sequelize.STRING,
    genre: Sequelize.STRING,
    duration: Sequelize.INTEGER,
    artist_uuid: { type: Sequelize.UUID, allowNull: false },
    play_count: { type: Sequelize.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: true,
    tableName: "songs",
    freezeTableName: true,
  },
);

export default Song;
