import React, { useState, useEffect } from "react";
import DashboardLayout from "./../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "./../../components/TaskStatusTabs";
import TaskCard from "./../../components/cards/TaskCard";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  // Fetch all tasks once
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: tasks.length },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Failed to fetch tasks. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  // Filter tasks locally based on selected tab
  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredTasks(allTasks);
    } else {
      setFilteredTasks(allTasks.filter(task => task.status === filterStatus));
    }
  }, [filterStatus, allTasks]);

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details", error);
      toast.error("Failed to download task details. Please try again.");
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
            <button
              className="flex lg:hidden dowload-btn items-center gap-1"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {/* Tabs + Download button */}
          <div className="flex items-center gap-3">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />

            <button
              className="hidden lg:flex dowload-btn items-center gap-1"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mr-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo || []}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            <div className="col-span-full mt-6 flex flex-col items-center justify-center text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold">No Tasks Found</h3>
              <p className="text-sm text-gray-400">
                There are currently no tasks under this status. Check back later
                or create a new task.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;