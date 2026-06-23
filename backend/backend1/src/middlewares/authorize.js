const jwt = require("jsonwebtoken");

const authorize = (...roles) => {
    return (req, res, next) => {
        const hasRole = req.user.role.some(role => roles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};

module.exports = authorize;
