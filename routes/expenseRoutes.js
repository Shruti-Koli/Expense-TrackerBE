const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authentication');

const router = express.Router();


router.get('/get-expenses', authenticate.authenticate, expenseController.getExpenses);
router.post('/add-expense', authenticate.authenticate, expenseController.addExpense);
router.delete('/delete-expense/:id', authenticate.authenticate, expenseController.deleteExpense);

module.exports = router;