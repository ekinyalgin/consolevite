const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Balance = sequelize.define('Balance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
    },
    totalInstallments: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    addedByAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
      tableName: 'balances',
      timestamps: false,
    });

module.exports = Balance;