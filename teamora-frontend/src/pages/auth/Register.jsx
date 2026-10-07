import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import TeamoraLogo from "../../components/TeamoraLogo";
import AuthVisual from "./AuthVisual";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim()) {
      setError("Please choose a username");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms to proceed");
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (res && res.pendingApproval) {
        setSuccessInfo(res.message);
      } else if (res && res.role) {
        if (res.role === "ADMIN") navigate("/admin/dashboard");
        else if (res.role === "TEAM_LEADER") navigate("/team-leader/dashboard");
        else navigate("/member/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
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
          <h2 className="auth-title">Register</h2>

          {successInfo ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>⏳</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
                Registration Submitted
              </h3>
              <div className="auth-alert auth-alert-warning" style={{ textAlign: "left", marginTop: "12px" }}>
                <strong>Account Pending Admin Approval:</strong>
                <p style={{ marginTop: "6px" }}>
                  Thank you for registering, <strong>{formData.username}</strong>! Your account has been registered with the <strong>Team Member</strong> role.
                </p>
                <p style={{ marginTop: "6px" }}>
                  An Administrator must review and approve your account before you can log in.
                </p>
              </div>
              <div style={{ marginTop: "24px" }}>
                <Link to="/login" className="btn-auth-submit" style={{ textDecoration: "none" }}>
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Errors & notices */}
              {error && <div className="auth-alert auth-alert-danger">{error}</div>}

              <div className="auth-alert auth-alert-info" style={{ fontSize: "13px", padding: "10px 12px", marginBottom: "16px" }}>
                ℹ️ All new members require admin review before login.
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-input-group">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="auth-input"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Password (minimum 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="auth-input-group">
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="auth-options-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    I agree to the Workspace Guidelines
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Create Account"}
                </button>
              </form>

              {/* Footer prompt */}
              <p className="auth-footer-prompt">
                Already have an account?{" "}
                <Link to="/login" className="auth-footer-link">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: VISUAL PRESENTATION */}
      <AuthVisual
        headlineLine1="Hello Welcome to"
        headlineLine2="Teamora"
        subtext="Collaborate on high-impact projects, track deliverables, and empower your team with Teamora."
      />
    </div>
  );
};

export default Register;
