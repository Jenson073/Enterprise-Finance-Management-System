import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8081/auth/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      alert("Password changed. Please login again.");
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data || "Error");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card p-4">
        <h4 className="mb-3 text-center">Change Password</h4>

        {msg && <div className="alert alert-danger">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;