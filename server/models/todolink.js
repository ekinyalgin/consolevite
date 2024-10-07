const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Todo = require('./todo'); // Todo modelini içe aktarıyoruz

const TodoLink = sequelize.define('TodoLink', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  todo_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {
      model: Todo,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: true, // URL isteğe bağlı
  },
  icon: {
    type: DataTypes.STRING(2000),
    allowNull: true, // İkon isteğe bağlı
  },
}, {
  tableName: 'todo_links',
  timestamps: false,
});

Todo.hasMany(TodoLink, { foreignKey: 'todo_id', as: 'links' });
TodoLink.belongsTo(Todo, { foreignKey: 'todo_id', as: 'todo' });

module.exports = TodoLink;
