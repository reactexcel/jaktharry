import express from "express";
import {
  getUsers,
  DoesUserExist,
  deleteUser,
  updateUserRole,
  getActivities,
  deleteUserActivity,
  getPostSignUps,
  updatePassword,
  getActUsers,
  deletePostSignUps, 
  updateProfilePic,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", getUsers);
router.get("/check", DoesUserExist);
router.delete("/:id", verifyToken, deleteUser);
router.put("/role/:id", verifyToken, updateUserRole);
router.get("/user-activity", getActivities);
router.get("/activityUsers", getActUsers);
router.delete("/delete/:postId/:userId", verifyToken, deleteUserActivity);
router.get("/post-signups", verifyToken, getPostSignUps);
router.put("/update-password", verifyToken, updatePassword);
router.delete("/post-signups/:id", verifyToken, deletePostSignUps);
router.put("/update-profile-pic", verifyToken, upload.single('profilePic'), updateProfilePic);


export default router;
