import React from "react";

const BackgroundPage = ({ children, backgroundImage, className = "" }) => {
  return (
    <div
      className={`relative flex min-h-screen items-center justify-center ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* SVG Background */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="579"
          viewBox="0 0 1440 579"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0"
        >
          <circle cx="31" cy="80" r="50" fill="#FAF1ED" />
          <circle cx="1424.5" cy="549.5" r="29.5" fill="#FAF1ED" />
          <circle cx="85" cy="129" r="4" fill="#7B4429" />
        </svg>
      </div>

      {/* Content */}
      <div className="z-10">{children}</div>
    </div>
  );
};

export default BackgroundPage;
