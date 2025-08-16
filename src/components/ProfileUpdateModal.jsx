import React, { useState, useContext, useRef, useEffect } from "react";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axiosInstance from "./../utils/axiosinstance";

const ProfileUpdateModal = ({ onClose }) => {
  const { user, updateUser } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null); // selected file
  const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || "");

  const modalRef = useRef();

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profileImage) {
        formData.append("profileImage", profileImage); // key must match multer
      }

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update global user context
      updateUser(response.data);

      // Update preview to permanent URL returned by backend
      setPreviewUrl(response.data.profileImageUrl);

      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-5 border-b pb-3">
          Update Profile
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={previewUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="profileImage"
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Change Photo
          </label>
          <input
            id="profileImage"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <label className="text-xs font-medium text-gray-600">Name</label>
        <input
          className="form-input mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email (Disabled) */}
        <label className="text-xs font-medium text-gray-600">Email</label>
        <input
          className="form-input mb-4 disabled:!bg-gray-100 disabled:!text-gray-500 disabled:cursor-not-allowed"
          value={user?.email || ""}
          disabled
        />

        {/* Role (Disabled) */}
        <label className="text-xs font-medium text-gray-600">Role</label>
        <input
          className="form-input mb-6 disabled:!bg-gray-100 disabled:!text-gray-500 disabled:cursor-not-allowed"
          value={user?.role || ""}
          disabled
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;