import React, { useState, useCallback } from "react";
import Layout from "./components/layout/Layout";
import Board from "./components/board/Board";
import { useTaskStore } from "./store/taskStore";
import TaskModal from "./components/modal/TaskModal";
import Swal from "sweetalert2";
import { Toaster, toast } from "react-hot-toast";


function App() {
  const { updateTask ,deleteTask, addTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [isNewTask, setIsNewTask] = useState(false)

  const handleEditTask = (task, columnId) => {
    setCurrentTask(task);
    setCurrentColumnId(columnId);
    setIsNewTask(false);
    setIsModalOpen(true);
  };

  const handleOpenTaskModal = (task, columnId) => {
    const isCreating = !task|| !task.id;
    setCurrentTask(task);
    setCurrentColumnId(columnId);
    setIsNewTask(isCreating);
    setIsModalOpen(true);
  };


const handleSave = useCallback((updateTaskData) => {
    
    if (isNewTask) { 
        addTask(currentColumnId, updateTaskData); 
        toast.success('Task berhasil dibuat!');
    } else {
        updateTask(updateTaskData.id, updateTaskData); 
        toast.success('Task berhasil diperbarui!');
    }
    
    setIsModalOpen(false);
    setCurrentTask(null); 
    setIsNewTask(false);
}, [isNewTask, addTask, updateTask, currentColumnId]);

  const handleDelete = (taskId, colId) => {
    deleteTask(taskId, colId);
    setIsModalOpen(false);
  };

  return (
    <>
      <Layout>
        <Toaster position="bottom-right" />
        <Board onEditTask={handleEditTask} onOpen={handleOpenTaskModal} />
        
          <TaskModal
            task={currentTask}
            columnId={currentColumnId}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            onDelete={handleDelete}
            onOpen={isModalOpen}
          />
          
      </Layout>
    </>
  );
}

export default App;
