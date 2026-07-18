import React, { useState } from 'react'
const BASE_URL = import.meta.env.VITE_API_URL;
import { validateEmail, validatePassword } from '../src/config/validate';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, TrendingUp, CheckCircle } from "lucide-react";

const SuperAdminLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!validatePassword(password)) {
            toast.error("Password must contain 8+ characters, uppercase, lowercase, number and special character");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/super-admin/login-sa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message || "Invalid credentials");
                return;
            }
            localStorage.setItem("superAdminToken", result.token);
            localStorage.setItem("superAdminUser", JSON.stringify(result.superAdmin));
            navigate("/dashboard");
            toast.success(result.message);
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const gradient = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)";

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── LEFT PANEL (desktop only) ── */}
            <div
                className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: gradient }}
            >
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

                {/* Logo */}
                <div className="flex items-center gap-3 z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">LMS</span>
                    <span className="text-xs text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 ml-1">Super Admin</span>
                </div>

                {/* Content */}
                <div className="z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                        <ShieldCheck className="text-indigo-200" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white leading-snug mb-3">
                        Super Admin<br />Control Panel
                    </h2>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                        Manage all client accounts, packages,<br />payments and system configurations.
                    </p>
                    <div className="flex flex-col gap-3">
                        {["Full client account management", "Package & billing control", "System-wide configuration"].map((f) => (
                            <div key={f} className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-indigo-300 shrink-0" />
                                <span className="text-indigo-100 text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1.5">⚠ Restricted Access</p>
                        <p className="text-indigo-200 text-xs leading-relaxed">
                            This portal is for authorized super administrators only.
                        </p>
                    </div>
                </div>

                <p className="text-indigo-300 text-xs z-10">© 2026 LeadScale Systems Inc. All rights reserved.</p>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex flex-col" style={{ background: "#f8fafc" }}>

                {/* Mobile gradient header (shown only on mobile) */}
                <div
                    className="lg:hidden flex flex-col items-center justify-center pt-12 pb-8 px-6 relative overflow-hidden"
                    style={{ background: gradient }}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20">
                        <ShieldCheck className="text-white" size={22} />
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-white" size={18} />
                        <span className="text-white font-bold text-lg">LMS</span>
                        <span className="text-xs text-indigo-200 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">Super Admin</span>
                    </div>
                    <p className="text-indigo-200 text-xs mt-2">Super Admin Control Panel</p>
                </div>

                {/* Form area */}
                <div className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                            {/* Desktop icon + title */}
                            <div className="hidden lg:flex justify-center mb-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #eef2ff, #ede9fe)" }}>
                                    <ShieldCheck className="text-indigo-600" size={26} />
                                </div>
                            </div>

                            <div className="text-center mb-7">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Super Admin Sign In</h1>
                                <p className="text-sm text-gray-500">Enter your credentials to access the control panel</p>
                            </div>

                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${email ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                                        <Mail size={15} className="text-gray-400 shrink-0" />
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="admin@company.com"
                                            className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                    <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${password ? "border-indigo-400 bg-indigo-50/40" : "border-gray-300 bg-white"}`}>
                                        <Lock size={15} className="text-gray-400 shrink-0" />
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="outline-none w-full text-sm bg-transparent text-gray-800 placeholder-gray-400"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                                            {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm mt-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                                    style={{ background: loading ? "#818cf8" : gradient }}
                                >
                                    {loading ? "Signing in..." : (<><span>Sign In</span><ArrowRight size={16} /></>)}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-5">
                            © 2026 LeadScale Systems Inc. &nbsp;·&nbsp;
                            <span className="hover:text-indigo-500 cursor-pointer">Privacy</span> &nbsp;·&nbsp;
                            <span className="hover:text-indigo-500 cursor-pointer">Terms</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperAdminLogin