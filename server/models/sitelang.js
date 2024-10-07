const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SiteLang = sequelize.define('SiteLang', {
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
  tableName: 'sites_langs',
  timestamps: false,
});

module.exports = SiteLang;
