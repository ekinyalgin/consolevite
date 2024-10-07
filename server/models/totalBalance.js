const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TotalBalance = sequelize.define('TotalBalance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalIncome: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
      tableName: 'total_balances',
      timestamps: true,
    });

module.exports = TotalBalance;