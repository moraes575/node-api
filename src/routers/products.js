const express = require('express')
const router = express.Router()

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Return a specific product',
        product_id: id
    })
})

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Products list'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        message: 'Product created'
    })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Product updated',
        product_id: id
    })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        message: 'Product deleted',
        product_id: id
    })
})

module.exports = router