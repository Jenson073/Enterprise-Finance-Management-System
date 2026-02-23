import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../Dash/TransactionApi.jsx";

function PrivateRoute({ allowedRole }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        if (allowedRole && res.data.role !== allowedRole) {
          setStatus("forbidden");
        } else {
          setStatus("allowed");
        }
      })
      .catch(() => setStatus("unauth"));
  }, [allowedRole]);

  if (status === "loading") return null;

  if (status === "unauth") {
    return <Navigate to="/" />;
  }

  if (status === "forbidden") {
    return <Navigate to="/user" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
