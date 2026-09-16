import React, { useState, useEffect } from "react";
import { Mail, Phone, Save, Globe, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const SuperAdminWebsiteSettings = () => {
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/super-admin/website-settings`);
      const result = await res.json();
      if (result.success && result.data) {
        setContactEmail(result.data.contactEmail || "");
        setContactPhone(result.data.contactPhone || "");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load website contact settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!contactEmail.trim()) {
      toast.error("Please enter a contact email");
      return;
    }
    if (!contactPhone.trim()) {
      toast.error("Please enter a contact phone number");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("superAdminToken");
      const res = await fetch(`${BASE_URL}/super-admin/website-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Website contact settings saved successfully!");
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe size={18} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Website Contact Settings</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Configure the official contact phone number and email displayed on the landing page footer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span>Contact Information</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-indigo-600" />
                <span>Support Email Address *</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. support@lmssoftware.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Visitors will use this to email your support team directly from the website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-indigo-600" />
                <span>Support Phone / Mobile Number *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed in the footer without any timing restrictions.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save size={16} />
                <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50 mb-3 inline-block">
              Landing Page Footer Preview
            </span>
            <h3 className="font-bold text-sm text-slate-200 mb-3">How it looks on website:</h3>

            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <span className="font-medium text-slate-200 break-all">
                  {contactEmail || "support@lmssoftware.com"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-indigo-400 shrink-0" />
                <span className="font-medium text-slate-200">
                  {contactPhone || "+91 98765 43210"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Whenever you update the phone or email here and click "Save", the landing page footer will update automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminWebsiteSettings;
