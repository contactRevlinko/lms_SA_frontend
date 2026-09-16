import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;
import { HandCoins, Icon, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import SAdeletepopup from "./SAdeletepopup";
import SADropdown from "./SADropdown";
import SuperAdminAddAdmin from "./SuperAdminAddAdmin";
import SuperAdminEditAdmin from "./SuperAdminEditAdmin";
import SuperAdminChangePassword from "./SuperAdminChangePassword";
import { Pencil, Key } from "lucide-react";

const SuperAdminMangement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [packageFilter, setPackageFilter] = useState("All");
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [editAdminData, setEditAdminData] = useState(null);
  const [passwordAdminData, setPasswordAdminData] = useState(null);

  const fetchAmount = async () => {
    const token = localStorage.getItem("superAdminToken");

    try {
      const res = await fetch(`${BASE_URL}/super-admin/total-amount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("superAdminToken");
        localStorage.removeItem("superAdminUser");
        toast.error("Session expired. Please log in again.");
        navigate("/");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setTotalAmount(data.totalAmount);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdmin = async () => {
    const superAdminToken = localStorage.getItem("superAdminToken");

    try {
      const res = await fetch(`${BASE_URL}/super-admin/admins`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("superAdminToken");
        localStorage.removeItem("superAdminUser");
        toast.error("Session expired. Please log in again.");
        navigate("/");
        return;
      }

      const adminData = await res.json();
      console.log(adminData, "adminData");
      if (adminData.success) {
        setAdmins(adminData.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (adminId) => {
    console.log("admin ID", adminId);
    const superAdminToken = localStorage.getItem("superAdminToken");

    try {
      const res = await fetch(`${BASE_URL}/super-admin/admin/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      toast.success("Admin deleted successfully");
      setDeletePopup(false);
      setSelectedId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAdmins = admins?.filter((admin) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      admin.name?.toLowerCase().includes(searchText) ||
      admin.email?.toLowerCase().includes(searchText) ||
      admin.phone?.includes(search);

    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && admin.isActive) ||
      (statusFilter === "Inactive" && !admin.isActive);

    const matchPackage =
      packageFilter === "All" ||
      packageFilter === "All Package" ||
      (packageFilter === "ActivePackage" && admin.subscriptionStatus === "active") ||
      (packageFilter === "InactivePackage" && admin.subscriptionStatus === "inactive") ||
      (packageFilter === "ExpiredPackage" && admin.subscriptionStatus === "expired");

    return matchSearch && matchStatus && matchPackage;
  });

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const superAdminToken = localStorage.getItem("superAdminToken");

      const res = await fetch(`${BASE_URL}/super-admin/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${superAdminToken}`,
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          !currentStatus
            ? "Admin active successfully"
            : "Admin inactive successfully",
        );

        fetchAdmin();
      }
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchAdmin();
    fetchAmount();
  }, []);
  console.log(admins);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Admin Management</h1>
        <p className="text-sm font-medium text-slate-500">
          Manage all registered admins from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
        <div className="relative overflow-hidden flex flex-col items-start gap-4 w-full p-6 bg-white rounded-2xl border-y border-r border-l-4 border-slate-200 border-l-indigo-500 shadow-sm hover:shadow-md transition-all duration-300">
          <Users className="absolute -bottom-4 -right-4 text-indigo-50/50 w-32 h-32 rotate-12 pointer-events-none" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 z-10">
            <Users size={22} className="text-indigo-600" />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Admins
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {admins?.length || 0}
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden flex flex-col items-start gap-4 w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <HandCoins className="absolute -bottom-4 -right-4 text-emerald-50/50 w-32 h-32 rotate-12 pointer-events-none" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 z-10">
            <HandCoins size={22} className="text-emerald-600" />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Total Amount
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center">
              ₹ {totalAmount}
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">  
        
        {/* Search Field */}
        <div className="w-full md:flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Search Admins</p>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-1/2 md:w-auto md:min-w-[160px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Status</p>
          <SADropdown
            value={statusFilter}
            options={["All", "Active", "Inactive"]}
            onChange={setStatusFilter}
          />
        </div>

        {/* Packages Dropdown */}
        <div className="w-full sm:w-1/2 md:w-auto md:min-w-[180px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Packages</p>
          <SADropdown
            value={packageFilter}
            onChange={setPackageFilter}
            options={[
              "All Package",
              "ActivePackage",
              "InactivePackage",
              "ExpiredPackage",
            ]}
          />
        </div>
     
        {/* Add Admin Button */}
        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => setAddAdminModal(true)}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-semibold transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-indigo-100"
          >
            + Add Admin
          </button>
        </div>

      </div>

      {addAdminModal && (
        <SuperAdminAddAdmin
          onClose={() => setAddAdminModal(false)}
          onSuccess={(newAdmin) => {
            fetchAdmin();
          }}
        />
      )}

      {editAdminData && (
        <SuperAdminEditAdmin
          adminData={editAdminData}
          onClose={() => setEditAdminData(null)}
          onSuccess={(updatedAdmin) => {
            fetchAdmin();
          }}
        />
      )}

      {passwordAdminData && (
        <SuperAdminChangePassword
          adminData={passwordAdminData}
          onClose={() => setPasswordAdminData(null)}
          onSuccess={() => {}}
        />
      )}


      {/* mobile */}

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 lg:hidden mt-10">
          {filteredAdmins?.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
              <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Leads Found
              </h3>
              <p className="text-gray-500 mt-2">
                Add your first lead to get started.
              </p>
            </div>
          ) : (
            filteredAdmins?.map((admin) => (
              <div
                key={admin._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-all duration-300"
              >
                {/* Header */}
                <div className="mb-4">
                  <h1 className="text-lg font-bold text-gray-900 capitalize">
                    {admin.name}
                  </h1>

                </div>

                {/* Info */}
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Mobile</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.phone}
                    </p>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Business Type</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.businessType}
                    </p>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Timestams</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Status</p>
                    <div className="text-gray-800 font-medium truncate">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={admin.isActive}
                          onChange={() =>
                            handleToggleStatus(admin._id, admin.isActive)
                          }
                          className="sr-only peer"
                        />

                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>

                        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <p className="text-gray-500">Payment Verified</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.paymentVerified ? "Yes" : "No"}
                    </p>
                  </div>  <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <p className="text-gray-500">Package Assigned</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.packageAssigned || "-"}
                    </p>
                  </div>  <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                    <p className="text-gray-500">Package Expire Date</p>
                    <p className="text-gray-800 font-medium truncate">
                      {admin.packageExpiryDate
                        ? new Date(admin.packageExpiryDate).toLocaleDateString(
                          "en-GB",
                        )
                        : "-"}
                    </p>
                  </div>


                </div>

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setPasswordAdminData(admin)}
                    className="
          h-10 rounded-xl text-sm font-semibold
          text-emerald-600 bg-emerald-50 border border-emerald-200
          hover:bg-emerald-100 active:scale-[0.98]
          transition flex items-center justify-center gap-1.5
        "
                    title="Change Password"
                  >
                    <Key size={14} /> Pass
                  </button>
                  <button
                    onClick={() => setEditAdminData(admin)}
                    className="
          h-10 rounded-xl text-sm font-semibold
          text-indigo-600 bg-indigo-50 border border-indigo-200
          hover:bg-indigo-100 active:scale-[0.98]
          transition flex items-center justify-center gap-1.5
        "
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(admin._id);
                      setDeletePopup(true);
                    }}
                    className="
          h-10 rounded-xl text-sm font-semibold
          text-red-600 bg-red-50 border border-red-200
          hover:bg-red-100 active:scale-[0.98]
          transition flex items-center justify-center gap-1.5
        "
                  >
                    <Trash2 size={14} /> Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm mt-8">
        <table className="min-w-[1400px] w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr className="text-left">
              {[
                "SR NO.",
                "NAME",
                "PHONE",
                "EMAIL",
                "BUSINESS TYPE",
                "TIMESTAMP",
                "STATUS",
                "PAYMENT VERIFIED",
                "PACKAGE ASSIGNED",
                "PACKAGE EXPIRY DATE",
                "ACTION",
              ].map((head) => (
                <th
                  key={head}
                  className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredAdmins?.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-16 text-slate-500">
                  <Users className="mx-auto mb-3 w-12 h-12 text-slate-400" />
                  <h3 className="text-xl font-semibold text-slate-700">
                    No admins Found
                  </h3>
                  <p className="mt-2 text-slate-500">create super admin</p>
                </td>
              </tr>
            ) : (
              filteredAdmins?.map((admin, i) => (
                <tr
                  key={admin._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-slate-700 font-medium">{i + 1}</td>

                  <td className="px-5 py-4 text-slate-700 font-medium">{admin.name}</td>

                  <td className="px-5 py-4 text-slate-600">{admin.phone}</td>

                  <td className="px-5 py-4 text-slate-600">{admin.email}</td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                      {admin.businessType || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "-"}
                  </td>

                  <td className="px-5 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={admin.isActive}
                        onChange={() =>
                          handleToggleStatus(admin._id, admin.isActive)
                        }
                        className="sr-only peer"
                      />

                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>

                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-5"></div>
                    </label>
                  </td>

                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {admin.paymentVerified ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold">Yes</span>
                    ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs font-semibold">No</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-700 font-medium">{admin.packageAssigned || "-"}</td>

                  <td className="px-5 py-4 text-slate-600">
                    {admin.packageExpiryDate
                      ? new Date(admin.packageExpiryDate).toLocaleDateString(
                        "en-GB",
                      )
                      : "-"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPasswordAdminData(admin)}
                        className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors tooltip-trigger"
                        title="Change Password"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => setEditAdminData(admin)}
                        className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors tooltip-trigger"
                        title="Edit Admin"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(admin._id);
                          setDeletePopup(true);
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors tooltip-trigger"
                        title="Delete Admin"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deletePopup && (
        <SAdeletepopup
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {addAdminModal && (
        <SuperAdminAddAdmin
          onClose={() => setAddAdminModal(false)}
          onSuccess={(newAdmin) => {
            setAdmins((prev) => [newAdmin, ...prev]);
          }}
        />
      )}

    </div>
  );
};

export default SuperAdminMangement;
