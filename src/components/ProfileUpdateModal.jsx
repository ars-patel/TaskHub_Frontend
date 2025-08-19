import React, { useState, useContext, useRef, useEffect } from "react";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axiosInstance from "./../utils/axiosinstance";

const ProfileUpdateModal = ({ onClose }) => {
  const { user, updateUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || "");
  const modalRef = useRef();

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
        formData.append("profileImage", profileImage);
      }

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      updateUser(response.data);
      setPreviewUrl(response.data.profileImageUrl);
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] min-h-screen overscroll-behavior-none">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[90vw] sm:max-w-md rounded-lg shadow-lg p-4 h-auto max-h-[calc(100dvh-1rem)] overflow-y-auto"
      >
        <h2 className="text-lg font-medium text-slate-600 mb-4 border-b border-gray-100 pb-2">
          Update Profile
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            <img
              src={previewUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="profileImage"
            className="mt-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer shadow-sm"
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
        <label className="text-xs font-medium text-slate-600">Name</label>
        <input
          className="form-input w-full px-3 py-2 text-sm text-slate-600 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="text-xs font-medium text-slate-600">Email</label>
        <input
          className="form-input w-full px-3 py-2 text-sm text-slate-600 border border-gray-100 rounded-md !bg-gray-200 text-gray-500 cursor-not-allowed mb-3"
          value={user?.email || ""}
          disabled
        />

        {/* Role */}
        <label className="text-xs font-medium text-slate-600">Role</label>
        <input
          className="form-input w-full px-3 py-2 text-sm text-slate-600 border border-gray-100 rounded-md !bg-gray-200 text-gray-500 cursor-not-allowed mb-4"
          value={user?.role || ""}
          disabled
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-gray-100 rounded-md hover:bg-gray-200 transition cursor-pointer w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="add-btn px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;