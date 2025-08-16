import React, { useState, useEffect } from "react";
import axiosInstance from "./../../utils/axiosinstance";
import { API_PATHS } from "./../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "./../Modal";
import AvatarGroup from "./../AvatarGroup";
import Avatar from "./../Avatar"; // ✅ import Avatar

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Fetch all users from API
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Assign selected users and close modal
  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Get avatars for selected users
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => ({
      name: user.name || user.username || "User",
      imageUrl: user.profileImageUrl || "", // empty string if no image
    }));

  // Fetch users on mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // Reset temp selection when parent selection clears
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {/* Add members button */}
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {/* Show selected avatars */}
      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup
            avatars={selectedUserAvatars} // Pass objects {name, imageUrl}
            maxVisible={3}
            size={40}
          />
        </div>
      )}

      {/* Modal for user selection */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              <Avatar name={user.name} imageUrl={user.profileImageUrl} size={40} />

              <div className="flex flex-col">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none ml-auto"
              />
            </div>
          ))}
        </div>

        {/* Modal footer */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;