import express from "express";
import { addComment, getComment } from "../controllers/comment.js";
import{verifyToken, isUser} from "../middleware/auth.js"

const router = express.Router();

router.post("/add", verifyToken, isUser, addComment);
router.get("/get/:id", getComment);

export default router;