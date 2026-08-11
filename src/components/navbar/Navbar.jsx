import React from "react";
import { FaLock, FaChevronDown, FaUserPlus, FaFilter, FaFolderOpen } from "react-icons/fa6";
import { FaSistrix } from "react-icons/fa6";
import { TEAM_MEMBERS, useTaskStore } from "../../store/taskStore";




export default function Navbar() {
  const MAX_AVATAR = 3;
  const visibleMembers = TEAM_MEMBERS.slice(0, MAX_AVATAR);
  const hiddenCount = TEAM_MEMBERS.length - MAX_AVATAR;

  const searchTerm = useTaskStore(state => state.searchTerm);
  const setSearchTerm = useTaskStore(state => state.setSearchTerm);
  const filters = useTaskStore(state => state.filters);
  const setFilters = useTaskStore(state => state.setFilters);
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const isFilterActive = filters.assignee !== '' || filters.label !== '' || filters.dueDate !== '';

  const clearFilters = () => {
    setFilters({ assignee: '', label: '', dueDate: '' });
  };
    

  return (
    <div className="fixed bg-white w-full z-10 shadow-md">
      <main className="flex flex-wrap justify-between items-center p-4 border-b border-gray-300 gap-4">   
        <div className="flex items-center gap-4 w-full md:w-auto order-1"> 
          <div className="flex items-center gap-2 min-w-max">
            <FaLock className="text-gray-600 w-4 h-4" />
            <h2 className="text-xl font-semibold whitespace-nowrap">Adhivasindo</h2>
            <FaChevronDown className="text-gray-600 w-4 h-4" />
          </div>
          
          {/* User Avatars */}
          <div className="flex -space-x-3 min-w-max">
            {visibleMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-2 hover:bg-gray-100 rounded transition"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-purple-200 flex items-center justify-center text-xs font-semibold">
                  <img
                    src={member.avatar}
                    alt={`${member.name}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
            {hiddenCount > 0 && (
              <div
                className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 
                                  flex items-center justify-center text-white font-bold text-sm 
                                  ring-2 ring-white"
              >
                +{hiddenCount}
              </div>
            )}
          </div>

          <div className="hidden md:block"> 
            <button className="flex items-center bg-gray-200 p-2 rounded-md gap-2 cursor-pointer active:scale-90 hover:bg-gray-300 transition">
              <FaUserPlus />
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end items-center order-2 md:w-auto"> 
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 p-1.5 md:p-2 rounded-md cursor-pointer transition text-sm ${isFilterActive ? 'bg-teal-100 text-teal-700 font-semibold' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaFilter />
              <span className="hidden md:inline">Filter</span> 
              {isFilterActive && <span className="w-2 h-2 rounded-full bg-teal-500 ml-1"></span>}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700">Filters</h4>
                  {isFilterActive && (
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Assignee</label>
                  <select 
                    value={filters.assignee}
                    onChange={(e) => setFilters({ assignee: e.target.value })}
                    className="w-full border rounded p-1.5 text-sm bg-gray-50 focus:outline-none focus:border-teal-400"
                  >
                    <option value="">Any Assignee</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Label</label>
                  <select 
                    value={filters.label}
                    onChange={(e) => setFilters({ label: e.target.value })}
                    className="w-full border rounded p-1.5 text-sm bg-gray-50 focus:outline-none focus:border-teal-400"
                  >
                    <option value="">Any Label</option>
                    <option value="Feature">Feature</option>
                    <option value="Bug">Bug</option>
                    <option value="Issue">Issue</option>
                    <option value="Undefined">Undefined</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Due Date</label>
                  <input 
                    type="date"
                    value={filters.dueDate}
                    onChange={(e) => setFilters({ dueDate: e.target.value })}
                    className="w-full border rounded p-1.5 text-sm bg-gray-50 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-1.5 bg-gray-200 p-1.5 md:p-2 rounded-md cursor-pointer active:scale-90 hover:bg-gray-300 transition text-sm">
            <FaFolderOpen />
            <span className="hidden md:inline">Export/Import</span> 
          </button>
          
          <div className="relative flex-grow min-w-0 max-w-sm md:flex-grow-0"> 
            <FaSistrix className="absolute w-5 h-5 top-2 left-2 text-gray-500" />
            <input
              type="text"
              className="bg-gray-200 p-2 w-full rounded-md outline-none pl-10 text-sm focus:bg-white focus:border focus:border-teal-400 transition"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}