import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MockSidebar from "./MockSidebar";
import { FaUsers, FaListAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
 
// Animated counter hook
const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};
 
const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
  const [users, setUsers] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [usersRes, testsRes] = await Promise.all([
          fetch("https://mock-full-stack-2.onrender.com/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://mock-full-stack-2.onrender.com/api/admin/mock-tests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
 
        if (!usersRes.ok || !testsRes.ok) throw new Error("Failed to fetch data");
 
        const usersData = await usersRes.json();
        const testsData = await testsRes.json();
 
        setUsers(usersData || []);
        setMockTests(testsData || []);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchDashboardData();
  }, []);
 
  const totalUsers = useCountUp(users.length);
  const totalMockTests = useCountUp(mockTests.length);
  const activeTests = useCountUp(mockTests.filter((t) => t.status === "active").length);
  const inactiveTests = totalMockTests - activeTests;
 
  return (
    <div className="d-flex">
      <MockSidebar />
 
      <div className="container mt-4" style={{ marginLeft: "250px" }}>
        <style>
          {`
            .dashboard-card {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
              height: 100%;
              transition: 0.3s ease;
            }
 
            .dashboard-card:hover {
              transform: translateY(-3px);
            }
 
            .dashboard-card .value {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
            }
 
            .btn-link-card {
              padding: 10px 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
              text-align: center;
              transition: 0.2s;
              background-color: #f5f5f5;
              text-decoration: none;
              color: #333;
              font-weight: bold;
              display: block;
              cursor: pointer;
            }
 
            .btn-link-card:hover {
              background-color: #007bff;
              color: white;
            }
 
            @media (max-width: 768px) {
              .container {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
 
        <h2 className="text-center">Admin Dashboard</h2>
        <p className="text-center text-muted">Manage users, mock tests, and platform statistics</p>
 
        {loading && <div className="text-center mt-5">Loading data...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
 
        {!loading && !error && (
          <>
            <h4 className="mt-5 mb-3">📊 Platform Statistics</h4>
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="dashboard-card">
                  <FaUsers size={30} className="mb-2 text-primary" />
                  <h5>Total Users</h5>
                  <div className="value">{totalUsers}</div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="dashboard-card">
                  <FaToggleOn size={30} className="mb-2 text-success" />
                  <h5>Active Tests</h5>
                  <div className="value">{activeTests}</div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="dashboard-card">
                  <FaToggleOff size={30} className="mb-2 text-danger" />
                  <h5>Inactive Tests</h5>
                  <div className="value text-danger">{inactiveTests}</div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="dashboard-card">
                  <FaListAlt size={30} className="mb-2 text-warning" />
                  <h5>Total Mock Tests</h5>
                  <div className="value">{totalMockTests}</div>
                </div>
              </div>
            </div>
 
            <h4 className="mt-4 mb-3">🛠️ Actions</h4>
            <div className="d-flex justify-content-center gap-3 mb-5">
              <button className="btn btn-success" onClick={() => navigate("/add-user")}>
                Add User
              </button>
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default AdminDashboard;