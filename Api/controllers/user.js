import { db } from "../db.js";
import { bucket } from "../firebase.js"
import util from "util";
import bcrypt from "bcryptjs";
import mime from 'mime-types';

const queryAsync = util.promisify(db.query).bind(db);

export const getUsers = async (req, res) => {
  try {
    const q = "SELECT * FROM users";
    const data = await queryAsync(q);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const DoesUserExist = async (req, res) => {
  try {
      const username = req.query.username; 
      const q = "SELECT id FROM users WHERE username = ?";
      const result = await queryAsync(q, [username]);

      if (result.length > 0) {
          const userId = result[0].id;
          return res.status(200).json({ userExists: true, userId });
      } else {
          return res.status(200).json({ userExists: false });
      }
  } catch (error) {
      return res.status(500).json(error.message);
  }
};

export const deleteUser= async (req, res) => {
  try {
    const userId = req.params.id;

    const q = "DELETE FROM users WHERE `id` = ?";
    const result = await db.query(q, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json("Användaren kunde inte hittas eller har redan tagits bort.");
    }

    return res.json("Användaren är raderad!");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json(error.message);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const newRole = req.body.role;

    const q = "UPDATE users SET `role`=? WHERE `id` = ?";

    const values = [newRole, userId];

    const result = await db.query(q, values);

    if (result.affectedRows === 0) {
      return res.status(403).json("Du kan uppdatera endast ditt inlägg!");
    }

    return res.json("Inlägget har uppdaterats");
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json(error.message);
  }
};

export const getActivities = (req, res) => {
  try {
    const userId = req.query.userId; 
    const q = `SELECT p.* FROM posts p WHERE p.id IN (SELECT uact.aid FROM UserActivity uact WHERE uact.uid = ?)`
    db.query(q, [userId], (error, results) => {
      if (error) {
        return res.status(400).json({ message: "Error fetching post sign ups", error: error.message });
      }
      const processedData = results.map(activity => {
        // Perform any processing or modification here
        return {
          id: activity.id,
          title: activity.title,
          date: activity.date
        };
      });
      // Send the processed data back to the frontend server
      return res.status(200).json({ message: "Sign up list fetch successful", data: processedData });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error fetching post sign ups", error: err.message });
  }
};

export const deleteUserActivity = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const q = "DELETE FROM UserActivity WHERE `uid` = ? AND `aid` = ?";
    const result = await db.query(q, [userId ,postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json("Inlägget kunde inte hittas eller har redan tagits bort.");
    }

    return res.json("Inlägget har raderats!");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json(error.message);
  }
}

export const getActUsers = (req, res) => {
  try {
    const actId = req.query.activity;
    const q = `SELECT u.* FROM users u WHERE u.id IN (SELECT uact.uid FROM UserActivity uact WHERE uact.aid = ?)`
    db.query(q, [actId], (error, results) => {
      if (error) {
        return res.status(400).json({ message: "Error fetching post sign ups", error: error.message });
      }
      const processedData = results.map(user => {
        // Perform any processing or modification here
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role : user.role
        };
      });
      // Send the processed data back to the frontend server
      return res.status(200).json({ message: "Sign up list fetch successful", data: processedData });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error fetching post sign ups", error: err.message });
  }
}

export const getPostSignUps = async (req, res) => {
    const { userInfo } = req;
    
    try {
        const q = `SELECT ps.*, p.* FROM activities_post_signups ps JOIN posts p ON ps.post_id = p.id WHERE ps.uid = ${userInfo.id}`;
        const data = await queryAsync(q);

        return res
            .status(200)
            .json({ message: "Sign up list fetch successful", data });
    } catch (err) {
        return res
            .status(400)
            .json({ message: "Error fetching post sign ups", err });
    }
};

export const updatePassword = async (req, res) => {
  const { userInfo } = req;

  const findUserQuery = "SELECT * FROM users WHERE id = ?";

  db.query(findUserQuery, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
  })

  try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      // compare new and confirm password
      if (!oldPassword || !newPassword || !confirmPassword) {
          return res.status(400).json({ error: "field is required" });
      }

      // compare new and confirm password
      if (newPassword !== confirmPassword) {
          return res
              .status(400)
              .json({ error: "new and confirms paasswords do not match" });
      }

      const q = "SELECT * FROM users WHERE id = ?";

      db.query(q, [userInfo.id], (err, data) => {
          const user = data[0];
          if (err) return res.status(500).json(err);

          // Check password
          const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

          if (!isPasswordCorrect) {
              return res.status(400).json("Password is incorrect");
          }

          // Hash the user's new password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(newPassword, salt);

          const q = "UPDATE `users` SET `password` = ? WHERE id = ?";
          const values = [hash, userInfo.id];
          db.query(q, values, (err, data) => {
              if (err) return res.status(500).json(err);

              res.status(200).json({ message: "Password reset successful" });
          });
      });
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }

};

export const deletePostSignUps = async (req, res) => {
  const { userInfo } = req;
  const activityId = req.params.id;

  try {
      const q = `DELETE FROM UserActivity WHERE uid = ${userInfo.id} AND aid = ${activityId}`;
      const result = await queryAsync(q);

      if (result.affectedRows === 0) {
          return res.status(404).json("Aktivitetsprenumerationen kunde inte hittas eller har redan tagits bort.");
      }

      return res.json("Aktiviteten har avslutats!");
  } catch (error) {
      console.error("Error deleting user activity:", error);
      return res.status(500).json(error.message);
  }
};

export const updateProfilePic = async (req, res) => {
  const { userInfo } = req;
  const file = req.file;

  try {
      const blob = bucket.file(`${Date.now()}.${mime.extension(file.mimetype)}`);

      await blob.save(file.buffer);
      await blob.makePublic();

      const publicUrl = blob.publicUrl();

      const q = `UPDATE users SET img="${publicUrl}" WHERE id = ${userInfo.id}`;
      const result = await queryAsync(q);

      if (result.affectedRows === 0) {
          return res.status(403).json("Unable to update profile pic");
      }

      return res.json({ data: publicUrl });
  } catch (error) {
      console.error("Error updating profile pic:", error);
      return res.status(500).json(error.message);
  }


};

