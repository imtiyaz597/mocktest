// import { useState } from "react";

// const REACT_APP_API_URL = "https://mocktest-l6sr.onrender.com"

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(""); // Clear previous message

//     try {
//       const res = await fetch(`${REACT_APP_API_URL}/api/auth/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       // Show message immediately after response
//       if (res.ok) {
//         setMessage(data.message);
//       } else {
//         setMessage(data.message || "Something went wrong");
//       }
//     } catch (error) {
//       setMessage("Network error. Please try again later.");
//     } finally {
//       setLoading(false); // Turn off loading state
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Forgot Password</h2>
//       {message && <div className="alert alert-info">{message}</div>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           required
//           className="form-control mb-2"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;



import { useState } from "react";

const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous message

    try {
      const res = await fetch(`${REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset email sent successfully.");
      } else {
        setMessage(data.message || "Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          className="form-control mb-2"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
