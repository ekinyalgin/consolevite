const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = require('./role');
const Language = require('./sitelanguage');


class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'User', 
  tableName: 'users', 
  timestamps: false, 
});

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'Role' });
};

module.exports = User;
