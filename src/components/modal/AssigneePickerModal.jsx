import { useEffect, useState } from "react";
import { TEAM_MEMBERS } from "../../store/taskStore";



export const AssigneePickerModal = ({ isOpen, onClose, currentAssignees, onSave }) => {
    const [selectedIds, setSelectedIds] = useState(currentAssignees || []);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(currentAssignees || []);
        }
    }, [isOpen, currentAssignees]);
    
    if (!isOpen) return null;

    const handleCheckboxChange = (memberId) => {
        setSelectedIds((prev) => {
            if (prev.includes(memberId)) {
                return prev.filter((id) => id !== memberId);
            } else {
                return [...prev, memberId];
            }
        });
    };
    
    const handleSave = () => {
        onSave(selectedIds);
        onClose();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-[60] transition-opacity"> 
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-5 border-b border-gray-100 pb-3 text-gray-800">Assign Members</h3>
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                    {TEAM_MEMBERS.map((member) => {
                        const isSelected = selectedIds.includes(member.id);
                        return (
                        <div 
                            key={member.id} 
                            onClick={() => handleCheckboxChange(member.id)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isSelected ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center flex-grow">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-4 shadow-sm overflow-hidden border-2 border-white ring-2 ring-gray-100">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name[0]
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-semibold ${isSelected ? 'text-teal-900' : 'text-gray-800'}`}>{member.name}</span>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300 bg-white'}`}>
                                {isSelected && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                        {selectedIds.length} selected
                    </span>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 hover:shadow-md transition-all active:scale-95"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};