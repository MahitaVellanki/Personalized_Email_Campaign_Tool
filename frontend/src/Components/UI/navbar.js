import React from "react";

export default function Navbar({ children, className }) {
  return (
    <div className="flex flex-row h-8">
      <img
        src="assets/docupilot.png"
        alt="Logo"
        className="h-8 w-8 mt-2 mx-2"
      />
      <div>{children}</div>
    </div>
  );
}
