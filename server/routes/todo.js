// routes/todo.js
const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  updateTodoDate,
} = require('../controllers/todoController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/', authorize, isAdmin, getAllTodos);
router.post('/', authorize, isAdmin, createTodo);
router.delete('/:id', authorize, isAdmin, deleteTodo);
router.put('/:id', authorize, isAdmin, updateTodo);
router.put('/:id/date', authorize, isAdmin, updateTodoDate);

module.exports = router;
