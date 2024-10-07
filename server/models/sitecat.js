const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SiteCat = sequelize.define('SiteCat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'sites_cats',
  timestamps: false,
});

module.exports = SiteCat;
