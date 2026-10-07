import React from "react";

const TeamoraLogo = ({ size = 64, dotSize = 10, className = "" }) => {
  return (
    <div
      className={`teamora-logo-mark ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="teamoraGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="35%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Curved modern lettermark matching the aesthetic */}
        <path
          d="M 68 28 
             C 58 16, 36 16, 26 28 
             C 14 42, 14 62, 26 74 
             C 38 86, 60 86, 70 74 
             C 73 70, 72 65, 67 65 
             C 62 65, 59 69, 56 72 
             C 48 80, 36 78, 30 70 
             C 22 59, 22 43, 30 32 
             C 36 24, 48 24, 56 31 
             C 61 35, 67 33, 68 28 Z"
          fill="url(#teamoraGrad)"
          filter="url(#logoGlow)"
        />

        {/* Accent dot on the bottom right */}
        <circle cx="82" cy="73" r={dotSize} fill="url(#teamoraGrad)" filter="url(#logoGlow)" />
      </svg>
    </div>
  );
};

export default TeamoraLogo;
