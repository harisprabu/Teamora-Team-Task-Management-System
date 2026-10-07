import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import TeamoraLogo from "../../components/TeamoraLogo";
import AuthVisual from "./AuthVisual";
import "./Auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your email/username and password");
      return;
    }

    try {
      setLoading(true);
      const user = await login(username.trim(), password);

      if (keepLoggedIn) {
        localStorage.setItem("teamora_keep_logged_in", "true");
      } else {
        sessionStorage.setItem("teamora_session_only", "true");
      }

      let target = "/member/dashboard";
      if (user.role === "ADMIN") {
        target = "/admin/dashboard";
      } else if (user.role === "TEAM_LEADER") {
        target = "/team-leader/dashboard";
      }

      const destination = location.state?.from?.pathname || target;
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Invalid username or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT COLUMN: FORM */}
      <div className="auth-form-pane">
        <div className="auth-form-card">
          {/* Logo */}
          <div className="auth-brand-wrapper">
            <TeamoraLogo size={58} />
          </div>

          {/* Heading */}
          <h2 className="auth-title">Login</h2>

          {/* Error Notice */}
          {error && <div className="auth-alert auth-alert-danger">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <input
                id="username"
                type="text"
                className="auth-input"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
            </div>

            <div className="auth-input-group">
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Keep me logged in & Forgot password row */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                Keep me logged in
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer prompt */}
          <p className="auth-footer-prompt">
            Don't have an account?{" "}
            <Link to="/register" className="auth-footer-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: VISUAL PRESENTATION */}
      <AuthVisual
        headlineLine1="Welcome back to"
        headlineLine2="Teamora"
        subtext="Empower your team to communicate, manage tasks, and achieve project success with Teamora."
      />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="auth-modal-backdrop"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="auth-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-icon">🔐</div>
            <h3>Password Recovery</h3>
            <p>
              To reset your password, please contact your workspace
              Administrator at <strong>admin@teamora.com</strong> or your
              assigned Team Leader.
            </p>
            <button
              type="button"
              className="btn-auth-submit"
              onClick={() => setShowForgotModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;