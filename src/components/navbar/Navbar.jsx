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
    
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 p-1.5 md:p-2 rounded-md cursor-pointer transition text-sm ${isFilterActive ? 'bg-teal-100 text-teal-700 font-semibold' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaFilter />
              <span className="hidden md:inline">Filter</span> 
              {isFilterActive && <span className="w-2 h-2 rounded-full bg-teal-500 ml-1"></span>}
            </button>

            <div className={`absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-5 space-y-5 transition-all origin-top-right duration-200 ease-out ${isFilterOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm tracking-wide">Filters</h4>
                  {isFilterActive && (
                    <button onClick={clearFilters} className="text-xs text-rose-500 font-medium hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors">
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Assignee</label>
                  <div className="relative">
                    <select 
                      value={filters.assignee}
                      onChange={(e) => setFilters({ assignee: e.target.value })}
                      className="w-full appearance-none border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Any Assignee</option>
                      {TEAM_MEMBERS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <FaChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Label</label>
                  <div className="relative">
                    <select 
                      value={filters.label}
                      onChange={(e) => setFilters({ label: e.target.value })}
                      className="w-full appearance-none border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Any Label</option>
                      <option value="Feature">Feature</option>
                      <option value="Bug">Bug</option>
                      <option value="Issue">Issue</option>
                      <option value="Undefined">Undefined</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <FaChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date"
                    value={filters.dueDate}
                    onChange={(e) => setFilters({ dueDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  />
                </div>
              </div>
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