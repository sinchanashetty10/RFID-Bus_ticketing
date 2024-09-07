const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        
        // Assuming your JWT payload contains userId
        req.userId = decoded.userId;
        next(); // Call next middleware
    });
}

module.exports = verifyToken;
