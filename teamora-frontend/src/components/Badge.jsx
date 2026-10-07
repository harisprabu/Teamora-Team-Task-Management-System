import React from "react";

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case "COMPLETED":
        return "badge-success";
      case "IN_PROGRESS":
        return "badge-primary";
      case "ASSIGNED":
        return "badge-info";
      case "APPROVED":
        return "badge-success";
      case "PENDING":
        return "badge-warning";
      case "REJECTED":
      case "DEACTIVATED":
        return "badge-danger";
      default:
        return "badge-neutral";
    }
  };

  const getLabel = () => {
    if (!status) return "N/A";
    return status.replace("_", " ");
  };

  return <span className={`badge ${getStyle()}`}>{getLabel()}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case "HIGH":
        return "badge-danger";
      case "MEDIUM":
        return "badge-warning";
      case "LOW":
      default:
        return "badge-info";
    }
  };

  return <span className={`badge ${getStyle()}`}>{priority || "MEDIUM"}</span>;
};

export const RoleBadge = ({ role }) => {
  const getStyle = () => {
    switch (role) {
      case "ADMIN":
        return "badge-admin";
      case "TEAM_LEADER":
        return "badge-leader";
      case "TEAM_MEMBER":
      default:
        return "badge-member";
    }
  };

  const getLabel = () => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "TEAM_LEADER":
        return "Team Leader";
      case "TEAM_MEMBER":
      default:
        return "Team Member";
    }
  };

  return <span className={`badge ${getStyle()}`}>{getLabel()}</span>;
};
