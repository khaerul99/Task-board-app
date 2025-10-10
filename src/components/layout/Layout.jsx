import React from "react";
import Navbar from "../navbar/Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen">
      <div className="pb-32 md:pb-20">
        <Navbar />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
