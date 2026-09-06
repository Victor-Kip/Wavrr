import Sequelize from 'sequelize';
import db from '../config/db.js';

const Post = db.define('post', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    type: { type: Sequelize.ENUM('text', 'poll', 'announcement'), allowNull: false, defaultValue: 'text' },
    content: { type: Sequelize.TEXT, allowNull: false },
    media_url: { type: Sequelize.STRING, allowNull: true },
    poll_options: { type: Sequelize.JSONB, allowNull: true },
    poll_votes: { type: Sequelize.JSONB, allowNull: true },
    author_uuid: { type: Sequelize.UUID, allowNull: true },
    authorType: { type: Sequelize.ENUM('user', 'artist'), allowNull: false },
    is_pinned: { type: Sequelize.BOOLEAN, defaultValue: false },
    like_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    comment_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    share_count: { type: Sequelize.INTEGER, defaultValue: 0 }
}, { timestamps: true, tableName: 'posts', freezeTableName: true });

export default Post;
