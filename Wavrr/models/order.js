import Sequelize from 'sequelize';
import db from '../config/db.js';

const Order = db.define('order', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    user_uuid: { type: Sequelize.UUID, allowNull: false },
    total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    status: { 
        type: Sequelize.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'), 
        defaultValue: 'PENDING' 
    },
    shipping_address: Sequelize.TEXT
}, {
    timestamps: true,
    tableName: 'orders',
    freezeTableName: true
});

export default Order;
