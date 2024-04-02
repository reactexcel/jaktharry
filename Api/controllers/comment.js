import { db } from "../db.js";

export const addComment = async (req, res) => {
  try {
    const q = "INSERT INTO comments(`comments`,`postId`) VALUES (?)";

    const values = [
      req.body.comment,
      req.body.postId
    ];

    await db.query(q, [values]);

    return res.status(201).json("comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json(error.message);
  }
};

export const getComment = (req, res) => {
  const q = "SELECT * FROM comments WHERE postId = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};
