import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { KeyRound, ShieldCheck, Save } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";

const SuperAdminRazorpaysettin = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");

  const getSetting = async () => {
    try {
      const superAdminToken = localStorage.getItem("superAdminToken")
      const res = await fetch(`${BASE_URL}/razorpay-setting/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        }
      })
      const result = await res.json();
      if (result.success && result.data) {
        setRazorpayKeyId(result.data.razorpayKeyId || "");
        setRazorpayKeySecret(result.data.razorpayKeySecret || "");
      }
    }
    catch (err) {
      console.log(err)
    }

  }
  const saveSetting = async () => {
    if (!razorpayKeyId || !razorpayKeySecret) {
      toast.error("Key ID and Secret required");
      return;
    }

    try {
      const superAdminToken = localStorage.getItem("superAdminToken");

      const res = await fetch(`${BASE_URL}/razorpay-setting/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${superAdminToken}`,
        },
        body: JSON.stringify({
          razorpayKeyId,
          razorpayKeySecret,
        }),
      });

      const result = await res.json();
      console.log(result);
      if (result.success) {
        toast.success("Razorpay Setting Saved");
      } else {
        toast.error(result.message || "Failed to save");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
          Razorpay Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Save Razorpay Key ID and Secret. Backend will use these keys to create Razorpay order.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">API Credentials</h3>
            <p className="text-xs text-slate-500">Enter your live or test Razorpay API keys below.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Razorpay Key ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                placeholder="rzp_test_xxxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Razorpay Key Secret
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={razorpayKeySecret}
                onChange={(e) => setRazorpayKeySecret(e.target.value)}
                placeholder="Enter Razorpay Secret"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="button"
              onClick={saveSetting}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold shadow-sm shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all w-full sm:w-auto"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminRazorpaysettin