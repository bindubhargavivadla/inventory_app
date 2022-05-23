const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
