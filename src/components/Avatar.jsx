import React, { useState } from "react";

const getColorFromString = (str) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const Avatar = ({ name, imageUrl, size = 36 }) => {
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U"; // fallback
    return fullName.trim().charAt(0).toUpperCase();
  };

  const bgColor = getColorFromString(name || "User");

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={name || "User"}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`rounded-full ${bgColor} flex items-center justify-center text-white font-semibold`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;