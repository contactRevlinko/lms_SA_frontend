import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Trash2, Phone, Mail, Clock, Building2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminDemoRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchRequests = async () => {
    const token = localStorage.getItem("superAdminToken");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/super-admin/demo-requests`, {
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
        setRequests(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch demo requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`${BASE_URL}/super-admin/demo-request-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated to " + newStatus);
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`${BASE_URL}/super-admin/demo-request/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request deleted successfully");
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.businessName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || r.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
            Demo Requests & Inquiries
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Prospects who submitted the "Book a Demo" form on the LMS Landing Page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
            Total Requests: {requests.length}
          </span>
          <button
            onClick={fetchRequests}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, phone, business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Sr No.</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Requirements / Note</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading demo requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No demo requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, index) => (
                  <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.name}</td>
                    <td className="py-3.5 px-4">
                      <a
                        href={`tel:${req.phone}`}
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Phone size={12} />
                        <span>{req.phone}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={`mailto:${req.email}`}
                        className="text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                      >
                        <Mail size={12} />
                        <span>{req.email}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {req.businessName || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500" title={req.message}>
                      {req.message || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.status || "New"}
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                          req.status === "Contacted"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : req.status === "Closed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : req.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete request"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDemoRequests;
