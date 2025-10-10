import React from "react";
import { FaLock, FaChevronDown, FaUserPlus, FaFilter, FaFolderOpen } from "react-icons/fa6";
import { FaSistrix } from "react-icons/fa6";
import { useTaskStore } from "../../store/taskStore";

const data = [
  { name: "John Doe", avatar: "assets/users/user1.jpg" },
  { name: "Jane Smith", avatar: "assets/users/user2.jpg" },
  { name: "Jane ", avatar: "assets/users/user3.jpg" },
  { name: "Smith", avatar: "assets/users/user4.jpg" },
  { name: "aadul", avatar: "assets/users/user5.jpg" },
];

const MAX_AVATAR = 3;

export default function Navbar({ members = data }) {
  const visibleMembers = members.slice(0, MAX_AVATAR);
  const hiddenCount = members.length - MAX_AVATAR;

  const searchTerm = useTaskStore(state => state.searchTerm);
  const setSearchTerm = useTaskStore(state => state.setSearchTerm);
    

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
          
          <button className="flex items-center gap-1.5 bg-gray-200 p-1.5 md:p-2 rounded-md cursor-pointer active:scale-90 hover:bg-gray-300 transition text-sm">
            <FaFilter />
            <span className="hidden md:inline">Filter</span> 
          </button>
          <button className="flex items-center gap-1.5 bg-gray-200 p-1.5 md:p-2 rounded-md cursor-pointer active:scale-90 hover:bg-gray-300 transition text-sm">
            <FaFolderOpen />
            <span className="hidden md:inline">Export/Import</span> 
          </button>
          
          <div className="relative flex-grow min-w-0 max-w-sm md:flex-grow-0"> 
            <FaSistrix className="absolute w-5 h-5 top-2 left-2 text-gray-500" />
            <input
              type="text"
              className="bg-gray-200 p-2 w-full rounded-md outline-0 pl-10 text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}