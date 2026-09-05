import Sequelize from 'sequelize';
import db from '../config/db.js';

const Merchandise = db.define('merchandise', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, unique: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: Sequelize.TEXT,
    price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    image_url: Sequelize.STRING,
    stock_quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
    artist_id: { type: Sequelize.INTEGER, allowNull: true },
    artist_uuid: { type: Sequelize.UUID, allowNull: false },
    is_available: { type: Sequelize.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    tableName: 'merchandise',
    freezeTableName: true
});

export default Merchandise;
