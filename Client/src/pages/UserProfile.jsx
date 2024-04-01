import React, { useContext, useEffect, useState } from "react";
import UserAvatar from "../components/UserAvatar";
import "../assets/styles/userProfile.scss";
import PostCard from "../components/PostCard";
import instance from "../axios";
import { AuthContext } from "../context/authContext";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);


  const handlePostCardButtonClick = async (postId) => {
    let isError = false;

    try {
      const apiUrl = `/api/users/post-signups/${postId}`;

      await instance.delete(apiUrl);
    } catch (err) {
      isError = true;
      console.error("Error unsubscribing activtiy:", err);
    }

    if (!isError) await fetchData();
  };

  const updateUserProfileImg = (img) => {
    currentUser.img = img;

    localStorage.setItem("user", JSON.stringify(currentUser));
  };

  const fetchData = async (currentUser) => {
    const userId = currentUser.id;
    try {
      if (userId) {
        // Fetch activities associated with the user ID
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/user-activity?userId=${userId}`;
        const res = await axios.get(apiUrl);
        const items = res.data.data;

        if (items.length > 0) {
          // Check if data is not empty
          setPosts(items); // Set the posts state
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    
    fetchData(currentUser);
  });
  
  return (
    <>
        <div className="user-profile-pg ">
          <div className="allChildrenCenter d-flex justify-content-center align-items-center">
            <UserAvatar
              profileImg={currentUser.img}
              onAvatarUpdate={updateUserProfileImg}
            />
          </div>

          <div className="allChildrenCenter my-3 text-center">
            <Link to="/update-password">Uppdatera lösenord</Link>
          </div>

          <div className="user-post-signups">
            <h3 className="text-center">Registreringar för aktiviteter</h3>
            {posts.length > 0 ? (
              <Container>
                <Row xs={1} sm={1}>
                  {posts.map((post, idx) => {
                    return (
                      <Col key={idx}>
                        <PostCard
                          post={post}
                          onButtonClick={handlePostCardButtonClick}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            ) : (
              <h6 className="text-center">Inga prenumerationer hittades!</h6>
            )}
          </div>
        </div>
    
    </>
  );
};

export default UserProfile;