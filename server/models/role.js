const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false,
});

Role.associate = (models) => {
  Role.hasMany(models.User, { foreignKey: 'role_id', as: 'Users' });
};

module.exports = Role;