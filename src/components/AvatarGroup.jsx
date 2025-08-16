import React from "react";
import Avatar from "./Avatar";

const AvatarGroup = ({ avatars, maxVisible = 5, size = 36 }) => (
  <div className="flex items-center">
    {avatars.slice(0, maxVisible).map((user, index) => (
      <div key={index} className="-ml-3 first:ml-0">
        <Avatar name={user.name} imageUrl={user.imageUrl} size={size} />
      </div>
    ))}
    {avatars.length > maxVisible && (
      <div
        className="flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3"
        style={{ width: size, height: size }}
      >
        +{avatars.length - maxVisible}
      </div>
    )}
  </div>
);

export default AvatarGroup;