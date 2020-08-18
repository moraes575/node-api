const express = require('express')
const router = express.Router()
const mysql = require('../database/mysql').pool
const login = require('../middleware/login')

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT o.id AS order_id, o.quantity, o.product_id, p.name, p.price FROM orders o INNER JOIN products p ON o.product_id = p.id WHERE o.id = ?',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message: `Order not found. ID: ${req.params.id}`
                    })
                }
                const response = {
                    order: {
                        id: result[0].order_id,
                        quantity: result[0].quantity,
                        product: {
                            id: result[0].product_id,
                            name: result[0].name,
                            price: result[0].price
                        }
                    }
                }
                return res.status(200).send(response.order)
            }
        )
    })
})

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    length: result.length,
                    orders: result.map(order => {
                        return {
                            id: order.id,
                            quantity: order.quantity,
                            product_id: order.product_id,
                            links: {
                                href: 'http://localhost:3000/orders/' + order.id
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})

router.post('/', login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE id = ?',
            [req.body.product_id],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message: `Product not found. ID: ${req.body.product_id}`
                    })
                }
                conn.query(
                    'INSERT INTO orders (quantity, product_id) VALUES (?, ?)',
                    [req.body.quantity, req.body.product_id],
                    (error, result, field) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            order: {
                                id: result.insertId,
                                quantity: req.body.quantity,
                                product_id: req.body.product_id,
                                links: {
                                    href: 'http://localhost:3000/orders/' + result.insertId
                                }
                            }
                        }
                        return res.status(201).send(response.order)
                    }
                )
            }
        )
    })
})

router.put('/:id', login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE id = ?',
            [req.body.product_id],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message: `Product not found. ID: ${req.body.product_id}`
                    })
                }
                conn.query(
                    'UPDATE orders SET quantity = ?, product_id = ? WHERE id = ?',
                    [req.body.quantity, req.body.product_id, req.params.id],
                    (error, result, field) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) }
                        if (result.affectedRows === 0) { return res.status(404).send({ message: `Order not found. ID: ${req.params.id}` }) }
                        const response = {
                            order: {
                                id: req.params.id,
                                quantity: req.body.quantity,
                                product_id: req.body.product_id,
                                links: {
                                    href: 'http://localhost:3000/orders/' + req.params.id
                                }
                            }
                        }
                        return res.status(200).send(response.order)
                    }
                )
            }
        )
    })
})

router.delete('/:id', login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM orders WHERE id = ?',
            [req.params.id],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (result.affectedRows === 0) { return res.status(404).send({ message: `Order not found. ID: ${req.params.id}` }) }
                return res.status(204).send()
            }
        )
    })
})

module.exports = router