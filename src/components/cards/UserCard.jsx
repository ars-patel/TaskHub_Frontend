import React, { useState } from "react";
import Avatar from "./../Avatar";
import axiosInstance from "./../../utils/axiosinstance";
import { toast } from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../Modal";
import DeleteAlert from "../DeleteAlert";

const UserCard = ({ userInfo, onUserDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userInfo._id));
      setLoading(false);
      toast.success(`${userInfo.name} removed from tasks successfully`);
      setOpenDeleteAlert(false);
      if (onUserDeleted) onUserDeleted(userInfo._id);
    } catch (error) {
      console.error("Delete failed:", error);
      setLoading(false);
      toast.error("Failed to remove user from tasks");
    }
  };

  return (
    <>
      <div className="user-card p-4 border rounded shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              name={userInfo?.name}
              id={userInfo?._id}
              imageUrl={userInfo?.profileImageUrl}
              size={48}
            />
            <div>
              <p className="text-sm font-medium">{userInfo?.name}</p>
              <p className="text-xs text-gray-500">{userInfo?.email}</p>
            </div>
          </div>

          {/* Delete button with icon */}
          <button
            onClick={() => setOpenDeleteAlert(true)}
            className="text-red-500 hover:text-red-600 transition"
            title="Remove from tasks"
          >
            <LuTrash2 size={20} />
          </button>
        </div>

        <div className="flex items-end gap-3 mt-5">
          <StatCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
          <StatCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
          <StatCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete User"
      >
        <DeleteAlert
          content={`Are you sure you want to remove ${userInfo?.name} from tasks?`}
          onDelete={handleDelete}
        />
      </Modal>
    </>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50";
      case "Completed":
        return "text-lime-500 bg-lime-50";
      default:
        return "text-violet-500 bg-violet-50";
    }
  };

  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
      <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
    </div>
  );
};