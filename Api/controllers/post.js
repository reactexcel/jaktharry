import { db } from "../db.js";

export const getPosts = (req, res) => {
  let q;
  let queryParams;

  if (req.query.cat) {
    q = "SELECT * FROM posts WHERE cat=?";
    queryParams = [req.query.cat];
  } else if (req.query.uid) {
    q = "SELECT * FROM posts WHERE uid=?";
    queryParams = [req.query.uid];
  } else {
    q = "SELECT * FROM posts";
    queryParams = [];
  }

  db.query(q, queryParams, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "Select p.id, `username`, `title`,`text`, `desc`, p.img, u.img AS userImage, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = async (req, res) => {
  try {
    const q = "INSERT INTO posts(`title`, `desc`, `text`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
      req.body.date,
      req.userInfo.id, // Access user information from req.userInfo
    ];

    await db.query(q, [values]);

    return res.status(201).json("Inlägget har uppdaterats");
  } catch (error) {
    console.error("Error adding post:", error);
    return res.status(500).json(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const q = "DELETE FROM posts WHERE `id` = ?";
    const result = await db.query(q, [postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json("Inlägget kunde inte hittas eller har redan tagits bort.");
    }

    return res.json("Inlägget har raderats!");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json(error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userInfo = req.userInfo; // Access user information from req.userInfo

    const q = "UPDATE posts SET `title`=?, `desc`=?,`text`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
    ];

    console.log("Update Post Values:", values);

    const result = await db.query(q, [...values, postId, userInfo.id]);

    if (result.affectedRows === 0) {
      return res.status(403).json("Du kan uppdatera endast ditt inlägg!");
    }

    return res.json("Inlägget har uppdaterats");
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json(error.message);
  }
};

export const userPostStatus = async (req, res) => {
  try {
    
    const postId = req.query.postId; // Use req.query.postId for query parameters
    const userId = req.userInfo.id;

    // Execute a SQL query to check if the user has signed up for the post
    const query = 'SELECT * FROM UserActivity WHERE uid = ? AND aid = ?';
    db.query(query, [userId, postId], (err, rows) => {
      if (err) {
        console.error("Error checking user post status:", err);
        return res.status(500).json({ err: "Internal Server Error" });
      }

      // If rows are returned, it means the user has already signed up for the post
      const exists = rows.length > 0;

      // Send the response directly
      res.status(200).json({ exists });
    });
  } catch (err) {
    console.error("Error checking user post status:", err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

export const signUpToActivity = async (req, res) => {
  try {
      const q = "INSERT INTO UserActivity (`aid`, `uid`) VALUES (?, ?)";
      const values = [req.body.postId, req.userInfo.id];

      await db.query(q, values);
      
      return res.status(201).json("Aktiviteten har lagts till för användaren");
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error
      console.error("Duplicate entry error:", error);
      return res.status(409).json("User already signed up for this activity");
    } else {
      // Handle other errors
      console.error("Error adding post:", error);
      return res.status(500).json(error.message);
    }
  }
};

export const userPostStatus2 = async (req, res) => {
  try {
    const postId = req.query.postId;
    const userId = req.query.userId;

    const query = 'SELECT * FROM UserActivity WHERE uid = ? AND aid = ?';
    const rows = await new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, rows) => {
        if (err) {
          console.error("Error checking user post status:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    // If rows are returned, it means the user has already signed up for the post
    const exists = rows.length > 0;

    // Send the response directly
    res.status(200).json({ exists });
  } catch (err) {
    console.error("Error checking user post status:", err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

export const AddNewUserAct = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;

    const q = "INSERT INTO UserActivity (aid, uid) VALUES (?, ?)";
    const values = [postId, userId];
    await db.query(q, values);

    return res.status(201).json("Aktiviteten har lagts till för användaren");

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error("Duplicate entry error:", error);
      return res.status(409).json("User already signed up for this activity");
    } else {
      console.error("Error adding post:", error);
      return res.status(500).json(error.message);
    }
  }
};
