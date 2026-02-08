const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateProduct = [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
];

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

router.route('/').post(protect, admin, validateProduct, createProduct);
router.route('/:id')
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

module.exports = router;