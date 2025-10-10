import React, { useEffect, useState } from "react";
import { FaTimes, FaPencilAlt } from "react-icons/fa";

export default function ColumnModal({
  onOpen,
  onClose,
  onSave,
  currentColumn,
}) {
  const isEditing = currentColumn && currentColumn.id;
  const [title, setTitle] = useState(isEditing ? currentColumn.title : "");

  useEffect(() => {
    if (onOpen) {
      setTitle(isEditing ? currentColumn.title : "");
    }
  }, [onOpen, currentColumn, isEditing]);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle("");
    }
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50"
      style={{ display: onOpen ? "flex" : "none" }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
        <div className="flex justify-between items-center p-4 shadow-md">
          <h2 className="text-xl font-bold flex items-center">
            {isEditing ? (
              <FaPencilAlt size={16} className="mr-2" />
            ) : (
              <FaTimes size={16} className="mr-2" />
            )}
            {isEditing
              ? `Edit Column: ${currentColumn.title}`
              : "Add New Column"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="p-4">
            <label
              htmlFor="column-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Title
            </label>
            <input
              id="column-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., In Progress"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 p-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              {isEditing ? "Save Changes" : "Add Column"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
