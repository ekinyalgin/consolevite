const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'exercises',
  timestamps: false,
});

module.exports = Exercise;
