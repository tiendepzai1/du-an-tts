import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2a174e] via-[#35285f] to-[#1d1b3a] flex flex-col">
      {children}
    </div>
  );
};

export default Background;
