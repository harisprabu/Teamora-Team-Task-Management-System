import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTeams from "./pages/admin/ManageTeams";
import ManageProjects from "./pages/admin/ManageProjects";

// Team Leader Pages
import TeamLeaderDashboard from "./pages/teamLeader/TeamLeaderDashboard";
import MyProjects from "./pages/teamLeader/MyProjects";
import MyTeam from "./pages/teamLeader/MyTeam";
import TaskManagement from "./pages/teamLeader/TaskManagement";
import DailyFeedbackReview from "./pages/teamLeader/DailyFeedbackReview";
import MemberPerformance from "./pages/teamLeader/MemberPerformance";

// Team Member Pages
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberTasks from "./pages/member/MyTasks";
import MemberTaskDetails from "./pages/member/TaskDetails";
import DailyFeedbackForm from "./pages/member/DailyFeedbackForm";
import MemberTeam from "./pages/member/MemberTeam";

// Common Pages
import Notifications from "./pages/Notifications";
import MyProfile from "./pages/profile/MyProfile";
import NotFound from "./pages/NotFound";

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === "TEAM_LEADER") {
    return <Navigate to="/team-leader/dashboard" replace />;
  } else {
    return <Navigate to="/member/dashboard" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard" element={<RootRedirect />} />

          {/* Public Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Common Authenticated Pages */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* =========================================
              ADMIN EXCLUSIVE ROUTES
              ========================================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <ManageUsers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <ManageTeams />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <ManageProjects />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* =========================================
              TEAM LEADER ROUTES
              ========================================= */}
          <Route
            path="/team-leader/dashboard"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <TeamLeaderDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/projects"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <MyProjects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/team"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <MyTeam />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/tasks"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <TaskManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/feedback"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <DailyFeedbackReview />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader/performance"
            element={
              <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
                <Layout>
                  <MemberPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* =========================================
              TEAM MEMBER ROUTES
              ========================================= */}
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute allowedRoles={["TEAM_MEMBER", "ADMIN"]}>
                <Layout>
                  <MemberDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/tasks"
            element={
              <ProtectedRoute allowedRoles={["TEAM_MEMBER", "ADMIN"]}>
                <Layout>
                  <MemberTasks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/tasks/:id"
            element={
              <ProtectedRoute allowedRoles={["TEAM_MEMBER", "ADMIN"]}>
                <Layout>
                  <MemberTaskDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/daily-feedback"
            element={
              <ProtectedRoute allowedRoles={["TEAM_MEMBER", "ADMIN"]}>
                <Layout>
                  <DailyFeedbackForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/team"
            element={
              <ProtectedRoute allowedRoles={["TEAM_MEMBER", "ADMIN"]}>
                <Layout>
                  <MemberTeam />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;