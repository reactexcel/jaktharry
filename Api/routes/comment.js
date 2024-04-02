import express from "express";
import { addComment, getComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/add", addComment);
router.get("/get/:id", getComment);

export default router;