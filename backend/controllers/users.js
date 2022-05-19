const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const Users = require('../models').Users;

//Get all users
exports.getUser = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error while fetching products',
            error,
        });
    }
};
//adding product by validating using express validators
exports.createUser = [
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be between 5 and 10 characters')
        .trim()
        .isLength({
            min: 5,
            max: 10,
        }),
    async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        try {
            const usersData = await Users.findOne({
                where: { email: `${email}` },
            });
            if (usersData == null) {
                let encryptedPassword;
                encryptedPassword = bcrypt.hashSync(password, salt);
                const insertData = await Users.create({
                    firstName,
                    lastName,
                    email,
                    password: encryptedPassword,
                });
                res.status(200).json('created user');
            } else {
                res.status(400).json({
                    message: `email ${req.body.email} is already existed.`,
                });
            }
        } catch (error) {
            res.status(400).json({
                message: 'error while fetching details',
                error,
            });
        }
    },
];
//Get user by Id
exports.getUserById = async (req, res) => {
    try {
        let user = await Users.findOne({ where: { id: `${req.params.id}` } });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error in finding', error });
    }
};
//deleting the users
exports.deleteUsers = async (req, res) => {
    try {
        await Users.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            message: `user with ${req.params.id} is deleted`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in deleting user', error });
    }
};
exports.updateUser = [
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be between 5 and 10 characters')
        .trim()
        .isLength({
            min: 5,
            max: 10,
        }),
    async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        try {
            let encryptedPassword;
            try {
                encryptedPassword = bcrypt.hashSync(password, salt);
            } catch (error) {
                console.log('Error in bcrypt');
            }
            const Data = await Users.update(
                {
                    firstName,
                    lastName,
                    email,
                    password: encryptedPassword,
                },
                { where: { id: req.params.id } }
            );
            res.status(200).json({
                message: `User with username ${req.params.id} is updated`,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error while updating user',
                error,
            });
        }
    },
];
//token generation
exports.login = async (req, res) => {
    console.log('hello', req.body);
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({
            where: { email: `${email}` },
        });
        console.log(user);
        if (user == null) {
            res.status(400).json({
                message: `username ${email} not found`,
            });
        } else {
            console.log(user);
            const passCorrect = bcrypt.compareSync(password, user.password);
            if (!passCorrect) {
                res.status(401).json({
                    message: 'User Credentials Wrong',
                });
            }
            const payLoad = {
                user: {
                    email: email,
                    password: password,
                },
            };
            jwt.sign(
                payLoad,
                'secret_string',
                {
                    expiresIn: '1h',
                },
                (err, token) => {
                    if (err) {
                        throw (
                            (err,
                            res.status(400).json({
                                message: 'Temorary error in backend',
                            }))
                        );
                    }
                    res.status(200).json({ jwt: token, user });
                }
            );
        }
    } catch (error) {
        res.status(500).json({
            message: 'error while fetching details',
            error,
        });
    }
};
