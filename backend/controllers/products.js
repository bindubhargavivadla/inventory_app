const fs = require('fs');
const bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authenticationmiddleware = require('../middlewares/authentication');
const Products = require('../models').Products;
const cron = require('node-cron');

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
exports.createProduct = [
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
        console.log('POST body', req.body);
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
            console.log('Product one', product);
            if (product) {
                res.status(400).json({
                    message: 'Product Already Existed',
                });
            } else {
                await Products.create({
                    name,
                    description,
                    quantity,
                    price,
                    image: `/uploads/${uniqueName}`,
                    createdBy,
                    updatedBy,
                });
                res.status(200).json({
                    message: 'Product added Successfully',
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Error in posting',
                error,
            });
        }
    },
];
//updating the product
exports.updateProduct = [
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
            const findProduct = await Products.findOne({
                where: { id: req.params.id },
            });
            if (findProduct) {
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
            } else {
                res.status(400).json({
                    message: 'Product Not Found',
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
];
exports.getProducts = [
    authenticationmiddleware,
    async (req, res) => {
        try {
            const products = await Products.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({
                message: 'Error while fetching products',
                error,
            });
        }
    },
];
exports.getProductById = [
    authenticationmiddleware,
    async (req, res) => {
        try {
            const products = await Products.findOne({
                where: { id: req.params.id },
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({
                message: 'Error while fetching product',
                error,
            });
        }
    },
];
exports.deleteProduct = [
    authenticationmiddleware,
    async (req, res) => {
        try {
            const deleteProduct = await Products.findOne({
                where: { id: req.params.id },
            });
            await Products.destroy({
                where: { id: req.params.id },
            });
            // fs.unlinkSync(`.${deleteProduct}`);
            res.status(200).json({ message: 'deleted the user' });
        } catch (error) {
            res.status(500).json({
                message: 'Error while deleting products',
                error,
            });
        }
    },
];
// secheduled job every day at 7:00AM
// <seconds> <minute> <hour> <day-of-month> <month> <day-of-week> <command>
cron.schedule('0 0 7 * * *', async () => {
    console.log('corn job is scheduled to increase the quantity by 10');
    try {
        const allProducts = await Products.findAll();
        allProducts.map((val, index) => {
            Products.update(
                { quantity: val.quantity + 10 },
                { where: { id: val.id } }
            );
        });
    } catch (error) {
        console.log(error);
    }
});
