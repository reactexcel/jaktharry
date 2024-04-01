import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        console.log("No token found in cookies.");
        return res.status(401).json("Ej autentiserad!");
    }

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token är ogiltig!");
        req.userInfo = userInfo; // Attach user information to the request object
        next();
    });
};