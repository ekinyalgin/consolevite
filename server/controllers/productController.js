const { Product } = require('../models');
const { Op } = require('sequelize');
const { Balance } = require('../models');

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.destroy({
      where: { id: id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductPurchasePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

    const balances = await Balance.findAll({
      where: {
        date: {
          [Op.gte]: sixMonthsAgo,
        },
      },
    });

    const totalIncome = balances
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = balances
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const averageIncome = totalIncome / 6;
    const averageExpense = totalExpense / 6;
    const monthlySavings = averageIncome - averageExpense;

    const monthsToPurchase = Math.ceil(product.price / monthlySavings);
    const installmentAmount = product.price / product.installments;
    const canAffordInstallments = installmentAmount <= monthlySavings;

    const plan = {
      monthsToPurchase,
      installmentAmount,
      canAffordInstallments,
      recommendedPlan: canAffordInstallments && product.installments > 1 ? 'installments' : 'savings',
    };

    res.json(plan);
  } catch (error) {
    console.error('Error in getProductPurchasePlan:', error);
    res.status(500).json({ error: error.message });
  }
};