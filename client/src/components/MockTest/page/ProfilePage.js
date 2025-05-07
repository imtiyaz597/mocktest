// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useLocation as useRouterLocation, Link } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const REACT_APP_API_URL = "https://full-stack-mocktest.onrender.com";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [phone, setPhone] = useState("");
//   const [dob, setDob] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [social, setSocial] = useState({
//     facebook: "",
//     youtube: "",
//     linkedin: "",
//     telegram: "",
//     whatsapp: "",
//   });
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [previewPhoto, setPreviewPhoto] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const navigate = useNavigate();
//   const routerLocation = useRouterLocation();
//   const isExamPage = routerLocation.pathname.includes("/exam");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${REACT_APP_API_URL}/api/auth/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = res.data;
//         setUser(data);
//         setPhone(data.phone || "");
//         setDob(data.dob || "");
//         setLocation(data.location || "");
//         setDescription(data.description || "");
//         setSocial(data.social || {});
//         setPreviewPhoto(data.profilePhoto || "");
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleSaveProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("phone", phone);
//       formData.append("dob", dob);
//       formData.append("location", location);
//       formData.append("description", description);
//       formData.append("social", JSON.stringify(social));
//       if (profilePhoto) formData.append("profilePhoto", profilePhoto);

//       const res = await axios.put(`${REACT_APP_API_URL}/api/auth/update-profile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setUser(res.data);
//       alert("Profile updated successfully.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile.");
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePhoto(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewPhoto(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   if (!user) return <div>Loading...</div>;

//   const inputStyle = {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "15px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//   };

//   const labelStyle = {
//     fontWeight: "bold",
//     marginBottom: "5px",
//     display: "block",
//   };

//   return (
//     <div className="d-flex">
//       {!isExamPage && (
//         <>
//           {/* Sidebar */}
//           <div
//             className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//             style={{
//               width: isCollapsed ? "60px" : "250px",
//               height: "100vh",
//               transition: "width 0.3s ease",
//               zIndex: 1050,
//               overflow: "hidden",
//             }}
//           >
//             <div>
//               {!isCollapsed && <h4 className="mb-4">Admin Panel</h4>}
//               <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
//                 <li className="mb-3 d-flex align-items-center">
//                   <Link to="/admin-dashboard" style={linkStyle}>
//                     <FaTachometerAlt className="me-2" />
//                     {!isCollapsed && "Dashboard"}
//                   </Link>
//                 </li>
//                 <li className="mb-3 d-flex align-items-center">
//                   <Link to="/mock-tests" style={linkStyle}>
//                     <FaFileAlt className="me-2" />
//                     {!isCollapsed && "Mock Tests"}
//                   </Link>
//                 </li>
//                 <li className="mb-3 d-flex align-items-center">
//                   <Link to="/profile" style={linkStyle}>
//                     <FaUser className="me-2" />
//                     {!isCollapsed && "Profile"}
//                   </Link>
//                 </li>
//                 <li className="mb-3 d-flex align-items-center">
//                   <Link to="/accounts" style={linkStyle}>
//                     <FaWallet className="me-2" />
//                     {!isCollapsed && "Accounts"}
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Logout Button */}
//             <div
//               className="sidebar-link d-flex align-items-center mb-2"
//               onClick={handleLogout}
//               style={{ cursor: "pointer", padding: "10px 15px", color: "#343a40", fontWeight: "600" }}
//             >
//               <FaSignOutAlt className="me-2" />
//               {!isCollapsed && "Logout"}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Sidebar Toggle */}
//       <div
//         style={{
//           position: "fixed",
//           top: "20px",
//           left: isCollapsed ? "60px" : "250px",
//           zIndex: 1060,
//           cursor: "pointer",
//           transition: "left 0.3s ease",
//         }}
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <span style={{ fontSize: "20px", color: "#000" }}>
//           {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//         </span>
//       </div>

//       {/* Profile Form */}
//       <div
//         style={{
//           padding: "20px",
//           maxWidth: "800px",
//           margin: "auto",
//           fontFamily: "Arial",
//           marginLeft: !isExamPage ? (isCollapsed ? "60px" : "250px") : "0px",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         <style>
//           {`
//             a {
//               text-decoration: none;
//               color: #343a40;
//               font-weight: 600;
//               display: flex;
//               align-items: center;
//               padding: 10px 15px;
//               border-radius: 4px;
//               transition: background-color 0.3s ease, color 0.3s ease;
//               white-space: nowrap;
//             }
//             a:hover {
//               background-color: #4748ac;
//               color: #fff;
//             }
//           `}
//         </style>

//         <h2 style={{ textAlign: "center", color: "#333" }}>Welcome, {user.name}</h2>
//         <p style={{ textAlign: "center", marginBottom: "30px" }}>
//           Role: <strong>{user.role}</strong>
//         </p>

//         <div style={{ textAlign: "center", marginBottom: "30px" }}>
//           {previewPhoto && (
//             <img
//               src={previewPhoto}
//               alt="Profile"
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 marginBottom: "10px",
//               }}
//             />
//           )}
//           <input type="file" onChange={handlePhotoChange} />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label style={labelStyle}>Phone Number</label>
//           <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Date of Birth</label>
//           <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Location</label>
//           <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Description</label>
//           <textarea
//             rows="3"
//             placeholder="Tell us a little about yourself..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             style={{ ...inputStyle, resize: "vertical" }}
//           />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <h3 style={{ marginBottom: "10px", color: "#444" }}>Social Media Links</h3>

//           {["facebook", "youtube", "linkedin", "telegram", "whatsapp"].map((platform) => (
//             <div key={platform}>
//               <label style={labelStyle}>
//                 {platform.charAt(0).toUpperCase() + platform.slice(1)}: www.{platform}.com/
//               </label>
//               <input
//                 type="text"
//                 value={social[platform] || ""}
//                 onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
//                 placeholder={platform === "whatsapp" ? "Phone number with country code" : "Username"}
//                 style={inputStyle}
//               />
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={handleSaveProfile}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: "#28a745",
//             color: "white",
//             fontSize: "16px",
//             fontWeight: "bold",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Save Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// const linkStyle = {
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
//   padding: "10px 15px",
//   color: "#343a40",
//   fontWeight: "600",
//   borderRadius: "4px",
// };

// export default ProfilePage;



// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import StudentSidebar from "./StudentSidebar";
// import TeacherSidebar from "./TeacherSidebar";
// import MockSidebar from "./MockSidebar";

// const REACT_APP_API_URL = "https://full-stack-mocktest.onrender.com";

// const ProfilePage = () => {
//   // const { user } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const [phone, setPhone] = useState("");
//   const [dob, setDob] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [social, setSocial] = useState({
//     facebook: "",
//     youtube: "",
//     linkedin: "",
//     telegram: "",
//     whatsapp: "",
//   });
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [previewPhoto, setPreviewPhoto] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const routerLocation = useRouterLocation();
//   const isExamPage = routerLocation.pathname.includes("/exam");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${REACT_APP_API_URL}/api/auth/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = res.data;
//         setUser(data);
//         setPhone(data.phone || "");
//         setDob(data.dob || "");
//         setLocation(data.location || "");
//         setDescription(data.description || "");
//         setSocial(data.social || {});
//         setPreviewPhoto(data.profilePhoto || "");
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleSaveProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("phone", phone);
//       formData.append("dob", dob);
//       formData.append("location", location);
//       formData.append("description", description);
//       formData.append("social", JSON.stringify(social));
//       if (profilePhoto) formData.append("profilePhoto", profilePhoto);

//       const res = await axios.put(`${REACT_APP_API_URL}/api/auth/update-profile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setUser(res.data);
//       alert("Profile updated successfully.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile.");
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePhoto(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewPhoto(reader.result);
//     reader.readAsDataURL(file);
//   };


//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };


//   if (!user) return <div>Loading...</div>;

//   const inputStyle = {
//     width: "100%",
//     padding: "12px",
//     marginBottom: "15px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//     backgroundColor: "#f8f9fa",
//     boxSizing: "border-box",
//   };

//   const labelStyle = {
//     fontWeight: "600",
//     marginBottom: "8px",
//     display: "block",
//     fontSize: "14px",
//     color: "#333",
//   };

  

//   return (
//     <div className="d-flex">
//       {!isExamPage && (
//         <>
//           {user.role?.toLowerCase() === "student" && <StudentSidebar />}
//           {user.role?.toLowerCase() === "teacher" && <TeacherSidebar />}
//           {user?.role?.toLowerCase() === "admin" && <MockSidebar />}
//         </>
//       )}

//       <div
//         style={{
//           padding: "20px",
//           maxWidth: "800px",
//           margin: "auto",
//           fontFamily: "Arial",
//           marginLeft: !isExamPage ? "250px" : "0px",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         <style>
//           {`
//             a {
//               text-decoration: none;
//               color: #343a40;
//               font-weight: 600;
//               display: flex;
//               align-items: center;
//               padding: 10px 15px;
//               border-radius: 4px;
//               transition: background-color 0.3s ease, color 0.3s ease;
//               white-space: nowrap;
//             }
//             a:hover {
//               background-color: #4748ac;
//               color: #fff;
//             }
//           `}
//         </style>

//         <h2 style={{ textAlign: "center", color: "#333" }}>Welcome, {user.name}</h2>
//         <p style={{ textAlign: "center", marginBottom: "30px" }}>
//           Role: <strong>{user.role}</strong>
//         </p>

//         <div style={{ textAlign: "center", marginBottom: "30px" }}>
//           {previewPhoto && (
//             <img
//               src={previewPhoto}
//               alt="Profile"
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 marginBottom: "10px",
//               }}
//             />
//           )}
//           <input type="file" onChange={handlePhotoChange} />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label style={labelStyle}>Phone Number</label>
//           <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Date of Birth</label>
//           <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Location</label>
//           <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

//           <label style={labelStyle}>Description</label>
//           <textarea
//             rows="3"
//             placeholder="Tell us a little about yourself..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             style={{ ...inputStyle, resize: "vertical" }}
//           />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <h3 style={{ marginBottom: "10px", color: "#444" }}>Social Media Links</h3>

//           {["facebook", "youtube", "linkedin", "telegram", "whatsapp"].map((platform) => (
//             <div key={platform}>
//               <label style={labelStyle}>
//                 {platform.charAt(0).toUpperCase() + platform.slice(1)}: www.{platform}.com/
//               </label>
//               <input
//                 type="text"
//                 value={social[platform] || ""}
//                 onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
//                 placeholder={platform === "whatsapp" ? "Phone number with country code" : "Username"}
//                 style={inputStyle}
//               />
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={handleSaveProfile}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: "#28a745",
//             color: "white",
//             fontSize: "16px",
//             fontWeight: "bold",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Save Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation as useRouterLocation, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
} from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";
import MockSidebar from "./MockSidebar";

const REACT_APP_API_URL = "https://full-stack-mocktest.onrender.com";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [social, setSocial] = useState({
    facebook: "",
    youtube: "",
    linkedin: "",
    telegram: "",
    whatsapp: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const isExamPage = routerLocation.pathname.includes("/exam");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${REACT_APP_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setSocial(data.social || {});
        setPreviewPhoto(data.profilePhoto || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("dob", dob);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("social", JSON.stringify(social));
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.put(`${REACT_APP_API_URL}/api/auth/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f8f9fa",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: "8px",
    display: "block",
    fontSize: "14px",
    color: "#333",
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    padding: "10px 15px",
    color: "#343a40",
    fontWeight: "600",
    borderRadius: "4px",
  };

  return (
    <div className="d-flex">
      {!isExamPage && (
        <>
          {user.role?.toLowerCase() === "student" && <StudentSidebar />}
          {user.role?.toLowerCase() === "teacher" && <TeacherSidebar />}
          {user?.role?.toLowerCase() === "admin" && (
            <div
              className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
              style={{
                width: isCollapsed ? "60px" : "250px",
                height: "100vh",
                transition: "width 0.3s ease",
                zIndex: 1050,
                overflow: "hidden",
              }}
            >
              <div>
                {!isCollapsed && <h4 className="mb-4">Admin Panel</h4>}
                <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/admin-dashboard" style={linkStyle}>
                      <FaTachometerAlt className="me-2" />
                      {!isCollapsed && "Dashboard"}
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/mock-tests" style={linkStyle}>
                      <FaFileAlt className="me-2" />
                      {!isCollapsed && "Mock Tests"}
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/profile" style={linkStyle}>
                      <FaUser className="me-2" />
                      {!isCollapsed && "Profile"}
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/accounts" style={linkStyle}>
                      <FaWallet className="me-2" />
                      {!isCollapsed && "Accounts"}
                    </Link>
                  </li>
                </ul>
              </div>
              <div
                className="sidebar-link d-flex align-items-center mb-2"
                onClick={handleLogout}
                style={{ cursor: "pointer", padding: "10px 15px", color: "#343a40", fontWeight: "600" }}
              >
                <FaSignOutAlt className="me-2" />
                {!isCollapsed && "Logout"}
              </div>
            </div>
          )}
        </>
      )}

      <div
        style={{
          padding: "50px",
          maxWidth: "700px",
          width: "100%",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginLeft: !isExamPage ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "15px" }}>Welcome, {user.name}</h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          Role: <strong>{user.role}</strong>
        </p>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          {previewPhoto ? (
            <img
              src={previewPhoto}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "#aaa",
              }}
            >
              No Image
            </div>
          )}
          <input type="file" onChange={handlePhotoChange} />
        </div>

        <div style={{ marginBottom: "20px", width: "100%" }}>
          <label style={labelStyle}>Phone Number</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Description</label>
          <textarea
            rows="3"
            placeholder="Tell us a little about yourself..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "20px", width: "100%" }}>
          <h3 style={{ marginBottom: "10px", color: "#444" }}>Social Media Links</h3>
          {["facebook", "youtube", "linkedin", "telegram", "whatsapp"].map((platform) => (
            <div key={platform}>
              <label style={labelStyle}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}: www.{platform}.com/
              </label>
              <input
                type="text"
                value={social[platform] || ""}
                onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
                placeholder={platform === "whatsapp" ? "Phone number with country code" : "Username"}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveProfile}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#28a745",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
