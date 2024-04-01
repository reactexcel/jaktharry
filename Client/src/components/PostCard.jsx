import React, { useState } from "react";
import { Button } from "react-bootstrap";

const PostCard = ({ post = {}, onButtonClick }) => {
  const [loading, setLoading] = useState(false);

  const removeActivitySubscriptionHandler = async (postId) => {
    setLoading(true);

    await onButtonClick(postId);

    setLoading(false);
  };

  return (
    <div className="post-card">
      {post.img && (
        <div
          className="post-image"
          style={{ backgroundImage: `url(${post.img})` }}
        ></div>
      )}
      <div className="post-content">{post.text}</div>
      {/* <div className="post-content">{post.title}</div> */}
      <div>
        <Button size="sm" href={`/post/${post.id}`}>
          Läs mer
        </Button>

        <Button
          disabled={loading}
          size="sm"
          className="float-end btn-danger"
          onClick={() => removeActivitySubscriptionHandler(post.id)}
        >
          Säga upp
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
