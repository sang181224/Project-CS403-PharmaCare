const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_very_secret_key_for_pharmacare';

exports.checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

exports.checkRole = (allowedRoles) => (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.vaiTro)) {
        next();
    } else {
        res.status(403).json({ error: 'Không có quyền truy cập.' });
    }
};