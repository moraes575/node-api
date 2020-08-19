const express = require('express')
const router = express.Router()
const login = require('../middleware/login')

const usersController = require('../controllers/users-controller')

router.get('/:id', usersController.getUserById)

router.get('/', usersController.getUsers)

router.post('/', usersController.postUser)

router.post('/login', usersController.loginUser)

router.put('/:id', login, usersController.putUser)

router.delete('/:id', login, usersController.deleteUser)

module.exports = router