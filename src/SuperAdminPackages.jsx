import React, { useEffect, useState } from "react";
import {
    IndianRupee,
    CheckCircle,
    Loader2,
    Plus,
    Trash2,
    PackageOpen,
    Edit
} from "lucide-react";
import toast from "react-hot-toast";
import SAdeletepopup from "./SAdeletepopup";
import SuperAdminAddPackage from "./SuperAdminAddPackage";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletePopup, setDeletePopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [addPackageModal, setAddPackageModal] = useState(false);
    const [packageToEdit, setPackageToEdit] = useState(null);

    const getAllPackages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/package/all-package`);
            const result = await res.json();

            if (result.success) {
                setPackages(result.data);
            } else {
                toast.error(result.message || "Failed to fetch packages");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (id) => {
        try {
            const superAdminToken = localStorage.getItem("superAdminToken");

            const res = await fetch(`${BASE_URL}/package/delete-package/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${superAdminToken}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Error in deleting");
                return;
            }

            setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
            toast.success("Plan deleted successfully");
            setDeletePopup(false);
            setSelectedId(null);
            
        } catch (err) {
            console.log(err);
            toast.error("Error in deleting");
        }
    };

    useEffect(() => {
        getAllPackages();
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Packages</h1>
                    <p className="text-sm font-medium text-slate-500">
                        Manage all CRM subscription packages
                    </p>
                </div>

                <button
                    onClick={() => {
                        setPackageToEdit(null);
                        setAddPackageModal(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                    <Plus size={18} />
                    Add Package
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-72">
                    <Loader2 className="animate-spin text-indigo-600" size={42} />
                </div>
            ) : packages.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-10 text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                        <PackageOpen className="text-indigo-600" size={34} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        No packages found
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Create your first package to show on pricing page.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg._id || index}
                            className="relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                        >
                            {/* Accent border top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>

                            <div className="mb-6 pt-2">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                                    {pkg.packageName}
                                </h2>
                                <div className="flex items-baseline gap-1">
                                    <IndianRupee size={24} className="text-slate-900 font-extrabold" />
                                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{pkg.price}</span>
                                    <span className="text-slate-500 font-medium ml-1">/{pkg.duration}</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {pkg.description?.split(/,|\n/).filter(item => item.trim() !== "").map((item, index) => (
                                    <div key={index} className="flex gap-3 text-sm text-slate-700">
                                        <CheckCircle
                                            size={18}
                                            className="text-emerald-500 shrink-0 mt-0.5"
                                        />
                                        <span className="font-medium leading-relaxed">{item.trim()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setPackageToEdit(pkg);
                                            setAddPackageModal(true);
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedId(pkg._id);
                                            setDeletePopup(true);
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-red-500 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deletePopup && (
                <SAdeletepopup
                    onClose={() => {
                        setDeletePopup(false);
                        setSelectedId(null);
                    }}
                    onDelete={() => deletePlan(selectedId)}
                />
            )}

            {addPackageModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <SuperAdminAddPackage
                        addPackageModal={addPackageModal}
                        setAddPackageModal={setAddPackageModal}
                        getAllPackages={getAllPackages}
                        packageToEdit={packageToEdit}
                    />
                </div>
            )}
        </div>
    );
};

export default SuperAdminPackages;