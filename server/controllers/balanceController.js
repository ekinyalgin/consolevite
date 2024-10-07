const { Balance, TotalBalance } = require('../models');
const { Op } = require('sequelize');

exports.addBalance = async (req, res) => {
  try {
    const balanceData = {
      ...req.body,
      userId: req.user.id,
    };
    const balance = await Balance.create(balanceData);

    // Update TotalBalance for both income and expense
    let totalBalance = await TotalBalance.findOne({ where: { userId: req.user.id } });
    if (!totalBalance) {
      totalBalance = await TotalBalance.create({ userId: req.user.id, totalIncome: 0 });
    }
    
    if (balance.type === 'income') {
      totalBalance.totalIncome = parseFloat(totalBalance.totalIncome) + parseFloat(balance.totalAmount);
    } else {
      totalBalance.totalIncome = parseFloat(totalBalance.totalIncome) - parseFloat(balance.totalAmount);
    }
    
    await totalBalance.save();

    res.status(201).json(balance);
  } catch (error) {
    console.error('Error adding balance:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getBalances = async (req, res) => {
  try {
    const balances = await Balance.findAll({
      where: { userId: req.user.id },
      order: [['date', 'ASC']], // Tarihe göre artan sıralama (eskiden yeniye)
    });
    
    const totalBalance = await TotalBalance.findOne({ where: { userId: req.user.id } });
    
    let groupedBalances = {};

    balances.forEach(balance => {
      const date = new Date(balance.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groupedBalances[monthYear]) {
        groupedBalances[monthYear] = {
          balances: [],
        };
      }

      groupedBalances[monthYear].balances.push(balance);
    });

    const groupedBalancesArray = Object.entries(groupedBalances).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => a.date.localeCompare(b.date)); // Tarihe göre artan sıralama (eskiden yeniye)

    res.json({
      totalIncome: totalBalance ? totalBalance.totalIncome : 0,
      groupedBalances: groupedBalancesArray,
    });
  } catch (error) {
    console.error('Error in getBalances:', error);
    res.status(500).json({ error: error.message, balances: [] });
  }
};

exports.updateBalance = async (req, res) => {
  const { id } = req.params;
  try {
    const balance = await Balance.findOne({
      where: { id: id, userId: req.user.id }
    });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }

    const updatedData = {
      ...req.body,
      totalAmount: req.body.totalAmount,
    };

    // Remove the id from updatedData to prevent attempting to update the primary key
    delete updatedData.id;

    await balance.update(updatedData);

    const updatedBalance = await Balance.findByPk(id);
    res.json(updatedBalance);
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.decreaseInstallment = async (req, res) => {
  const { id } = req.params;
  try {
    const balance = await Balance.findOne({
      where: { id: id, userId: req.user.id }
    });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }

    if (balance.totalInstallments > 0) {
      balance.totalInstallments -= 1;
      
      // Tarihi bir sonraki aya güncelle
      const currentDate = new Date(balance.date);
      currentDate.setMonth(currentDate.getMonth() + 1);
      balance.date = currentDate;

      if (balance.totalInstallments === 0) {
        if (balance.isRecurring) {
          // Eğer tekrar edense, taksit sayısını sıfırlamak yerine yeniden başlat
          balance.totalInstallments = 1; // Bir sonraki ay için
        } else {
          balance.isCompleted = true;
        }
      }

      await balance.save();

      // Update TotalBalance
      let totalBalance = await TotalBalance.findOne({ where: { userId: req.user.id } });
      if (totalBalance) {
        const amountToDecrease = balance.isRecurring ? balance.totalAmount : (balance.totalAmount / (balance.totalInstallments + 1));
        totalBalance.totalIncome = (parseFloat(totalBalance.totalIncome) - amountToDecrease).toFixed(2);
        await totalBalance.save();
      }
    }

    res.json(balance);
  } catch (error) {
    console.error('Error decreasing installment:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBalance = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Balance.destroy({
      where: { id: id, userId: req.user.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Balance not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};