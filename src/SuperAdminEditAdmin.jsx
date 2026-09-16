import React, { useState, useEffect } from "react";
import { MoveRight, X, User, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail } from "../src/config/validate";
import SADropdown from "./SADropdown";

const BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_BUSINESS_TYPES = ["Wholesaler", "Retailer", "Distributor"];

const SuperAdminEditAdmin = ({ adminData, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [isCustomBusiness, setIsCustomBusiness] = useState(false);
  const [customBusiness, setCustomBusiness] = useState("");
  const [localCustomBusinessTypes, setLocalCustomBusinessTypes] = useState([]);

  useEffect(() => {
    if (adminData) {
      setName(adminData.name || "");
      setPhone(adminData.phone || "");
      setEmail(adminData.email || "");
      
      const bType = adminData.businessType || "";
      if (bType && !DEFAULT_BUSINESS_TYPES.includes(bType)) {
        setLocalCustomBusinessTypes([bType]);
      }
      setBusinessType(bType);
    }
  }, [adminData]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !businessType) {
      toast.error("All fields are required");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter 10 digit phone number");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const superAdminToken = localStorage.getItem("superAdminToken");

      const res = await fetch(`${BASE_URL}/super-admin/update-admin/${adminData._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          businessType,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Admin update failed");
        return;
      }

      toast.success("Admin updated successfully");
      onSuccess(result.admin);
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-visible">
        <form onSubmit={handleUpdate} className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6 border-b border-slate-100 pb-6">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl text-slate-800 mb-1">
                Edit Admin
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Update administrator account details
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
              <p className="font-medium mb-1.5 text-slate-700 text-sm">Full Name</p>
              <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                  type="text"
                  placeholder="Enter full name"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <p className="font-medium mb-1.5 text-slate-700 text-sm">Phone Number</p>
              <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Phone size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  value={phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");

                    if (value.length > 10) {
                      if (value.length >= 12 && value.startsWith("91")) {
                        toast.error("Please enter 10 digit number without +91");
                      } else {
                        toast.error("Only 10 digits allowed");
                      }
                      return;
                    }

                    setPhone(value);
                  }}
                  className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                  type="text"
                  placeholder="Mobile number"
                />
              </div>
            </div>

            <div>
              <p className="font-medium mb-1.5 text-slate-700 text-sm">Work Email</p>
              <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none w-full text-sm font-medium text-slate-800 bg-transparent placeholder-slate-400"
                  type="email"
                  placeholder="username@gmail.com"
                />
              </div>
            </div>

            <div>
              <p className="font-medium mb-1.5 text-slate-700 text-sm">Business Type</p>
              <SADropdown
                value={businessType}
                onChange={(val) => {
                  if (val === "Add Custom Business Type...") {
                    setCustomBusiness("");
                    setBusinessType("");
                    setIsCustomBusiness(true);
                  } else {
                    setIsCustomBusiness(false);
                    setBusinessType(val);
                  }
                }}
                options={[
                  "Add Custom Business Type...",
                  ...DEFAULT_BUSINESS_TYPES,
                  ...localCustomBusinessTypes.map((b) => ({
                    label: b,
                    value: b,
                    deletable: true,
                    onDelete: () => {
                      setLocalCustomBusinessTypes((prev) => prev.filter((x) => x !== b));
                      if (businessType === b) setBusinessType("");
                    },
                  })),
                ]}
              />

              {isCustomBusiness && (
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder="Enter business type"
                    className="flex-1 outline-none border border-slate-200 text-sm font-medium text-slate-800 bg-white rounded-xl px-3 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = customBusiness.trim();
                      if (!trimmed) return;
                      if (!localCustomBusinessTypes.includes(trimmed)) {
                        setLocalCustomBusinessTypes((prev) => [...prev, trimmed]);
                      }
                      setBusinessType(trimmed);
                      setIsCustomBusiness(false);
                      setCustomBusiness("");
                    }}
                    className="px-4 py-2 rounded-xl text-white text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl w-full bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Update Admin
            <MoveRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminEditAdmin;
