import jwt from "jsonwebtoken";
import { db } from "../db.js";

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

export const isUser = (req, res, next) =>{
    const {userInfo} = req
    const q = "SELECT * FROM users WHERE id = ?"

    db.query(q, [userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
    
        if(data[0].role == 0 && data[0].cat != "aktiviteter") return next()

        console.log(data[0].role);

        return res.status(401).json("not authorized to comment");
    });
}