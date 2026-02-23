import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {api} from "../Dash/TransactionApi.jsx";

const initialState = {
  username: "",
  password: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "username":
      return { ...state, username: action.value };
    case "password":
      return { ...state, password: action.value };
    default:
      return state;
  }
}

function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/auth/login", state);

    const res = await api.get("/auth/me");

    if (res.data.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/user");
    }

  } catch (err) {
    alert("Invalid credentials");
  }
};


  return (
    <div className="login-container">
      <div className="card login-card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">Enterprise Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                onChange={(e) =>
                  dispatch({ type: "username", value: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) =>
                  dispatch({ type: "password", value: e.target.value })
                }
                required
              />
            </div>

            <button className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
