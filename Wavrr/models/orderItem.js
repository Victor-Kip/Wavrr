import Sequelize from 'sequelize';
import db from '../config/db.js';

const OrderItem = db.define('order_item', {
    uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    order_uuid: { type: Sequelize.UUID, allowNull: false },
    merch_uuid: { type: Sequelize.UUID, allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    price_at_purchase: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
}, {
    timestamps: true,
    tableName: 'order_items',
    freezeTableName: true
});

export default OrderItem;
