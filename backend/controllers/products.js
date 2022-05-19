const fs = require('fs');
const bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const authenticationmiddleware = require('../middlewares/authentication');
const Products = require('../models').Products;
const nodeCron = require('node-cron');

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
nodeCron.schedule('0 0 7 * * *', async () => {
    await Products.increment('quantity', { by: 10 });
});
