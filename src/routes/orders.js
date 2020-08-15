const express = require('express')
const router = express.Router()

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Return a specific order',
        order_id: id
    })
})

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Orders list'
    })
})

router.post('/', (req, res, next) => {

    const order = {
        product_id: req.body.product_id,
        quantity: req.body.quantity
    }

    res.status(201).send({
        message: 'Order created',
        order: order
    })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Order updated',
        order_id: id
    })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Order deleted',
        order_id: id
    })
})

module.exports = router