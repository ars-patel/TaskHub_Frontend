import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "./../../utils/data";
import Avatar from "./../Avatar";
import ProfileUpdateModal from './../ProfileUpdateModal';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false); // ✅ modal state

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleCopyToken = () => {
    if (user?.adminInviteToken) {
      navigator.clipboard.writeText(user.adminInviteToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
        <div className="flex flex-col items-center justify-center mb-7 pt-5">
          {/* ✅ Clickable Avatar for opening modal */}
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenProfileModal(true)}
            title="Edit Profile"
          >
            <Avatar
              name={user?.name}
              id={user?._id}
              imageUrl={user?.profileImageUrl}
              size={80}
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-1 rounded">
              Edit
            </div>
          </div>

          {user.role === "admin" ? (
            <>
              <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
                Admin
              </div>

              {user.adminInviteToken && (
                <div
                  onClick={handleCopyToken}
                  className="mt-2 px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700 cursor-pointer hover:bg-gray-200 transition flex items-center gap-2"
                  title="Click to copy"
                >
                  <span className="truncate max-w-[140px]">
                    {user.adminInviteToken}
                  </span>
                  {copied ? (
                    <span className="text-green-600 text-[10px]">Copied!</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16h8m-8-4h8m-6-4h6m2-4H6a2 2 0 00-2 2v14l4-4h10a2 2 0 002-2V4z"
                      />
                    </svg>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-[10px] font-medium text-white bg-gray-500 px-3 py-0.5 rounded mt-1">
              Member
            </div>
          )}

          <h5 className="text-gray-950 font-medium leading-6 mt-3">
            {user?.name || ""}
          </h5>
          <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
        </div>

        {sideMenuData.map((item, index) => {
          return (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px] ${
                activeMenu === item.label
                  ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                  : ""
              } py-3 px-6 mb-3 cursor-pointer`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ✅ Modal appears when openProfileModal is true */}
      {openProfileModal && (
        <ProfileUpdateModal onClose={() => setOpenProfileModal(false)} />
      )}
    </>
  );
};

export default SideMenu;