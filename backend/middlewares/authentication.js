const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('token').split(' ');
    if (token[1] === undefined) {
        res.status(400).json({ message: 'Token not sent' });
    }
    try {
        jwt.verify(token[1], 'secret_string');
        console.log('came in try');
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid JWT Token', error });
    }
};
