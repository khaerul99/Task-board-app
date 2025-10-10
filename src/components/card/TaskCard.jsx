import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineTimer } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { TEAM_MEMBERS, MAX_AVATAR } from "../../store/taskStore";

export default function TaskCard({ task, columnId, onEditTask }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
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

  return (
    <div
      key={task.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEditTask(task, columnId)}
    >
      <div className="p-3 mb-2  bg-blue-100 rounded-lg shadow-md hover:shadow-lg transition duration-200">
        <div className="flec flex-col space-y-4">
          <div className="flex justify-center w-full">
            <div className="w-60 h-auto ">
            <img src={task.coverImage} alt="" className="w-full h-full "/>
            </div>
          </div>
          <h4 className="font-semibold text-sm mb-4 bg-red-200 p-2 text-center w-1/4 rounded-4xl text-red-600 ">
            {task.label}
          </h4>
          <div className="text-[20px] text-gray-500">
            <span>{task.title}</span>
          </div>
          <div>
            {task.description}
          </div>

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

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 rounded-4xl bg-green-200 p-2 text-[12px]">
              <MdOutlineTimer />
              <span>{task.dueDate || ""}</span>
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
