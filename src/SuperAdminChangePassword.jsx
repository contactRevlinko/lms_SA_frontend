import React, { useState } from "react";
import { MoveRight, X, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminChangePassword = ({ adminData, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const superAdminToken = localStorage.getItem("superAdminToken");

      const res = await fetch(`${BASE_URL}/super-admin/update-admin-password/${adminData._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to update password");
        return;
      }

      toast.success("Admin password updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-visible">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6 border-b border-slate-100 pb-6">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl text-slate-800 mb-1">
                Change Password
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Update password for <span className="font-bold text-slate-700">{adminData?.name}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="font-medium mb-1.5 text-slate-700 text-sm">New Password</p>
              <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400 pr-8"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                />
                {showNewPassword ? (
                  <Eye
                    className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    size={18}
                    onClick={() => setShowNewPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    size={18}
                    onClick={() => setShowNewPassword(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <p className="font-medium mb-1.5 text-slate-700 text-sm">Confirm Password</p>
              <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400 pr-8"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                />
                {showConfirmPassword ? (
                  <Eye
                    className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    size={18}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    size={18}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl w-full transition ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
            <MoveRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminChangePassword;
