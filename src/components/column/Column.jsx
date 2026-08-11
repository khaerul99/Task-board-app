import React, { useState } from "react";
import TaskCard from "../card/TaskCard";
import {
  FaPlus,
  FaEllipsisVertical,
  FaDownLeftAndUpRightToCenter,
  FaUpRightAndDownLeftFromCenter
} from "react-icons/fa6";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";



export default function Column({ column, tasks, onEditTask, onOpen, openColumnModal, onDeleteColumn }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

 const handleEditColumn = () => {
    openColumnModal(column);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(column.id, column.title)
  }

  const handleAddTask = () => {
    onOpen(null, column.id);
  };

  const { setNodeRef: droppableRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="h-full">
      <div 
        ref={droppableRef} 
        className={`p-3 rounded-lg flex flex-col h-full mx-2 transition-all duration-300 ${isCollapsed ? 'w-20 min-w-20 bg-gray-50 border border-gray-200' : 'w-96 min-w-64'}`}
      >
        {isCollapsed ? (
          // Collapsed View
          <div 
            className="flex flex-col items-center h-full w-full cursor-pointer hover:bg-gray-100 transition-colors rounded-md"
            onClick={() => setIsCollapsed(false)}
            title="Expand Column"
          >
             <div className="p-3 text-gray-400 mb-4">
               <FaUpRightAndDownLeftFromCenter />
             </div>
             
             {/* Vertical Text Container */}
             <div className="flex-grow flex items-center justify-center relative w-full h-full">
               <h3 
                 className="font-bold text-lg text-gray-500 whitespace-nowrap tracking-[0.2em] uppercase absolute"
                 style={{ 
                   transform: 'rotate(90deg)', 
                   transformOrigin: 'center center'
                 }}
               >
                 {column.title}
               </h3>
             </div>
             
             <div className="mt-auto p-4">
               <span className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-500 text-white font-bold shadow-md">
                 {tasks.length}
               </span>
             </div>
          </div>
        ) : (
          // Expanded View
          <>
            <div className="flex items-center mb-4 justify-between">
              <div className="flex space-x-2 items-center">
                <h3 className="font-bold text-3xl pr-2">{column.title}</h3>
                <button
                  className=" p-2 bg-blue-200 text-blue-400 rounded-md transition"
                  onClick={handleAddTask}
                >
                  <FaPlus />
                </button>
                <div className="group relative">
                <button className="p-2 text-gray-500 hover:bg-gray-200 rounded transition">
                  <FaEllipsisVertical />
                </button>
                <div className="absolute flex-col p-2 hidden group-hover:flex z-10 gap-2 bg-white shadow-2xl rounded-lg w-fit">
                  <button onClick={handleEditColumn} className="px-6 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg">Edit</button>
                  <button onClick={handleDeleteColumn} className="px-6 py-2 bg-red-200 hover:bg-red-300 rounded-lg">delete</button>
                </div>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => setIsCollapsed(true)} 
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded transition"
                  title="Collapse Column"
                >
                  <FaDownLeftAndUpRightToCenter />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto min-h-20">
              <SortableContext items={tasks.map((task) => task.id)}>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEditTask={onEditTask} columnId={column.id} />
                ))}
              </SortableContext>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
