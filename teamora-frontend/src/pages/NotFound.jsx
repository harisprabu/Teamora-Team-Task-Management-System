import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const destination = isAuthenticated
    ? (isAdmin ? "/admin/dashboard" : "/dashboard")
    : "/login";

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card card">
        <div className="not-found-code">404</div>
        <h2>Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you are looking for doesn't exist, has been removed, or you don't have access to it.
        </p>
        <Link to={destination} className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
