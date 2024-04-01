import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import edit from "../img/edit.png";
import plus from "../img/plus.png";
// import group from "../img/group.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";

export const TabContent7 = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleClick = (postId) => {
    // Construct the URL for the single post page with the clicked post ID
    const postUrl = `${window.location.origin}/post/${postId}`;

    // Open the URL in a new tab
    window.open(postUrl, "_blank");
  };

  const handleWriteClick = (post) => {
    // Pass the 'post' object as an argument
    navigate("/write", { state: { currentUser, ...post } });
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

      // Create headers with the Authorization header
      const headers = { Authorization: `Bearer ${token}` };

      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts/${post.id}`;
      await axios.delete(apiUrl, { headers });

      // Update the UI after successful deletion
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="PostClass">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th width="20%">Datum</th>
              <th width="40%">Titel</th>
              <th>Kategori</th>
              <th width="10%">Redigera</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td width="20%">{moment(post.date).format("LL")}</td>
                <td width="40%">
                  <Link
                    className="titleClass"
                    onClick={() => handleClick(post.id)}
                  >
                    {post.title}
                  </Link>
                </td>
                <td>{post.cat}</td>
                <td width="10%">
                  {/* Pass 'post' as an argument */}
                  <Link
                    to={`/write?edit=2`}
                    state={post}
                    onClick={() => handleWriteClick(post)}
                  >
                    <img src={edit} alt="" className="iconClass1" />
                  </Link>
                </td>
                <td width="10%">
                  <Link to="" onClick={() => handleDelete(post)}>
                    <img src={del} alt="" className="iconClass2" />
                  </Link>
                </td>
                {/* Add your edit and delete buttons here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TabContent8 = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [userId, reloadData]);

  const handleClick = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    window.open(postUrl, "_blank");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Fetch user ID based on the entered username
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/check?username=${username}`;
      const res = await axios.get(apiUrl);
      const userData = res.data;
      if (userData.userExists) {
        // If user found, set the user ID
        setUserId(userData.userId);
      } else {
        // If user not found, handle appropriately (e.g., show error message)
        console.log("Användaren hittades inte");
        window.confirm("Användaren hittades inte .. Verifiera användarnamnet");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async (post) => {
    try {
      const postId = post.id;
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm(
        "Är du säker på att du vill radera denna aktivitet?"
      );
      if (!confirmDelete) return;

      const token = localStorage.getItem("accessToken");

      const headers = { Authorization: `Bearer ${token}` };

      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/delete/${postId}/${userId}`;
      await axios.delete(apiUrl, { headers });
      setReloadData((prev) => !prev);
      // Update the UI after successful deletion
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAdd = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option.title);
    const postId = option;

    setShowOptions(false);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts/signup/status2?postId=${postId}&userId=${userId}`
    );
    const exist = response.data.exists;

    if (!exist) {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/adminsignup`,
        { postId: postId, userId: userId }
      );
      setReloadData((prev) => !prev);
      window.alert("Perfect ... Du är registrerad för denna aktivitet");
    } else {
      console.error("User already signed up for this post");
      window.alert("Du är redan registrerad för denna aktivitet");
    }
  };

  useEffect(() => {
    const fetchOptionsFromDatabase = async () => {
      try {
        // Fetch options from the database
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        const optionsData = res.data;
        setOptions(optionsData); // Set the options state
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptionsFromDatabase();
  }, []);

  return (
    <div className="PostClass PostClass8">
      <label className="form-label labelClass" htmlFor="form1">
        Ange användarnamnet
      </label>
      <input
        className="inputClass"
        type="search"
        value={username}
        onChange={handleUsernameChange}
        onKeyDown={handleKeyDown}
      />
      <button className="btnClass" onClick={handleSearch}>
        Sök
      </button>

      <h4>Användare är registrerad i dessa aktiviteter</h4>

      {userId && (
        <div className="btnDiv">
          <button className="btnClass2" onClick={handleAdd}>
            <img src={plus} alt="" className="iconClass1" />
            <span>Lägg till aktivitet</span>
          </button>
          {showOptions && (
            <div>
              <ul className="ulclass">
                {options.map((option, index) => (
                  <li
                    className="liOptions"
                    key={index}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <Link>{option.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedOption && <p>Selected option: {selectedOption}</p>}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">#</th>
              <th width="20%">Datum</th>
              <th width="40%">Titel</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td width="10%">{index + 1}</td>
                <td width="20%">{moment(post.date).format("LL")}</td>
                <td width="40%">
                  <Link
                    className="titleClass"
                    onClick={() => handleClick(post.id)}
                  >
                    {post.title}
                  </Link>
                </td>
                <td width="10%">
                  <Link to="" onClick={() => handleDelete(post)}>
                    <img src={del} alt="delete" className="iconClass2" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TabContent9 = () => {
  const [posts, setPosts] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [activitySearched, setActivitySearched] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching activities. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const fetchUsersForActivity = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/activityUsers?activity=${selectedActivity}`;
      const res = await axios.get(apiUrl);
      
      setUsers(res.data.data);
      setActivitySearched(true);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again later.");
    }
  };

  const handleOptionSelect = (e) => {
    setSelectedActivity(e.target.value);
  };

  const handleDelete = async (userId) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm(
        "Är du säker på att du vill avregistrera användaren från denna aktivitet?"
      );
      if (!confirmDelete) return;

      // Retrieve the token from local storage
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const postId = selectedActivity;
      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/delete/${postId}/${userId}`;
      await axios.delete(apiUrl, { headers });
      fetchUsersForActivity();
    } catch (error) {
      console.error("Error deleting user from activity:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const postId = selectedActivity;

      const userId = await checkUserExist(); // Wait for checkUserExist to complete

      // Proceed only if userId is not null (i.e., user exists)
      if (userId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/signup/status2?postId=${postId}&userId=${userId}`
        );
        const exist = response.data.exists;

        if (!exist) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/posts/adminsignup`,
            { postId: postId, userId: userId }
          );
          fetchUsersForActivity();
          window.alert("Perfect ... Du är registrerad för denna aktivitet");
        } else {
          console.error("User already signed up for this post");
          window.alert("Du är redan registrerad för denna aktivitet");
        }
      } else {
        // Handle case where userId is null (user does not exist)
        console.log("User does not exist");
        window.alert(
          "Användaren hittades inte. Vänligen verifiera användarnamnet."
        );
      }

      // Reset newUserName after adding
      setNewUserName("");
    } catch (error) {
      console.error("Error adding user to activity:", error);
    }
  };

  const checkUserExist = async () => {
    // Added async keyword
    try {
      // Fetch user ID based on the entered username
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/check?username=${newUserName}`;
      const res = await axios.get(apiUrl); // Wait for axios call to finish
      const userData = res.data;
      if (userData.userExists) {
        return userData.userId;
      } else {
        console.log("Användaren hittades inte");
        window.confirm("Användaren hittades inte .. Verifiera användarnamnet");
        return null;
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      throw error;
    }
  };

  return (
    <div className="PostClass PostClass9">
      <h3 className="labelClass" htmlFor="form1">
        Välj aktivitetens namn
      </h3>
      <select className="inputClass" onChange={handleOptionSelect}>
        <option>Välj en aktivitet</option>
        {posts.map((activity, index) => (
          <option key={index} value={activity.id}>
            {activity.title}
          </option>
        ))}
      </select>
      <button className="btnClass" onClick={fetchUsersForActivity}>
        Sök
      </button>
      <div>
        {error && <p>Error: {error}</p>}{" "}
        {/* Display error message if error is not null */}
        <h4>Användare registrerade för vald aktivitet:</h4>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th width="10%">#</th>
                <th width="30%">Användarnamn</th>
                <th width="40%">e-post</th>
                <th width="10%">Ta bort</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td width="10%">{index + 1}</td>
                  <td width="30%">{user.username}</td>
                  <td width="40%">{user.email}</td>
                  <td width="10%">
                    <Link to="" onClick={() => handleDelete(user.id)}>
                      <img src={del} alt="delete" className="iconClass2" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activitySearched && (
          <div className="btnDiv">
            <label className="form-label" htmlFor="form1">
              registrera en ny användare
            </label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Användarnamn"
            />
            <button className="btnClass2" onClick={handleAdd}>
              <img src={plus} alt="" className="iconClass1" />
              <span>Lägg till</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TabContent11 = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users`;
        const res = await axios.get(apiUrl);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Send a PUT request to update the user's role
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/role/${userId}`;
      await axios.put(apiUrl, { role: newRole }, { headers });

      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, role: newRole };
          }
          return user;
        });
      });
    } catch (error) {
      console.error("Error changing user role:", error);
    }
  };

  const handleDelete = async (user) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/${user.id}`;
      await axios.delete(apiUrl, { headers });

      // Update the UI after successful deletion
      setUsers(users.filter((p) => p.id !== user.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="PostClass">
      <h6>
        "Notera att: .. användarroll = 1 (admin).. & .. roll = 2 (Moderatorer)"
      </h6>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">#</th>
              <th width="20%">Användarnamn</th>
              <th width="30%">e-post</th>
              <th width="10%">roll</th>
              <th width="10%">Byta roll</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr width="10%" key={user.id}>
                <td>{index + 1}</td>
                <td width="20%">{user.username}</td>
                <td width="30%">{user.email} </td>
                <td width="10%">{user.role}</td>
                <td width="10%">
                  <select
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </td>
                <td width="10%">
                  <Link to="" onClick={() => handleDelete(user)}>
                    <img src={del} alt="" className="iconClass2" />
                  </Link>
                </td>
                {/* Add your edit and delete buttons here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TabContent12 = () => {
  const [users, setUsers] = useState([]);
  const [userPosts, setUserPosts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users`;
        
        const res = await axios.get(apiUrl);
        const filteredUsers = res.data.filter((user) => user.role === 2);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?uid=${userId}`;
      const res = await axios.get(apiUrl);
      setUserPosts({ ...userPosts, [userId]: res.data });
    } catch (err) {
      console.error("Error fetching user items:", err);
      return [];
    }
  };

  const handleClick = (postId) => {
    // Construct the URL for the single post page with the clicked post ID
    const postUrl = `${window.location.origin}/post/${postId}`;
    // Open the URL in a new tab
    window.open(postUrl, '_blank');
  };

  return (
    <div className="PostClass PostClass12">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">#</th>
              <th width="20%" >Användarnamn</th>
              <th width="45%">Hans inlägg</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td width="10%">{index + 1}</td>
                <td className="userClass" width="20%">{user.username}</td>
                <td width="45%">
                  <button onClick={() => fetchUserPosts(user.id)}>Posts</button>
                  {userPosts[user.id] && userPosts[user.id].length > 0 && (
                    <ul className="list-group">
                      {userPosts[user.id].map((post, idx) => (
                        <li className="list-group-item userClass" key={idx}>
                          <Link className="titleClass" onClick={() => handleClick(post.id)}>{post.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {userPosts[user.id] && userPosts[user.id].length === 0 && (
                    <ul className="list-group">
                      <li className="list-group-item">Ingenting publicerades</li>
                    </ul>
                  )}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
