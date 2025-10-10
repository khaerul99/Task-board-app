import React, { useState, useCallback } from "react";
import Layout from "./components/layout/Layout";
import Board from "./components/board/Board";
import { useTaskStore } from "./store/taskStore";
import TaskModal from "./components/modal/TaskModal";
import Swal from "sweetalert2";


function App() {
  const { updateTask ,deleteTask, addTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [isNewTask, setIsNewTask] = useState(false)

  const handleEditTask = (task, columnId) => {
    setCurrentTask(task);
    setCurrentColumnId(columnId);
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
        
        Swal.fire({ 
            icon: 'success', 
            title: 'Task Added!', 
            text: `Tugas berhasil dibuat.`, 
            showConfirmButton: false, 
            timer: 1500, 
            toast: true, 
            position: 'top-end' 
        });
        
    } else {
        updateTask(updateTaskData.id, updateTaskData); 
        
        Swal.fire({
            icon: 'success', 
            title: 'Task Updated!', 
            text: `Tugas berhasil diperbarui.`, 
            showConfirmButton: false, 
            timer: 1500, 
            toast: true, 
            position: 'top-end' 
        });
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
