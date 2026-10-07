import React from "react";

const AuthVisual = ({
  headlineLine1 = "Changing the way",
  headlineLine2 = "the world writes",
  subtext = "Streamline tasks, boost team collaboration, and deliver projects faster."
}) => {
  return (
    <div className="auth-visual-pane">
      <div className="auth-visual-inner">
        {/* SVG Decorative Art Backdrop */}
        <svg
          className="auth-visual-svg"
          viewBox="0 0 700 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="topPurpleGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
            </radialGradient>

            <linearGradient id="topOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>

            <linearGradient id="lilacGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            <linearGradient id="pinkShieldGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>

            <linearGradient id="blueCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="lavenderTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>

            {/* Soft Ambient Shadow Filters */}
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.28 0"/>
              <feBlend in="SourceGraphic" in2="blur" mode="normal" />
            </filter>

            <filter id="pinkGlow" x="-50%" y="-40%" width="200%" height="200%">
              <feDropShadow dx="-10" dy="12" stdDeviation="20" floodColor="#F43F5E" floodOpacity="0.4" />
            </filter>

            <filter id="purpleGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="8" dy="12" stdDeviation="18" floodColor="#818CF8" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* 1. Top-Left Soft Lavender Orb with Glow */}
          <circle
            cx="170"
            cy="110"
            r="82"
            fill="url(#topPurpleGrad)"
            filter="url(#purpleGlow)"
          />

          {/* 2. Top-Right Orange Semicircle Arc */}
          <path
            d="M 400 0 A 130 130 0 0 0 660 0 Z"
            fill="url(#topOrangeGrad)"
          />

          {/* 3. Top-Far-Right Lilac Sector */}
          <path
            d="M 680 60 A 85 85 0 0 1 680 230 L 680 60 Z"
            fill="url(#lilacGrad)"
            opacity="0.9"
          />

          {/* 4. Center-Right Dot Matrix Grid */}
          <g className="dot-matrix-grid" fill="#CBD5E1">
            {[0, 1, 2, 3, 4, 5, 6].map((row) =>
              [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={480 + col * 18}
                  cy={180 + row * 18}
                  r="2.2"
                />
              ))
            )}
          </g>

          {/* 5. Small Coral Semicircle below line 1 */}
          <path
            d="M 170 340 A 34 34 0 0 0 238 340 Z"
            fill="#FB7185"
          />

          {/* 6. Bottom-Left Vibrant Coral / Reddish Petal Shield with Soft Glow */}
          <path
            d="M 230 460
               C 275 460, 295 490, 290 535
               C 285 580, 270 615, 250 625
               C 230 635, 205 605, 205 570
               C 205 510, 210 460, 230 460 Z"
            fill="url(#pinkShieldGrad)"
            filter="url(#pinkGlow)"
          />

          {/* 7. Bottom-Center Sky Blue Quarter-Arc Slice */}
          <path
            d="M 310 600
               A 90 90 0 0 0 490 600
               Z"
            fill="url(#blueCrescentGrad)"
          />

          {/* 8. Bottom-Right Rounded Triangle */}
          <path
            d="M 600 460
               Q 640 450 655 485
               Q 670 520 635 555
               Q 595 590 560 550
               Q 535 520 560 485
               Q 575 465 600 460 Z"
            fill="url(#lavenderTriangleGrad)"
            filter="url(#purpleGlow)"
          />
        </svg>

        {/* Central Bold Typography */}
        <div className="auth-visual-content">
          <h1 className="auth-visual-headline">
            <span>{headlineLine1}</span>
            <span>{headlineLine2}</span>
          </h1>
          {subtext && <p className="auth-visual-subtext">{subtext}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthVisual;
