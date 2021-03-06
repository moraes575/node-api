const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const usersRouter = require('./routes/users')

app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.status(200).send({})
    }

    next()
})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        error: {
            'message': error.message
        }
    })
})

module.exports = app