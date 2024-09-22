// controllers/todoController.js
const pool = require('../config/db');
const { formatDate } = require('../utils/dateUtils');

exports.getAllTodos = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY date');
    res.json(rows || []);
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  const { title, note, date, links } = req.body;
  try {
    const formattedDate = formatDate(date);
    const [result] = await pool.query(
      'INSERT INTO todos (title, note, date, links) VALUES (?, ?, ?, ?)',
      [title, note, formattedDate, JSON.stringify(links)]
    );
    const [newTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
	const { id } = req.params;
	const { title, note, date, links } = req.body;
	try {
	  const formattedDate = date ? new Date(date).toLocaleDateString('fr-CA') : null;
	  const query = 'UPDATE todos SET title = ?, note = ?, date = ?, links = ? WHERE id = ?';
	  const params = [title, note, formattedDate, JSON.stringify(links), id];
  
	  const [result] = await pool.query(query, params);
  
	  if (result.affectedRows === 0) {
		return res.status(404).json({ error: 'Todo not found' });
	  }
  
	  const [updatedTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
	  res.json(updatedTodo[0]);
	} catch (error) {
	  res.status(500).json({ error: 'Server error', details: error.message });
	}
  };
  
  exports.updateTodoDate = async (req, res) => {
	const { id } = req.params;
	const { date } = req.body;
	try {
	  const formattedDate = date ? new Date(date).toLocaleDateString('fr-CA') : null;
	  const [result] = await pool.query('UPDATE todos SET date = ? WHERE id = ?', [formattedDate, id]);
  
	  if (result.affectedRows === 0) {
		return res.status(404).json({ error: 'Todo not found' });
	  }
  
	  const [updatedTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
	  res.json(updatedTodo[0]);
	} catch (error) {
	  res.status(500).json({ error: 'Server error', details: error.message });
	}
  };
  