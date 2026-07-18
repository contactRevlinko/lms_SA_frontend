import React, { useEffect, useState } from "react";
import { IndianRupee, Users, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminPaymentHistory = () => {
    const [payments, setPayments] = useState([]);

    const getAllPayments = async () => {
        try {
            const superAdminToken = localStorage.getItem("superAdminToken");

            const res = await fetch(`${BASE_URL}/payment/all-admin-package`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${superAdminToken}`,
                },
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Error fetching payments");
                return;
            }

            setPayments(result.data || []);
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        }
    };

    useEffect(() => {
        getAllPayments();
    }, []);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                    Payment History
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    All admin package payment details
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {payments.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                        <Users className="mx-auto mb-3 w-12 h-12 text-slate-300" />
                        <h3 className="text-xl font-semibold text-slate-700">
                            No Payments Found
                        </h3>
                        <p className="text-slate-500 mt-2 text-sm">
                            Payment history will appear here.
                        </p>
                    </div>
                ) : (
                    payments.map((payment, index) => (
                        <div
                            key={payment._id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
                                <div className="min-w-0 pr-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{index + 1}</span>
                                        <h3 className="text-base font-bold text-slate-900 capitalize truncate">
                                            {payment.adminId?.name || "Unknown Admin"}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Mail size={13} className="shrink-0" />
                                        <span className="truncate">{payment.adminId?.email || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Phone size={13} className="shrink-0" />
                                        <span className="truncate">{payment.adminId?.phone || "-"}</span>
                                    </div>
                                </div>
                                <span
                                    className={`shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                        payment.paymentVerified
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                            : "bg-amber-50 text-amber-600 border border-amber-200"
                                    }`}
                                >
                                    {payment.paymentVerified ? "Verified" : "Pending"}
                                </span>
                            </div>

                            {/* Plan Info */}
                            <div className="grid grid-cols-2 gap-4 mb-5 bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Package</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {payment.packageName || payment.packageId?.packageName || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Duration</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {payment.packageId?.duration || "-"}
                                    </p>
                                </div>
                                <div className="col-span-2 flex items-center justify-between pt-3 border-t border-slate-200/60 mt-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount Paid</p>
                                    <div className="flex items-center text-lg font-bold text-indigo-600">
                                        <IndianRupee size={16} className="mr-0.5" />
                                        {payment.packagePrice || payment.packageId?.price || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-auto">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Payment Date</p>
                                    <p className="text-xs font-semibold text-slate-700">
                                        {payment.paymentDate
                                            ? new Date(payment.paymentDate).toLocaleDateString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry Date</p>
                                    <p className="text-xs font-semibold text-slate-700">
                                        {payment.adminId?.packageExpiryDate
                                            ? new Date(payment.adminId.packageExpiryDate).toLocaleDateString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Order ID</p>
                                    <p className="font-mono text-xs text-slate-600 truncate bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
                                        {payment.razorpayOrderId || "-"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Payment ID</p>
                                    <p className="font-mono text-xs text-slate-600 truncate bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
                                        {payment.razorpayPaymentId || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SuperAdminPaymentHistory;