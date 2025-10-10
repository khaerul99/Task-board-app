import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

export  const TEAM_MEMBERS = [
    { id: 'user1', name: 'Sahrul', avatar: 'assets/users/user1.jpg' },
    { id: 'user2', name: 'Rizki', avatar: 'assets/users/user2.jpg' },
    { id: 'user3', name: 'Andi', avatar: 'assets/users/user3.jpg' },
    { id: 'user4', name: 'Budi', avatar: 'assets/users/user4.jpg' },
    { id: 'user5', name: 'Cici', avatar: 'assets/users/user5.jpg' },
];

export const MAX_AVATAR = 3;

// ini data awal
const initialTaskData = {
  tasks: {
    "task-5b1f3d": {
      id: "task-5b1f3d",
      title: "Take out the garbage",
      avatar: "assets/users/user1.jpg",
      assignees: ['user1', 'user2'],
      dueDate: "2023-08-10",
      label: "Feature",
      priority: "hight",
      checklist: [
        { id: uuidv4(), text: "define initialState", completed: true },
      ],
      attachments: [],
    },
  },
  columns: {
    "column-1": { id: "column-1", title: "To Do", taskIds: ["task-5b1f3d"] },
    "column-2": { id: "column-2", title: "In Progress", taskIds: [] },
    "column-3": { id: "column-3", title: "Done", taskIds: [] },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const getInitialState = () => {
  try {
    const storedData = localStorage.getItem("TaskBoard");
    return storedData ? JSON.parse(storedData) : initialTaskData;
  } catch (e) {
    console.error("Could not load state from localStorage:", e);
    return initialTaskData;
  }
};

export const useTaskStore = create((set, get) => ({
    ...getInitialState(),
    searchTerm: '',

  // menambah task baru
  addTask: (columnId, initialTaskData) =>
    set((state) => {
      
      const newTaskId = `task-${uuidv4().slice(0, 6)}`;
      const newTask = { id: newTaskId, ...initialTaskData };

      return {
        tasks: { ...state.tasks, [newTaskId]: newTask },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: [...state.columns[columnId].taskIds, newTaskId],
          },
        },
      };
    }),

  // update task
  updateTask: (taskId, updatedTaskData) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          ...updatedTaskData,
        },
      },
    })),

  // menghapus task
  deleteTask: (taskId, columnId) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[taskId];

      const newColumnTaskIds = state.columns[columnId].taskIds.filter(
        (id) => id !== taskId
      );

      return {
        tasks: newTasks,
        columns: {
          ...state.columns,
          [columnId]: { ...state.columns[columnId], taskIds: newColumnTaskIds },
        },
      };
    }),


    // addColumn
    addColumn: (title) => 
      set((state) => {
        const newColumnIid = `column-${uuidv4().slice(0, 6)}`
        const newColumn = {
          id: newColumnIid,
          title: title || 'New Column',
          taskIds: [],
        };

        return {
          columns: {
            ...state.columns, [newColumnIid]: newColumn
          },
          columnOrder: [...state.columnOrder, newColumnIid]
        };
      }),

      // edit column
       updateColumn: (columnId, newTitle) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          title: newTitle,
        },
      },
    })),

    // delete

     deleteColumn: (columnId) =>
    set((state) => {
      const columnToDelete = state.columns[columnId];
      if (!columnToDelete) return state;

      // 1. Hapus semua tasks yang ada di kolom ini
      const newTaskIds = columnToDelete.taskIds;
      const newTasks = { ...state.tasks };
      newTaskIds.forEach((taskId) => {
        delete newTasks[taskId]; 
      });

      // Hapus objek kolom dari state.columns
      const newColumns = { ...state.columns };
      delete newColumns[columnId];

      // Hapus ID kolom dari state.columnOrder
      const newColumnOrder = state.columnOrder.filter(
        (id) => id !== columnId
      );

      return {
        tasks: newTasks,
        columns: newColumns,
        columnOrder: newColumnOrder,
      };
    }),

  // memindahkan task
  handleDragAndDrop: (activeId, sourceColumnId, destinationColumnId, overId) =>
    set((state) => {
      const sourceTasksIds = state.columns[sourceColumnId].taskIds;
      let destinationTaskIds = state.columns[destinationColumnId].taskIds;

      if (sourceColumnId === destinationColumnId) {
        const oldIndex = sourceTasksIds.indexOf(activeId);
        const newIndex = sourceTasksIds.indexOf(overId);
        const newTaskIds = arrayMove(sourceTasksIds, oldIndex, newIndex);

        return {
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...state.columns[sourceColumnId],
              taskIds: newTaskIds,
            },
          },
        };
      } else {
        const newSourceTaskIds = sourceTasksIds.filter((id) => id !== activeId);
        const overIndex = destinationTaskIds.indexOf(overId);
        const dropIndex =
          overIndex !== -1 ? overIndex : destinationTaskIds.length;

        let newDestinationTaskIds = [...destinationTaskIds];
        newDestinationTaskIds.splice(dropIndex, 0, activeId);

        return {
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...state.columns[sourceColumnId],
              taskIds: newSourceTaskIds,
            },
            [destinationColumnId]: {
              ...state.columns[destinationColumnId],
              taskIds: newDestinationTaskIds,
            },
          },
        };
      }
    }),


    setSearchTerm: (term) => set({ searchTerm: term }),

    getFilteredTasks: (columnId) => {
    const state = get(); 
    const column = state.columns[columnId];
    
    if(!column || !state.tasks) return [];
    
    const taskIdsInColumn = column.taskIds;
    const lowerCaseSearch = state.searchTerm.toLowerCase();
    
    return taskIdsInColumn
        .map(taskId => state.tasks[taskId]) 
        .filter(task => { 
            
            if (!task) return false;

            
            const titleMatch = !state.searchTerm || (task.title && task.title.toLowerCase().includes(lowerCaseSearch));
            
            return titleMatch;
        });
}
}));


// Local Storage
useTaskStore.subscribe(
  (state) => {
    localStorage.setItem('TaskBoard', JSON.stringify({
        tasks: state.tasks,
        columns: state.columns,
        columnOrder: state.columnOrder
    }));
  },

  (state) => [state.tasks, state.columns, state.columnOrder]
);