import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Button} from "react-bootstrap";
import bild from "../img/enter.png"
import { AuthContext } from "../context/authContext.js";

const Write = () => {
  
  const state = useLocation().state;
  const { currentUser } = useContext(AuthContext);

  const [title, setTitle] = useState(state?.title || "");
  const [value1, setValue1] = useState(state?.desc || "");
  const [value2, setValue2] = useState(state?.text || "");
  const [imgUrl, setimgUrl] = useState(state?.img || "");
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage
      console.log(token)
const headers = { Authorization: `Bearer ${token}` }; // Create the Authorization header

state
  ? await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${state.id}`, {
      title,
      desc: value1,
      text: value2,
      cat,
      img: imgUrl,
    }, { headers })
  : await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/`, {
      title,
      desc: value1,
      text: value2,
      cat,
      img: imgUrl,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    }, { headers });
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

    // Render the login message if currentUser is null
  if (!currentUser) {
    return (
      <div className='wadd'>
        <img src={bild} alt="Hero Bild" className="imgClass"/>
        <h1>Vänligen .. Logga in för att skriva</h1>
        <Link to="/login" className="link linkclass">login &gt;&gt; </Link>
      </div>
    );
  }

   // Render the write form if currentUser is not null
  return (
    <div className='add'>
      <div className="content">
        <input type="text" value={title} placeholder='Ange titel' onChange={e=>setTitle(e.target.value)}/>
        <hr />
        <div className="editorContainer1">
          <ReactQuill className='editor'  placeholder= "Beskrivning av nyheterna" theme="snow" value={value1} onChange={setValue1} />
        </div>
        <hr />
        <div className="editorContainer2">
          <ReactQuill className='editor' placeholder= "Nyhetsdetaljer" theme="snow" value={value2} onChange={setValue2} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Ange bildlänken</h1>
          <input type="text" value={imgUrl} placeholder='Image URL' onChange={e => setimgUrl(e.target.value)} />
          <hr />
          <div className="item">
            <h1>Category</h1>
            <div className="cat">
              <input type="radio" checked={cat === "riks"} name="cat" value="riks" id="riks" onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="riks">Riks</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "lans"} name="cat" value="lans" id="lans" onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="lans">Läns</label>
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "lokalt"} name="cat" value="lokalt" id="lokalt" onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="lokalt">Lokalt</label>
              
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "aktiviteter"} name="cat" value="aktiviteter" id="aktiviteter" onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="aktiviteter">Aktiviteter</label>
            </div>
          </div>
          <div className="item2">
            <Button onClick={handleClick} >Publicera</Button>
          </div>
        </div>  
      </div>
    </div>
  );
}

export default Write;
