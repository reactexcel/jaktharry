import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext.js";
import { Button, Container, Card , Toast} from "react-bootstrap";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [addPostRes , setAddPostRes] = useState("")
  const [getPostRes , setgetPostRes] = useState([])
  const [showToast, setShowToast] = useState(false); 
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


  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        // making request too get the comment data of news post
        const response = await axios.get(
        `http://116.202.210.102:6969/api/comments/get/${postId}`
        );
        setgetPostRes(response.data)
       console.log(response)
      } catch (error) {
        console.log(error);
      }
    };

    fetchCommentData();
  }, [postId, addPostRes]);


  const handleUserComment = async (postId, e) => {
    e.preventDefault();
    try {
      const newComment = e.target.elements.newscomment.value;
      setComment(newComment);
      const values = {
        postId : postId, 
        comment: newComment
      }
       // making request too post the comment on news post 
      const response = await axios.post(
        "http://116.202.210.102:6969/api/comments/add",
        values
      );
      setAddPostRes(response)
      setShowToast(true);
       e.target.elements.newscomment.value = "";
    } catch (error) {
      console.log("Error in Adding Comments", error);
    }
    setComment("");
  };

  const handleUserSignUp = async (postId, e) => {
    e.preventDefault();

    if (!currentUser) {
      const shouldLogin = window.confirm("Login to sign the activity");
      if (shouldLogin) {
        navigate("/login");
      }
    } else {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };
        setIsLoading(true);

        const exist = await userPostExist(postId);
        console.log(exist);

        if (!exist) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/posts/signup`,
            { postId },
            { headers }
          );
          window.alert("Perfect ... Du är registrerad för denna aktivitet");
          navigate("/");
        } else {
          console.error("User already signed up for this post");
          window.alert("Du är redan registrerad för denna aktivitet");
        }
      } catch (error) {
        console.error("Error signing up for activity:", error);
      } finally {
        setIsLoading(false); // Reset loading state regardless of the outcome
      }
    }
  };

  const userPostExist = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Make a request to your backend to check user post status
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/signup/status?postId=${postId}`,
        { headers }
      );
      console.log(response);

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
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      // Retrieve the token from local storage
      const token = localStorage.getItem("accessToken");
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
                  <Link
                    to={`/write?edit=2`}
                    state={post}
                    onClick={handleWriteClick}>
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
            </div>
          )}
          <h1>{post.title}</h1>
          <p
            className="descP"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.desc),
            }}></p>
          {/* Render each paragraph separately */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(paragraph.replace(/\n/g, "<br />")),
              }}
            />
          ))}
          <div style={{ marginTop: "20px" }}>
            <h5> Posta en kommentar</h5>
            <form onSubmit={(e) => handleUserComment(postId, e)}>
              <div className="comment-section">
                <textarea
                  name="newscomment"
                  id="newscomment"
                  cols="26"
                  placeholder="Gå med i diskussionen..."></textarea>
                
                <div>
                  <Button type="submit" variant="primary">
                    Add a Comment
                  </Button>
                </div>
               <Card style={{ width: "100%", border: "0px"}}>
               <Card.Body> 
              {getPostRes.length === 0 ? (
               <div>
              <Card.Title>No Comments on this Post</Card.Title>
               </div>
             ) : (  
             <>
        <Card.Title>Comments on this Post</Card.Title>
        {getPostRes.map((comment, index) => (
          <div className="comment-box" key={index}>
          <hr />
            <Card.Text>*{comment.comments}</Card.Text>
          </div>
        ))}
      </>
    )}
  </Card.Body>
</Card>
       </div>
            </form>
          </div>
        </div>

        {post.cat === "aktiviteter" && (
          <div className="text-center">
            <Button
              onClick={(e) => handleUserSignUp(post.id, e)}
              className="BtnClass"
              disabled={isLoading}>
              {isLoading ? "Vänta..." : "Delta i aktiviteten"}
            </Button>
          </div>
        )}
      </div>
      <Menu cat={post.cat} />
       <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
         bottom: "20px", 
        left: "20px",
         zIndex: 9999, 
         backgroundColor: "#0B5ED7",
         color: "white"
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Your comment has been successfully submitted!</Toast.Body>
      </Toast>
    </Container>
  );
};

export default Single;
