const express = require('express');
const router = express.Router();
const multer = require('multer');
const productsController = require('../controllers/products');
const { body, validationResult } = require('express-validator');
const authenticationmiddleware = require('../middlewares/authentication');
const Products = require('../models').Products;
//let define uniqueName be null
let uniqueName = null;
//using multer stores the image file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    limits: { fieldNameSize: 1000, fileSize: 102400000 },
    fileFilter: (req, file, cb) => {
        console.log('File filter running..');
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png .jpg and .jpeg are allwed'));
        }
    },
});

router.post(
    '/',
    authenticationmiddleware,
    body('name', 'Product name not be empty').trim().notEmpty(),
    body('quantity', 'quantity must be an integer greater than 0')
        .isInt({
            gt: 0,
        })
        .notEmpty()
        .withMessage('Quantity not be empty'),
    body('price', 'price must be an integer greater than 0').isInt({
        gt: 0,
    }),
    upload.single('image'),
    async (req, res) => {
        console.log(req.body);
        const {
            name,
            description,
            quantity,
            price,
            image,
            createdBy,
            updatedBy,
        } = req.body;
        try {
            const product = await Products.findOne({
                where: { name: `${name}` },
            });
            if (product == null) {
                const insertProduct = await Products.create({
                    name,
                    description,
                    quantity,
                    price,
                    image: `/uploads/${uniqueName}`,
                    createdBy,
                    updatedBy,
                });
                console.log('added Product');
                res.status(200).json('created product');
            } else {
                res.status(400).json({
                    status: 0,
                    message: 'Product already existed',
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.delete('/:id', productsController.deleteProduct);
//updating the product
router.put(
    '/:id',
    authenticationmiddleware,
    body('name', 'Product name not be empty').trim().notEmpty(),
    body('quantity', 'quantity must be an integer greater than 0').isInt({
        gt: 0,
    }),
    body('price', 'price must be an integer greater than 0').isInt({
        gt: 0,
    }),
    upload.single('image'),
    async (req, res) => {
        console.log(req.body);
        const { name, description, quantity, price, createdBy, updatedBy } =
            req.body;
        try {
            await Products.update(
                {
                    name,
                    description,
                    quantity,
                    price,
                    createdBy,
                    updatedBy,
                },
                {
                    where: { id: req.params.id },
                }
            );
            //if image is changed
            if (!req.body.image) {
                await Products.update(
                    { image: `/uploads/${uniqueName}` },
                    { where: { id: req.params.id } }
                );
            }
            res.status(200).json({ message: 'updated product' });
        } catch (error) {
            res.status(500).json(error);
        }
    }
);

module.exports = router;
