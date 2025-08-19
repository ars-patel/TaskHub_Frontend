import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import { LuSmile, LuSend, LuTrash2, LuPencil } from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "./Avatar";
import axiosInstance from "./../utils/axiosinstance";
import { toast } from "react-hot-toast";
import Modal from './Modal';
import DeleteAlert from './DeleteAlert';

const ChatPage = ({ taskId }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const emojiRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.COMMENTS.GET_COMMENTS_BY_TASK(taskId)
        );
        setComments(res.data.reverse());
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };
    fetchComments();
  }, [taskId]);

  // Add new comment
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await axiosInstance.post(
        API_PATHS.COMMENTS.ADD_COMMENT(taskId),
        { text }
      );
      setComments((prev) => [...prev, res.data]);
      setText("");
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  // Edit comment
  const handleEdit = async (commentId, newText) => {
    try {
      const res = await axiosInstance.put(
        API_PATHS.COMMENTS.EDIT_COMMENT(taskId, commentId),
        { text: newText }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data : c))
      );
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(
        API_PATHS.COMMENTS.DELETE_COMMENT(taskId, commentId)
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setSelectedComment(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="form-card mt-5 h-full flex flex-col bg-white border border-gray-100 shadow-sm rounded-lg">
      {/* Header */}
      <div className="bg-white text-slate-600 p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-xl font-medium">Task Chat</h2>
        {user.role === "admin" && (
          <button
            onClick={() => setOpenDeleteAlert(true)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
          >
            <LuTrash2 className="text-base" />
            Delete All
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((c) => {
              const isMine = c.author._id === user._id;
              return (
                <div
                  key={c._id}
                  className={`flex ${
                    isMine ? "flex-row-reverse" : "flex-row"
                  } gap-3 group`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    <Avatar
                      name={c.author.name}
                      imageUrl={c.author.profileImageUrl}
                      size={36}
                    />
                  </div>

                  {/* Comment Content */}
                  <div
                    className={`flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    } max-w-[80%]`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-600">
                        {c.author.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {/* Comment Box */}
                    <div
                      className={`p-3 rounded-lg border bg-white text-slate-600 relative transition-all duration-200 hover:shadow-sm ${
                        isMine ? "border-blue-100" : "border-gray-100"
                      }`}
                      onClick={() =>
                        isMine &&
                        setSelectedComment(
                          selectedComment === c._id ? null : c._id
                        )
                      }
                    >
                      {editingComment === c._id ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="form-input w-full px-3 py-2 text-sm text-slate-600 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <div className="flex justify-end gap-3 mt-2">
                            <button
                              onClick={() => handleEdit(c._id, editText)}
                              className="text-xs font-medium text-blue-500 hover:text-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingComment(null);
                                setEditText("");
                              }}
                              className="text-xs font-medium text-gray-500 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm leading-relaxed">{c.text}</p>
                      )}

                      {c.isEdited && !editingComment && (
                        <div className="text-xs text-gray-400 mt-1 italic">
                          Edited
                        </div>
                      )}
                    </div>

                    {/* Controls (only for user's own comments) */}
                    {selectedComment === c._id && isMine && (
                      <div className="flex gap-3 text-gray-500 text-sm mt-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                        <button
                          className="hover:text-rose-500 transition-colors"
                          onClick={() => handleDelete(c._id)}
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                        <button
                          className="hover:text-blue-500 transition-colors"
                          onClick={() => {
                            setEditingComment(c._id);
                            setEditText(c.text);
                            setSelectedComment(null);
                          }}
                        >
                          <LuPencil className="text-base" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-sm text-center py-8 italic">
              No comments yet. Start the conversation!
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-gray-100 relative mb-3">
        <div className="flex items-center bg-white rounded-md border border-gray-100 px-3 py-2 gap-2 shadow-sm">
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-slate-600 hover:text-blue-500 transition-colors"
          >
            <LuSmile className="text-lg" />
          </button>

          {/* Emoji Picker */}
          {showEmoji && (
            <div
              ref={emojiRef}
              className="absolute bottom-16 left-3 bg-white shadow-lg rounded-lg z-50"
            >
              <EmojiPicker
                onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
              />
            </div>
          )}

          {/* Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm text-slate-600 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <LuSend className="text-base" />
          </button>
        </div>
      </div>

      {/* Delete All Comments Modal */}
      {openDeleteAlert && (
        <Modal
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title="Delete All Comments"
        >
          <DeleteAlert
            content="Are you sure you want to delete all comments for this task?"
            onDelete={async () => {
              try {
                await axiosInstance.delete(
                  API_PATHS.COMMENTS.DELETE_ALL_COMMENTS(taskId)
                );
                setComments([]);
                setSelectedComment(null);
                toast.success("All comments deleted successfully!");
              } catch (error) {
                console.error("Delete all comments error:", error);
                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete all comments. Please try again."
                );
              }
              setOpenDeleteAlert(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChatPage;