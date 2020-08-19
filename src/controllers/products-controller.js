const mysql = require('../database/mysql').pool

exports.getProductById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message: `Product not found. ID: ${req.params.id}`
                    })
                }
                return res.status(200).send(result[0])
            }
        )
    })
}

exports.getProducts = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    length: result.length,
                    products: result.map(product => {
                        return {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image_url: product.image_url,
                            links: {
                                href: 'http://localhost:3000/products/' + product.id
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.postProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO products (name, price) VALUES (?, ?)',
            [req.body.name, req.body.price],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    product: {
                        id: result.insertId,
                        name: req.body.name,
                        price: req.body.price,
                        links: {
                            href: 'http://localhost:3000/products/' + result.insertId
                        }
                    }
                }
                return res.status(201).send(response.product)
            }
        )
    })
}

exports.patchProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'UPDATE products SET image_url = ? WHERE id = ?',
            [req.file.filename, req.params.id],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (result.affectedRows === 0) { return res.status(404).send({ message: `Product not found. ID: ${req.params.id}` }) }
                const response = {
                    product: {
                        id: req.params.id,
                        image_url: req.file.filename,
                        links: {
                            href: 'http://localhost:3000/products/' + req.params.id
                        }
                    }
                }
                return res.status(200).send(response.product)
            }
        )
    })
}

exports.putProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'UPDATE products SET name = ?, price = ? WHERE id = ?',
            [req.body.name, req.body.price, req.params.id],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (result.affectedRows === 0) { return res.status(404).send({ message: `Product not found. ID: ${req.params.id}` }) }
                const response = {
                    product: {
                        id: req.params.id,
                        name: req.body.name,
                        price: req.body.price,
                        links: {
                            href: 'http://localhost:3000/products/' + req.params.id
                        }
                    }
                }
                return res.status(200).send(response.product)
            }
        )
    })
}

exports.deleteProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM products WHERE id = ?',
            [req.params.id],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (result.affectedRows === 0) { return res.status(404).send({ message: `Product not found. ID: ${req.params.id}` }) }
                return res.status(204).send()
            }
        )
    })
}