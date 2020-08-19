const express = require('express')
const router = express.Router()
const login = require('../middleware/login')

const ordersController = require('../controllers/orders-controller')

router.get('/:id', ordersController.getOrderById)

router.get('/', ordersController.getOrders)

router.post('/', login, ordersController.postOrder)

router.put('/:id', login, ordersController.putOrder)

router.delete('/:id', login, ordersController.deleteOrder)

module.exports = router