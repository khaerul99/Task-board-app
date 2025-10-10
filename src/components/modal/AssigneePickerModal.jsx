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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]"> 
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-4">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Select Team Members</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {TEAM_MEMBERS.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <label className="flex items-center flex-grow cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-3">
                                    {member.name[0]} 
                                </div>
                                <span className="text-gray-800">{member.name}</span>
                            </label>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(member.id)}
                                onChange={() => handleCheckboxChange(member.id)}
                                className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                        Confirm ({selectedIds.length})
                    </button>
                </div>
            </div>
        </div>
    );
};