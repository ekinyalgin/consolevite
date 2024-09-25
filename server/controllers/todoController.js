// controllers/todoController.js
const pool = require('../config/db');
const { formatDate } = require('../utils/dateUtils');

exports.getAllTodos = async (req, res, next) => {
  try {
    const [todos] = await pool.query('SELECT * FROM todos ORDER BY date');
    const [links] = await pool.query('SELECT * FROM todo_links');
    
    const todosWithLinks = todos.map(todo => {
      todo.links = links.filter(link => link.todo_id === todo.id);
      return todo;
    });

    res.json(todosWithLinks || []);
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  const { title, note, date, links } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const formattedDate = formatDate(date);
    const [result] = await connection.query(
      'INSERT INTO todos (title, note, date) VALUES (?, ?, ?)',
      [title, note, formattedDate]
    );
    const todoId = result.insertId;

    if (links && links.length > 0) {
      const linkPromises = links.map(link => 
        connection.query(
          'INSERT INTO todo_links (todo_id, url, icon) VALUES (?, ?, ?)',
          [todoId, link.url, link.icon]
        )
      );
      await Promise.all(linkPromises);
    }

    await connection.commit();
    const [newTodo] = await connection.query('SELECT * FROM todos WHERE id = ?', [todoId]);
    res.status(201).json(newTodo[0]);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
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
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();
		const formattedDate = date ? new Date(date).toLocaleDateString('fr-CA') : null;
		const query = 'UPDATE todos SET title = ?, note = ?, date = ? WHERE id = ?';
		const params = [title, note, formattedDate, id];
		const [result] = await connection.query(query, params);

		if (result.affectedRows === 0) {
			await connection.rollback();
			return res.status(404).json({ error: 'Todo not found' });
		}

		await connection.query('DELETE FROM todo_links WHERE todo_id = ?', [id]);
		if (links && links.length > 0) {
			const linkPromises = links.map(link => 
				connection.query(
					'INSERT INTO todo_links (todo_id, url, icon) VALUES (?, ?, ?)',
					[id, link.url, link.icon]
				)
			);
			await Promise.all(linkPromises);
		}

		await connection.commit();
		const [updatedTodo] = await connection.query('SELECT * FROM todos WHERE id = ?', [id]);
		const [updatedLinks] = await connection.query('SELECT * FROM todo_links WHERE todo_id = ?', [id]);
		updatedTodo[0].links = updatedLinks;
		res.json(updatedTodo[0]);
	} catch (error) {
		await connection.rollback();
		console.error('Error updating todo:', error);
		res.status(500).json({ error: 'Server error', details: error.message, stack: error.stack });
	} finally {
		connection.release();
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
