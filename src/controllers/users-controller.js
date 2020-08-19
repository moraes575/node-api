const mysql = require('../database/mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getUserById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM users WHERE id = ?',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message: `User not found. ID: ${req.params.id}`
                    })
                }
                return res.status(200).send(result[0])
            }
        )
    })
}

exports.getUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM users',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    length: result.length,
                    users: result.map(user => {
                        return {
                            id: user.id,
                            email: user.email,
                            password: user.password,
                            links: {
                                href: 'http://localhost:3000/users/' + user.id
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.postUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length > 0) {
                return res.status(409).send({ message: 'Email already exists' })
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'INSERT INTO users (email, password) VALUES (?, ?)',
                        [req.body.email, hash],
                        (error, result, field) => {
                            conn.release()
                            if (error) { return res.status(500).send({ error: error }) }
                            const response = {
                                user: {
                                    id: result.insertId,
                                    email: req.body.email,
                                    password: hash,
                                    links: {
                                        href: 'http://localhost:3000/users/' + result.insertId
                                    }
                                }
                            }
                            return res.status(201).send(response.user)
                        }
                    )
                })
            }
        })
    })
}

exports.loginUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = 'SELECT * FROM users WHERE email = ?'
        conn.query(query, [req.body.email], (error, result, fields) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length < 1) {
                return res.status(401).send({ message: 'Authentication failed' })
            }
            bcrypt.compare(req.body.password, result[0].password, (error, isEqual) => {
                if (error) {
                    return res.status(401).send({ message: 'Authentication failed' })
                }
                if (isEqual) {
                    const token = jwt.sign({
                        id: result[0].id,
                        email: result[0].email
                    },
                        process.env.JWT_KEY, {
                        expiresIn: '1h'
                    })
                    return res.status(200).send({ message: 'Authentication completed', token: token })
                }
                return res.status(401).send({ message: 'Authentication failed' })
            })
        })
    })
}

exports.putUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
            if (error) { return res.status(500).send({ error: errBcrypt }) }
            if (result === []) { result[0].id = 0 }
            if (result.length > 0 && result[0].id != req.params.id) {
                return res.status(409).send({ message: 'Email already exists' })
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'UPDATE users SET email = ?, password = ? WHERE id = ?',
                        [req.body.email, hash, req.params.id],
                        (error, result, field) => {
                            conn.release()
                            if (error) { return res.status(500).send({ error: error }) }
                            if (result.affectedRows === 0) { return res.status(404).send({ message: `User not found. ID: ${req.params.id}` }) }
                            const response = {
                                user: {
                                    id: req.params.id,
                                    email: req.body.email,
                                    password: hash,
                                    links: {
                                        href: 'http://localhost:3000/users/' + req.params.id
                                    }
                                }
                            }
                            return res.status(200).send(response.user)
                        }
                    )
                })
            }
        })
    })
}

exports.deleteUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM users WHERE id = ?',
            [req.params.id],
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (result.affectedRows === 0) { return res.status(404).send({ message: `User not found. ID: ${req.params.id}` }) }
                return res.status(204).send()
            }
        )
    })
}