import express from "express";
import jwt from 'jsonwebtoken';
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  signUpToActivity,
  userPostStatus,
  AddNewUserAct,
  userPostStatus2,
} from "../controllers/post.js";

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
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

// Routes
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost); 
router.delete("/:id", verifyToken, deletePost); 
router.put("/:id", verifyToken, updatePost); 
router.get("/signup/status", verifyToken, userPostStatus);
router.post("/signup", verifyToken, signUpToActivity);
router.get("/signup/status2", userPostStatus2);
router.post("/adminsignup", AddNewUserAct);  

export default router;
