import React, { useEffect, useState } from 'react'
const BASE_URL = import.meta.env.VITE_API_URL;

import { IndianRupee, ListOrdered } from 'lucide-react';
import SACustomCalendar from './SACustomCalender';

const SuperAdminDashboard = () => {

  const getCurrentMonthStart = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [totalAdmin, setTotalAdmin] = useState(0);
  const [startDate, setStartDate] = useState(getCurrentMonthStart());
  const [endDate, setEndDate] = useState(getToday());
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchAdmin = async () => {
    const token = localStorage.getItem("superAdminToken");

    let url = `${BASE_URL}/super-admin/admins`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setTotalAdmin(data.totalAdmin || 0);
  };

  
  const fetchAmount = async () => {
    const token = localStorage.getItem("superAdminToken");

    const res = await fetch(`${BASE_URL}/super-admin/total-amount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    setTotalAmount(data.totalAmount);
  };


  useEffect(() => {
    fetchAmount();
  }, []);

  useEffect(() => {
    fetchAdmin();
  }, [startDate, endDate]);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
          Overview Dashboard
        </h1>
        <p className="text-sm font-medium text-slate-500">
          High-level overview of the system.
        </p>
      </div>

      {/* filters */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 mb-8 overflow-visible">
        <div className='w-full sm:w-1/2'>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Start Date</p>
          <SACustomCalendar
            value={startDate}
            onChange={(val) => setStartDate(val)}
            placeholder="Start Date"
          />
        </div>
  
        <div className='w-full sm:w-1/2'>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">End Date</p>
          <SACustomCalendar
            value={endDate}
            onChange={(val) => setEndDate(val)}
            placeholder="End Date"
          />
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="relative overflow-hidden flex flex-col items-start gap-4 w-full p-6 bg-white rounded-2xl border-y border-r border-l-4 border-slate-200 border-l-indigo-500 shadow-sm hover:shadow-md transition-all duration-300">
          <ListOrdered className="absolute -bottom-4 -right-4 text-indigo-50/50 w-32 h-32 rotate-12 pointer-events-none" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 z-10">
            <ListOrdered size={22} className="text-indigo-600" />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              TOTAL ADMIN
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {totalAdmin}
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden flex flex-col items-start gap-4 w-full p-6 bg-white rounded-2xl border-y border-r border-l-4 border-slate-200 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300">
          <IndianRupee className="absolute -bottom-4 -right-4 text-emerald-50/50 w-32 h-32 rotate-12 pointer-events-none" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 z-10">
            <IndianRupee size={22} className="text-emerald-600" />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              TOTAL REVENUE
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center">
              ₹ {totalAmount}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SuperAdminDashboard