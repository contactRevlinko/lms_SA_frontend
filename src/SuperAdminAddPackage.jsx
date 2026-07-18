import React, { useEffect, useState } from "react";
import { PackageCheck, IndianRupee, Clock, CalendarDays, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminAddPackage = ({ setAddPackageModal, getAllPackages, addPackageModal, packageToEdit }) => {
    const [form, setForm] = useState({
        packageName: packageToEdit?.packageName || "",
        description: packageToEdit?.description || "",
        price: packageToEdit?.price || "",
        duration: packageToEdit?.duration || "",
        durationInDays: packageToEdit?.durationInDays || "",
    });


    useEffect(() => {
        if (addPackageModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [addPackageModal]);


    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            if (!form.packageName || !form.price || !form.duration || !form.durationInDays) {
                toast.error("Package name, price, duration and duration days required");
                return;
            }

            const superAdminToken = localStorage.getItem("superAdminToken");
            
            const url = packageToEdit 
                ? `${BASE_URL}/package/update-package/${packageToEdit._id}`
                : `${BASE_URL}/package/create-package`;
                
            const method = packageToEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${superAdminToken}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || `Error ${packageToEdit ? 'updating' : 'creating'} package`);
                return;
            }

            toast.success(`Plan ${packageToEdit ? 'updated' : 'added'} successfully`);

            getAllPackages();
            setAddPackageModal(false);
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        }
    };



    return (
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-visible">
            <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                            {packageToEdit ? "Edit Plan" : "Create New Plan"}
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">{packageToEdit ? "Update subscription package details" : "Add new subscription package plan"}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAddPackageModal(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-medium mb-1.5 text-slate-700 text-sm">Plan Name</p>
                        <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                            <PackageCheck size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                                placeholder="Plan name"
                                name="packageName"
                                value={form.packageName}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="font-medium mb-1.5 text-slate-700 text-sm">Description</p>
                        <div className="group flex items-start gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                            <FileText size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors mt-0.5" />
                            <textarea
                                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400 resize-none"
                                placeholder="Example: 100 leads, Team management, Analytics"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium mb-1.5 text-slate-700 text-sm">Price</p>
                            <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                <IndianRupee size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                                    placeholder="Enter price"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="font-medium mb-1.5 text-slate-700 text-sm">Duration</p>
                            <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                <Clock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                                    placeholder="Monthly / Yearly"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="font-medium mb-1.5 text-slate-700 text-sm">Duration In Days</p>
                        <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                            <CalendarDays size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                                placeholder="30 / 365"
                                name="durationInDays"
                                type="number"
                                value={form.durationInDays}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="mt-8 flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl w-full bg-indigo-600 hover:bg-indigo-700 transition"
                    onClick={handleSave}
                >
                    {packageToEdit ? "Update Plan" : "Save Plan"}
                </button>
            </div>
        </div>
    );
};

export default SuperAdminAddPackage;