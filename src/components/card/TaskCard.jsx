import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineTimer } from "react-icons/md";
import { FaRegCheckSquare, FaPaperclip } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { TEAM_MEMBERS, MAX_AVATAR } from "../../store/taskStore";

export default function TaskCard({ task, columnId, onEditTask, isOverlay }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: isOverlay ? undefined : CSS.Translate.toString(transform),
    transition: isOverlay ? undefined : transition,
    cursor: isOverlay || isDragging ? "grabbing" : "grab",
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    position: "relative",
    zIndex: isOverlay || isDragging ? 999 : 1,
    boxShadow: isOverlay ? "0 10px 20px rgba(0,0,0,0.2)" : undefined,
  };

  // Checklist Progress
  const checklist = task.checklist || [];
  const total = checklist.length;
  const completed = checklist.filter((c) => c.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const taskAssignees = Array.isArray(task.assignees) ? task.assignees : [];
  const assignedMembers = taskAssignees
    .map((assigneeId) =>
      TEAM_MEMBERS.find((member) => member.id === assigneeId)
    )
    .filter((m) => m);

  const visibleMembers = assignedMembers.slice(0, MAX_AVATAR);
  const hiddenCount = assignedMembers.length - MAX_AVATAR;

  const getLabelColors = (label) => {
    switch (label) {
      case "Feature":
        return "bg-blue-200 text-blue-700";
      case "Bug":
        return "bg-red-200 text-red-600";
      case "Issue":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div
      key={task.id}
      ref={isOverlay ? null : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      onClick={isOverlay ? undefined : () => onEditTask(task, columnId)}
    >
      <div className="p-3 mb-2  bg-blue-100/70 rounded-lg shadow-md hover:shadow-lg transition duration-200">
        <div className="flec flex-col space-y-4">
          <div className="flex justify-center w-full">
            <div className="w-60 h-auto ">
            <img src={task.coverImage} alt="" className="w-full h-full "/>
            </div>
          </div>
          <h4 className={`font-semibold text-sm mb-4 px-3 py-1 text-center w-fit rounded-full ${getLabelColors(task.label)}`}>
            {task.label}
          </h4>

          {total > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {progress}% Complete
              </div>
            </div>
          )}
          
          <div className="text-[20px] text-gray-500">
            <span>{task.title}</span>
          </div>
          <div>
            {task.description}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-3 text-gray-500 text-xs font-semibold">
              {task.dueDate && (
                <div className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2.5 py-1.5">
                  <MdOutlineTimer size={14} />
                  <span>{task.dueDate}</span>
                </div>
              )}

              

              {total > 0 && (
                <div className={`flex items-center gap-1 ${completed === total ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaRegCheckSquare size={14} />
                  <span>{completed}/{total}</span>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1 text-gray-500">
                  <FaPaperclip size={14} />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
            
            <div className="flex -space-x-3 ">
              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded transition"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                   
                    {member.avatar ? (
                      
                      <img
                        src={member.avatar}
                        alt={`${member.name}'s avatar`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{member.name[0]}</span>
                    )}
                  </div>
                </div>
              ))}

              {hiddenCount > 0 && (
                <div
                  className="w-8 h-8 rounded-full border-1 border-white bg-blue-400 
                                flex items-center justify-center text-white font-bold text-sm 
                                ring-1 ring-white"
                >
                  + {hiddenCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
