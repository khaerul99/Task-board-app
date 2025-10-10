
import Column from '../column/Column';
import { DndContext, closestCorners, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { useTaskStore } from '../../store/taskStore';
import { FaPlus } from 'react-icons/fa'; 
import { useState } from 'react';
import ColumnModal from '../modal/ColumnModal';
import Swal from 'sweetalert2';





export default function Board({onEditTask, onOpen}) {
    const {columns, columnOrder, handleDragAndDrop, getFilteredTasks, addColumn, updateColumn, deleteColumn} = useTaskStore();
    const sensors = useSensors(useSensor(PointerSensor));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [currentColumn, setCurrentColumn] = useState(null);

    const handleOpenColumnModal = (columnData = null) => {
        setCurrentColumn(columnData);
        setIsColumnModalOpen(true);
    };

    const handleDeleteColumn = (columnId, columnTitle) => {
        Swal.fire({
            title: `Are you sure to delete "${columnTitle}"?`,
            text: "All tasks in this column will also be deleted and cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteColumn(columnId);
                
                
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `Kolom "${columnTitle}" berhasil dihapus.`,
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true, 
                    position: 'top-end'
                });
            }
        });
    };

     const handleSaveColumn = (title) => {
        const isEditing = currentColumn && currentColumn.id;

        if (isEditing) {
            updateColumn(currentColumn.id, title);
            Swal.fire({
                icon: 'success',
                title: 'Column Updated!',
                text: `Kolom "${title}" berhasil diperbarui.`,
                showConfirmButton: false, 
                timer: 1500, 
                toast: true, 
                position: 'top-end' 
            });
        } else {
            addColumn(title);
            Swal.fire({
                icon: 'success',
                title: 'Column Added!',
                text: `Kolom "${title}" berhasil ditambahkan.`,
                showConfirmButton: false, 
                timer: 1500, 
                toast: true, 
                position: 'top-end' 
            });
        }
        setIsColumnModalOpen(false);
        setCurrentColumn(null); 
    };
  

    const handleDragEnd = (e) => {
        const {active, over} = e;
        if(!over) return;

        const activeId = active.id;
        const overId = over.id;

        const {columns, columnOrder} = useTaskStore.getState();

        const sourceColumnId = columnOrder.find(colId => columns[colId].taskIds.includes(activeId));
        const destinationColumnId = columnOrder.find(colId => columns[colId].taskIds.includes(overId)) || overId;
        

        if(!sourceColumnId || !destinationColumnId) return;
        handleDragAndDrop(activeId, sourceColumnId, destinationColumnId, overId);
    }

  

  return (
    <>
       <ColumnModal
            onOpen={isColumnModalOpen}
            onClose={() => setIsColumnModalOpen(false)}
            onSave={handleSaveColumn}
            currentColumn={currentColumn} 
        />
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="flex space-x-7 ">
                    <div className='flex overflow-x-auto space-x-4 pb-4 h-screen'>
                    {
                        columnOrder.map((columnId) => {
                            const column = columns[columnId];
                            const filteredTasks = getFilteredTasks(columnId);
                            return <Column key={column.id} column={column} tasks={filteredTasks} onEditTask={onEditTask} onOpen={onOpen} openColumnModal={handleOpenColumnModal } onDeleteColumn={handleDeleteColumn}/>
                        }
                    )
                    }
                      <div className="w-96 p-3 rounded-lg flex-shrink-0">
                         <button 
                            onClick={handleOpenColumnModal}
                            className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition border-dashed border-2 border-gray-300"
                         >
                            <FaPlus className="mr-2"/> Add Another Column
                         </button>
                    </div>   
                    </div>
                   
                    
                </div>
        </DndContext>

    </>
  )
}
