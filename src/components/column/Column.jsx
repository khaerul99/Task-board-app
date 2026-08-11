import React from "react";
import TaskCard from "../card/TaskCard";
import {
  FaPlus,
  FaEllipsisVertical,
  FaDownLeftAndUpRightToCenter,
} from "react-icons/fa6";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";



export default function Column({ column, tasks, onEditTask, onOpen, openColumnModal, onDeleteColumn }) {

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
    <div>
      <div className="w-96 p-3 rounded-lg flex flex-col h-full mx-2 min-w-64 ">
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
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded transition">
              <FaDownLeftAndUpRightToCenter />
            </button>
          </div>
        </div>

        <div ref={droppableRef} className="flex-grow overflow-y-auto min-h-20">
          <SortableContext items={tasks.map((task) => task.id)}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEditTask={onEditTask} columnId={column.id} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
