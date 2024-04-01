import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext.js";
import { Button, Container } from "react-bootstrap";
import DOMPurify from 'dompurify'; 

const Single = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  axios.defaults.withCredentials = true;
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.log(error);
      } 
    };

    fetchData();
  }, [postId]);

  const handleUserSignUp = async (postId, e) => {
    
    e.preventDefault();

    if (!currentUser) {
      const shouldLogin = window.confirm("Login to sign the activity");
      if (shouldLogin) {
        navigate("/login");
      }
    } else {
      try {
        const token = localStorage.getItem('accessToken'); 
        const headers = { Authorization: `Bearer ${token}` }; 
        setIsLoading(true);

        const exist = await userPostExist(postId);
         console.log(exist);
         
         if (!exist) {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/signup`, { postId }, { headers });
          ;
          window.alert("Perfect ... Du är registrerad för denna aktivitet");
          navigate("/");
        } else {
          console.error("User already signed up for this post");
          window.alert("Du är redan registrerad för denna aktivitet");
        }
      } catch (error) {
        console.error("Error signing up for activity:", error);
      }finally {
        setIsLoading(false); // Reset loading state regardless of the outcome
      }
    }
  };

  const userPostExist = async (postId) => {
    
    try {
      const token = localStorage.getItem('accessToken'); 
      const headers = { Authorization: `Bearer ${token}` }; 
    
      // Make a request to your backend to check user post status
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/signup/status?postId=${postId}`, { headers });
      console.log(response)
      
      // Response should contain a boolean indicating if the user has already signed up
      return response.data.exists;
    } catch (error) {
      console.error("Error checking if user post exists:", error);
      return false; // Assuming it doesn't exist if there's an error
    }
  };

  const handleDelete = async (post) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;
  
      // Retrieve the token from local storage
      const token = localStorage.getItem('accessToken');
      console.log(token);
  
      // Create headers with the Authorization header
      const headers = { Authorization: `Bearer ${token}` };
      
      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts/${post.id}`;
      await axios.delete(apiUrl, { headers });

      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleWriteClick = () => {
    navigate("/write", { state: { currentUser, ...post } });
  };

  const splitTextAfterThirdDot = (text) => {
    const sentences = text.split(".");

    // Split the array into groups of three sentences
    const groupedSentences = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const group = sentences.slice(i, i + 4).join(".");
      groupedSentences.push(group);
    }

    return groupedSentences;
  };

  const paragraphs = post.text ? splitTextAfterThirdDot(post.text) : [];

  return (
    <Container className="single">
      <div className="content">
        <div>
          <div className="img">
            <img src={post.img} alt="" />
          </div>
          {currentUser && (
          <div className="user">
            {post.userImage && <img src={post.userImage} alt="" />}
            <div className="info">
              <span>{post.username}</span>
              <p>Posted {moment(post.date).fromNow()}</p>
            </div>
            {currentUser.username === post.username && (
              <div className="edit">
                <Link to={`/write?edit=2`} state={post} onClick={handleWriteClick}>
                  <img
                    src="https://logowik.com/content/uploads/images/888_edit.jpg"
                    alt=""
                  />
                </Link>
                <img
                  onClick={() => handleDelete(post)}
                  src="https://cdn.iconscout.com/icon/free/png-256/free-delete-2902143-2411575.png"
                  alt=""
                />
              </div>
            )}
          </div>)}
          <h1>{post.title}</h1>
          <p className="descP" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }}></p>
          {/* Render each paragraph separately */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(paragraph.replace(/\n/g, "<br />")),
              }}
            />
          ))}
        </div>
        
        {post.cat === "aktiviteter" && (
          <div className="text-center">
            <Button onClick={(e) => handleUserSignUp(post.id, e)} className="BtnClass" disabled={isLoading}>
            {isLoading ? 'Vänta...' : 'Delta i aktiviteten'}
          </Button>
          </div>
        )}

      </div>
      <Menu cat={post.cat} />
    </Container>
  );
}

export default Single;
