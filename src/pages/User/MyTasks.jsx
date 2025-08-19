import React, { useState, useEffect } from "react";
import DashboardLayout from "./../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "./../../components/TaskStatusTabs";
import TaskCard from "./../../components/cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

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
    }
  };

  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredTasks(allTasks);
    } else {
      setFilteredTasks(allTasks.filter(task => task.status === filterStatus));
    }
  }, [filterStatus, allTasks]);

  useEffect(() => {
    getAllTasks();
  }, []);

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  // Determine the empty message
  const getEmptyMessage = () => {
    const totalTasks = allTasks.length;
    if (totalTasks === 0) {
      return "You have not received any tasks.";
    } else {
      return "There are currently no tasks under this status. Check back later or create a new task.";
    }
  };

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {/* Tabs always visible */}
          <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mr-6 custom-mr">
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
                onClick={() => handleClick(item._id)}
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
              <h3 className="text-lg font-semibold">No Tasks</h3>
              <p className="text-sm text-gray-400">{getEmptyMessage()}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;