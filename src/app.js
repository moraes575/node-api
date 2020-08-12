const express = require('express')
const app = express()

const productsRouter = require('./routers/products')
const ordersRouter = require('./routers/orders')

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

module.exports = app