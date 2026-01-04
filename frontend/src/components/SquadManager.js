import React, { useState } from 'react';
import { useSquad } from '../context/SquadContext';
import { IoPeopleSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

const SquadManager = () => {
    const { squadId, joinSquad, leaveSquad } = useSquad();
    const [showModal, setShowModal] = useState(false);
    const [inputCode, setInputCode] = useState("");

    // Generate a random 6-digit code for the Squad
    const handleCreateSquad = () => {
        const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
        joinSquad(newId);
        toast.success(`Squad Created! Code: ${newId}`);
    };

    const handleJoinSquad = () => {
        if (inputCode.length === 6) {
            joinSquad(inputCode.toUpperCase());
            setShowModal(false);
            toast.success("Joined the Squad!");
        } else {
            toast.error("Please enter a valid 6-digit code");
        }
    };

    return (
        <div className="relative">
            {/* The Toggle Button on Navbar */}
            <button 
                onClick={() => setShowModal(!showModal)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 transition-all ${
                    squadId ? "border-green-500 text-green-600 bg-green-50" : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
            >
                <IoPeopleSharp className="text-xl"/>
                <span className="text-sm font-medium">{squadId ? "Squad Active" : "Shop with Friend"}</span>
            </button>

            {/* Simple Dropdown/Modal */}
            {showModal && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-lg p-4 z-50 border border-slate-200">
                    {!squadId ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-slate-500 font-medium">Start a shared shopping session</p>
                            <button 
                                onClick={handleCreateSquad}
                                className="bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700"
                            >
                                Create New Squad
                            </button>
                            <div className="flex items-center gap-2">
                                <hr className="flex-grow"/> <span className="text-xs text-slate-400">OR</span> <hr className="flex-grow"/>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit Code"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="border p-2 text-sm rounded outline-none uppercase"
                                maxLength={6}
                            />
                            <button 
                                onClick={handleJoinSquad}
                                className="border border-red-600 text-red-600 text-sm py-2 rounded hover:bg-red-50"
                            >
                                Join Squad
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-bold text-slate-700">Squad ID: <span className="text-red-600">{squadId}</span></p>
                            <p className="text-xs text-slate-500">Share this code with your friend to shop together!</p>
                            <button 
                                onClick={leaveSquad}
                                className="bg-slate-800 text-white text-sm py-2 rounded hover:bg-slate-900 mt-2"
                            >
                                Leave Squad
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SquadManager;