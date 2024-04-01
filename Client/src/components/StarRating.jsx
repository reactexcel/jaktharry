import React, { useEffect, useState } from "react";
import StarOutline from "../assets/img/star-outline.svg";
import StarIcon from "../assets/img/star.svg";
import HalfStarIcon from "../assets/img/star-half.svg";
import axios from "axios";

const defArr = Array(5)
  .fill(0)
  .map((e) => StarOutline);

const StarRating = ({ disabled, userId, post, initUserHasRated }) => {
  const [postRatingArr, setPostRatingArr] = useState(defArr);
  const [disableRating, setDisableRating] = useState(disabled);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);

  const handleRating = (idx) => {
    if (disableRating) return;

    const newStars = postRatingArr.slice(0, idx + 1).map((s) => StarIcon);
    setPostRatingArr([
      ...newStars,
      ...Array(5 - newStars.length)
        .fill(0)
        .map((e) => StarOutline),
    ]);

    submitRating(newStars.length);
  };

  const submitRating = async (rating) => {
    try {
      const data = {
        postId: post.id,
        rating,
      };

      setIsLoading(true);

      await axios.put(`${process.env.REACT_APP_API_URL}/posts/rate`, data);

      setMessage("rating submitted successfully");
      setIsLoading(false);

      setIsLoading(rating);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setMessage(err.response.data || "Error submitting rating");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDisableRating(disabled || isLoading || userHasRated);

    if (post.avg_rating) {
      const avgRating = Math.floor(post.avg_rating);

      const newStars = Array(avgRating)
        .fill(0)
        .map((e) => StarIcon);

      if (post.avg_rating < 5 && post.avg_rating % 2 !== 0) {
        newStars.push(HalfStarIcon);
      }

      const fullStarlen = newStars.length;

      const allStars = [
        ...newStars,
        ...Array(5 - fullStarlen)
          .fill(0)
          .map((e) => StarOutline),
      ];

      setPostRatingArr(allStars);
    }
  }, [disabled, isLoading, post, userHasRated]);

  useEffect(() => {
    if (post?.id && userId && initUserHasRated) {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/posts/rate/${post.id}/${userId}`
          );

          const { status } = res.data;

          setUserHasRated(status);
        } catch (err) {
          setMessage("Error processing rating");
        }
      };
      fetchData();
    }
  }, [post.id, userId, initUserHasRated]);

  return (
    <div className="star-rating">
      {postRatingArr.map((star, idx) => {
        return (
          <img
            key={idx}
            src={star}
            style={{ cursor: disableRating && "auto" }}
            alt="star rating"
            onClick={() => handleRating(idx)}
            className="rating-icon"
          />
        );
      })}
      {message && <p className="rating-message">{message}</p>}
    </div>
  );
};

export default StarRating;
