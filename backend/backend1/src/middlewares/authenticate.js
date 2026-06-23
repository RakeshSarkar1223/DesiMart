const {verifyToken} = require("../utils/jwt.utils");

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error in authenticate middleware:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticate;