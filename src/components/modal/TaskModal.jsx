import { useTaskStore } from "../../store/taskStore";
import {
  FaTrash,
  FaPlus,
  FaCheckSquare,
  FaSquare,
  FaPaperclip,
  FaTimes,
  FaPencilAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaFolderOpen,
} from "react-icons/fa";
import { MAX_AVATAR, TEAM_MEMBERS } from "../../store/taskStore";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { AssigneePickerModal } from "./AssigneePickerModal";

const LABELS = ["Feature", "Bug", "Issue", "Undefined"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const DEFAULT_TASK_DATA = {
  title: "",
  assignees: [],
  dueDate: null,
  label: "Undefined",
  description: "",
  priority: "Medium",
  attachments: [],
  coverImage: null,
  checklist: [],
};


export default function TaskModal({
  onOpen,
  onClose,
  columnId,
  task,
  onSave,
  onDelete,
}) {
  const { updateTask } = useTaskStore();
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const fileInputRef = useRef(null);
  const [isAssigneePickerOpen, setIsAssigneePickerOpen ] = useState(false); 
  const isNewTask = !task || !task.id;
  const [formData, setFormData] = useState(() => {
    const initialData = isNewTask ? { ...DEFAULT_TASK_DATA } : task;

    return initialData;
  });

  useEffect(() => {
    if (onOpen) {
      const initialData = task ? task : { ...DEFAULT_TASK_DATA };
      setFormData(initialData);
    }
  }, [onOpen, task]);

  if (!onOpen) {
    return null;
  }

  const handleDeleteTask = () => {
    if (!task || !task.id) return;

    Swal.fire({
      title: `Hapus Tugas: "${task.title}"?`,
      text: "Tugas ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Panggil fungsi deleteTask
        onDelete(task.id, columnId);

        // Tutup modal
        onClose();

        // Notifikasi Sukses
        Swal.fire({
          icon: "success",
          title: "Dihapus!",
          text: `Tugas "${task.title}" berhasil dihapus.`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top-end",
        });
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        coverImage: imageUrl,
      }));
    }
  };

  const handleRemoveCover = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updatedChecklist = formData.checklist.map((item) =>
        item.id === value ? { ...item, completed: checked } : item
      );
      setFormData({ ...formData, checklist: updatedChecklist });
    }  else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
      const dataToSave = { 
      ...formData,
      assignees: Array.isArray(formData.assignees) ? formData.assignees : [],
  };
  
  onSave(dataToSave);
 
  

    onClose();

 
  };

  const handleOpenAssigneePicker = async () => {
    setIsAssigneePickerOpen(true)
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim() === "") return;

    const newSubtask = {
      id: uuidv4(),
      text: newSubtaskText.trim(),
      completed: false,
    };

    const updatedChecklist = [...(formData.checklist || []), newSubtask];

    setFormData((prev) => ({ ...prev, checklist: updatedChecklist }));
    setNewSubtaskText("");
  };

  const handleToggleChecklist = (subtaskId) => {
    const currentChecklist = formData.checklist || [];
    const updatedChecklist = currentChecklist.map((item) =>
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );

    // U: Perbarui state Lokal DAN Zustand (untuk update real-time di TaskCard)
    setFormData((prev) => ({ ...prev, checklist: updatedChecklist }));
    updateTask(task.id, { checklist: updatedChecklist });
  };

  // Data tampilan
 const currentAssigneesData = TEAM_MEMBERS.filter((m) =>    
    (formData.assignees || []).includes(m.id) 
);

  const totalSubtasks = (formData.checklist || []).length;
  const completedSubtasks = (formData.checklist || []).filter(
    (c) => c.completed
  ).length;
  const progress =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  const visibleMembers = currentAssigneesData.slice(0, MAX_AVATAR);
  const otherCount = currentAssigneesData.length - MAX_AVATAR;

  return (
    <>
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-80 flex justify-center items-center z-50"
      style={{ display: onOpen ? "flex" : "none" }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl  ">
        <div className="flex justify-between items-center border-b border-gray-300 shadow-md p-2">
          <button className="text-teal-600 font-semibold text-sm hover:text-teal-800">
            ✓ Mark Complete
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* main */}
        <div className=" p-6 space-y-6 overflow-y-auto transform transition-all max-h-[80vh]">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer overflow-hidden">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            {/* Cover Image */}
            {formData.coverImage ? (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={formData.coverImage}
                  alt="Task Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition"
                  title="Remove Cover Image"
                >
                  <FaTimes size={10} />
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Change Cover
                </button>
              </div>
            ) : (
              <div
                className="bg-gray-100 h-32 rounded-lg flex items-center justify-center text-gray-500 cursor-pointertransition"
                onClick={() => fileInputRef.current.click()} 
              >
                <FaPaperclip className="mr-2" /> Add Cover Image
              </div>
            )}
          </div>

          {/* Judul Utama */}
          <div className="flex items-center space-x-2">
            <FaPencilAlt size={14} className="text-gray-400 cursor-pointer" />
            <input
              type="text"
              placeholder="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-2xl font-bold text-gray-800 outline-none border-b border-white focus:border-gray-300 transition duration-150"
            />
          </div>

          {/* Assignee Stack */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Assignee
            </label>
            <div className="flex items-center gap-2">
              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  title={member.name}
                  className="w-10 h-10 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                  onClick={handleOpenAssigneePicker}
                >
                  {member.name[0]}
                </div>
              ))}

              <div
                className="w-10 h-10 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                onClick={handleOpenAssigneePicker}
              >
                {otherCount > 0 ? `+${otherCount}` : "+"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <label className="text-gray-500">Due Date</label>
              <div className="flex items-center border rounded p-2 bg-gray-50">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate || ""}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">Column</label>
              <div className="flex items-center border rounded p-2 bg-gray-50 justify-between">
                <span>{useTaskStore.getState().columns[columnId].title}</span>
                <FaChevronDown size={10} className="text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">Label</label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-gray-50"
              >
                {LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-gray-50"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
              <FaPencilAlt size={12} className="inline ml-1 text-gray-400" />
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md h-32 resize-none"
              placeholder="Detail lengkap mengenai task..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Attachments</h3>
            <div className="border border-dashed p-4 rounded-lg text-center text-gray-500">
              <FaFolderOpen size={24} className="mx-auto mb-2" />
              Drop & Drag files here or{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                browse from device
              </span>
            </div>

            {formData.attachments &&
              formData.attachments.map((file, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-600 flex items-center"
                >
                  <FaPaperclip className="mr-2" /> {file}
                </p>
              ))}
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold text-gray-800">Check List</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 block">
              {completedSubtasks}/{totalSubtasks} checked
            </span>

            <div className="space-y-2">
              {(formData.checklist || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center group p-1 hover:bg-gray-50 rounded"
                >
                  <button
                    onClick={() => handleToggleChecklist(item.id)}
                    type="button"
                    className="mr-3 text-teal-600 hover:text-teal-800"
                  >
                    {item.completed ? (
                      <FaCheckSquare size={18} />
                    ) : (
                      <FaSquare size={18} />
                    )}
                  </button>
                  <span
                    className={`flex-grow text-sm ${
                      item.completed
                        ? "line-through text-gray-500"
                        : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubtask();
                  }
                }}
                placeholder="+ Add subtask"
                className="flex-grow p-2 border rounded-md text-sm outline-none focus:border-teal-400"
              />
              <button
                onClick={handleAddSubtask}
                className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Activity
            </h3>
            <p className="text-sm text-gray-500">Tidak ada aktivitas.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-2 ">
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
      
    </div>
<AssigneePickerModal
            isOpen={isAssigneePickerOpen}
            onClose={() => setIsAssigneePickerOpen(false)}
            currentAssignees={formData.assignees}
            onSave={(newAssignees) => {
                setFormData((prev) => ({ ...prev, assignees: newAssignees }));
                setIsAssigneePickerOpen(false);
            }}
        />
    </>
    
  );
  
}
