// controllers/todoController.js
const Todo = require('../models/todo');
const TodoLink = require('../models/todolink');
const { Sequelize } = require('sequelize');

// Tüm todoları getirme (ilişkili linkler ile birlikte)
exports.getAllTodos = async (req, res) => {
	try {
	  const todos = await Todo.findAll({
		include: [
		  { model: TodoLink, as: 'links' }
		],
		order: [['date', 'ASC']]
	  });
	  res.json(todos);
	} catch (error) {
	  console.error('Error fetching todos:', error);
	  res.status(500).json({ error: 'Server error' });
	}
  };
  
  // Yeni bir todo oluşturma
  exports.createTodo = async (req, res) => {
	const { title, note, date, links } = req.body;
  
	try {
	  const newTodo = await Todo.create({ 
		title, 
		note, 
		date 
	  });
  
	  if (links && links.length > 0) {
		const todoLinks = links.map(link => ({
		  todo_id: newTodo.id,
		  url: link.url,
		  icon: link.icon,
		}));
		await TodoLink.bulkCreate(todoLinks); // Linkleri toplu ekleme
	  }
  
	  const createdTodo = await Todo.findByPk(newTodo.id, { include: [{ model: TodoLink, as: 'links' }] });
	  res.status(201).json(createdTodo);
	} catch (error) {
	  console.error('Error creating todo:', error);
	  res.status(500).json({ error: 'Server error' });
	}
  };
  
  // Todo güncelleme
  exports.updateTodo = async (req, res) => {
	const { id } = req.params;
	const { title, note, date, links } = req.body;
  
	try {
	  const todo = await Todo.findByPk(id);
	  if (!todo) {
		return res.status(404).json({ error: 'Todo not found' });
	  }
  
	  // Todoyu güncelle
	  await todo.update({ title, note, date });
  
	  // Eski linkleri sil
	  await TodoLink.destroy({ where: { todo_id: id } });
  
	  // Yeni linkleri ekle
	  if (links && links.length > 0) {
		const todoLinks = links.map(link => ({
		  todo_id: id,
		  url: link.url,
		  icon: link.icon,
		}));
		await TodoLink.bulkCreate(todoLinks);
	  }
  
	  // Güncellenen todo ve linkleri getir
	  const updatedTodo = await Todo.findByPk(id, { include: [{ model: TodoLink, as: 'links' }] });
	  res.json(updatedTodo);
	} catch (error) {
	  console.error('Error updating todo:', error);
	  res.status(500).json({ error: 'Server error' });
	}
  };
  
  // Todo silme
  exports.deleteTodo = async (req, res) => {
	const { id } = req.params;
  
	try {
	  const todo = await Todo.findByPk(id);
	  if (!todo) {
		return res.status(404).json({ error: 'Todo not found' });
	  }
  
	  // Todo ve ilişkili linkleri sil
	  await todo.destroy();
	  res.status(204).end();
	} catch (error) {
	  console.error('Error deleting todo:', error);
	  res.status(500).json({ error: 'Server error' });
	}
  };
  
  // Todo tarih güncelleme
  exports.updateTodoDate = async (req, res) => {
	const { id } = req.params;
	const { date } = req.body;
  
	try {
	  const todo = await Todo.findByPk(id);
	  if (!todo) {
		return res.status(404).json({ error: 'Todo not found' });
	  }
  
	  await todo.update({ date });
	  res.json(todo);
	} catch (error) {
	  console.error('Error updating todo date:', error);
	  res.status(500).json({ error: 'Server error' });
	}
  };
