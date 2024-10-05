const express = require('express');
const path = require('path');
const orderController = require('../controllers/controller');

const router = express.Router();

router.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'form.html'));
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'welcome.html'));
});

router.post('/submit', orderController.submitOrder);

router.get('/orders', orderController.getOrders);

router.post('/update-status', orderController.updateStatus);

module.exports = router;