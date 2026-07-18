import React from "react";
import { BadgeInfo } from "lucide-react";

const SAdeletepopup = ({ onClose, onDelete }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-[90%] md:w-[420px] text-center p-6 rounded-2xl shadow-xl">
                <BadgeInfo className="mb-3 w-11 h-11 p-2 rounded-full mx-auto text-red-600 bg-red-100" />

                <h1 className="font-bold text-xl text-gray-800">
                    Delete This Item ?
                </h1>

                <p className="text-gray-600 mt-2">
                    Are you sure do you want to delete this element ?
                </p>
                <p className="text-gray-600">
                    This action is final.
                </p>

                <div className="flex gap-4 mt-5">
                    <button
                        onClick={onClose}
                        className="w-full border border-gray-400 px-4 py-2 rounded-xl hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="w-full bg-red-500 px-4 py-2 rounded-xl text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SAdeletepopup;