const express = require('express')
const router = express.Router()
const multer = require('multer')
const uuid = require('uuid')
const login = require('../middleware/login')

const productsController = require('../controllers/products-controller')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        callback(null, uuid.v4() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/:id', productsController.getProductById)

router.get('/', productsController.getProducts)

router.post('/', login, productsController.postProduct)

router.patch('/:id', login, upload.single('product_image'), productsController.patchProduct)

router.put('/:id', login, productsController.putProduct)

router.delete('/:id', login, productsController.deleteProduct)

module.exports = router