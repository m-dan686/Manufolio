import React, { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiFolder, FiMessageSquare, FiBarChart2, FiFileText, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { logout, isAuthenticated } from "../../api/services/authService";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/admin");
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/admin");
    };

    const navItems = [
        { path: "/admin/dashboard", icon: <FiBarChart2 />, label: "Dashboard" },
        { path: "/admin/dashboard?tab=messages", icon: <FiMessageSquare />, label: "Messages" }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-black/60 border-r border-white/10 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold tracking-wider">MANU<span className="text-green">FOLIO</span></h2>
                    <span className="text-xs uppercase opacity-50 tracking-widest font-mono mt-1 block">CMS Backend</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = item.path.includes("tab=messages")
                            ? location.search.includes("tab=messages")
                            : !location.search.includes("tab=messages") && location.pathname === "/admin/dashboard";
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-green/10 text-green border border-green/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium text-sm"
                    >
                        <FiArrowLeft />
                        Public Portfolio
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium text-sm"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Content */}
            <main className="flex-1 ml-64 min-h-screen p-8 relative">
                {/* Global Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
