import { useState } from "react";
import { api } from "../Dash/TransactionApi";

function CreateUser() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");
    setSuccess("");

    try {
      await api.post("/auth/create-user", { username, password });

      setSuccess("User created successfully!");
      setUsername("");
      setPassword("");

    } catch (err) {
      setMsg(err.response?.data || "Error creating user");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card p-4">
        <h4 className="mb-3 text-center">Create New User</h4>

        {msg && <div className="alert alert-danger">{msg}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">
            Create User
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateUser;
