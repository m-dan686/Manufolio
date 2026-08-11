import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiEye, FiDownload, FiUsers, FiMessageCircle,
    FiTrash2, FiCheck, FiCheckSquare, FiSearch,
    FiChevronLeft, FiChevronRight, FiRefreshCw,
    FiX, FiUser, FiMail, FiPhone, FiClock
} from "react-icons/fi";
import { getStats, getMessages, markAsRead, markAllAsRead, deleteMessage } from "../../api/services/adminService";

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium opacity-60 mb-1">{label}</p>
                <h3 className="text-3xl font-bold">{value ?? "—"}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                {React.cloneElement(icon, { className: "text-xl" })}
            </div>
        </div>
    </motion.div>
);

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ── Stats ──
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // ── Messages ──
    const [messages, setMessages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [messagesLoading, setMessagesLoading] = useState(true);

    // ── Selected message for detail view ──
    const [selectedMessage, setSelectedMessage] = useState(null);

    // ── Pagination / filter state ──
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sort, setSort] = useState("sentAt,desc");

    // ── Active tab ──
    const [tab, setTab] = useState(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get("tab") || "dashboard";
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlTab = queryParams.get("tab") || "dashboard";
        setTab(urlTab);
    }, [location.search]);

    const handleTabChange = (newTab) => {
        setTab(newTab);
        navigate(`/admin/dashboard?tab=${newTab}`);
    };

    // ─── Load stats ───────────────────────────────────────────────────────────
    const loadStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await getStats();
            setStats(data);
        } catch (e) {
            console.error("Failed to load stats:", e);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // ─── Load messages ────────────────────────────────────────────────────────
    const loadMessages = useCallback(async () => {
        setMessagesLoading(true);
        try {
            const data = await getMessages({ page, size, sort, search });
            setMessages(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (e) {
            console.error("Failed to load messages:", e);
        } finally {
            setMessagesLoading(false);
        }
    }, [page, size, sort, search]);

    useEffect(() => { loadStats(); }, [loadStats]);
    useEffect(() => { if (tab === "messages") loadMessages(); }, [tab, loadMessages]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setPage(0);
    };

    const handleMarkRead = async (id) => {
        await markAsRead(id);
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
        loadStats();
    };

    const handleMarkAll = async () => {
        await markAllAsRead();
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
        loadStats();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        await deleteMessage(id);
        loadMessages();
        loadStats();
    };

    const handleOpenMessage = (msg) => {
        setSelectedMessage({ ...msg, read: true });
        if (!msg.read) {
            handleMarkRead(msg.id);
        }
    };

    // ─── Stat definitions ─────────────────────────────────────────────────────
    const statCards = [
        {
            label: "Total Messages", value: stats?.totalMessages,
            icon: <FiMessageCircle />, color: "text-purple-400", bg: "bg-purple-400/10"
        },
        {
            label: "Unread", value: stats?.unreadMessages,
            icon: <FiEye />, color: "text-blue-400", bg: "bg-blue-400/10"
        },
        {
            label: "Today", value: stats?.todayMessages,
            icon: <FiUsers />, color: "text-orange-400", bg: "bg-orange-400/10"
        },
        {
            label: "This Week", value: stats?.thisWeekMessages,
            icon: <FiDownload />, color: "text-green-400", bg: "bg-green-400/10"
        },
    ];

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard <span className="text-green">Overview</span>
                    </h1>
                    <p className="opacity-60 mt-1">Welcome back. Here is your portfolio activity.</p>
                </div>
                {/* Tabs */}
                <div className="flex gap-2">
                    {["dashboard", "messages"].map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                                tab === t
                                    ? "bg-green/10 text-green border border-green/30"
                                    : "text-white/60 hover:bg-white/5"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── DASHBOARD TAB ── */}
            {tab === "dashboard" && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((s, idx) => (
                            <StatCard key={idx} {...s} delay={idx * 0.1} />
                        ))}
                    </div>

                    {/* Month / Week summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-4">Contact Activity</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "This Month", value: stats?.thisMonthMessages ?? "—" },
                                    { label: "This Week", value: stats?.thisWeekMessages ?? "—" },
                                    { label: "Today", value: stats?.todayMessages ?? "—" },
                                    { label: "Unread", value: stats?.unreadMessages ?? "—" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-4 bg-white/5 border border-white/10 rounded-xl text-center"
                                    >
                                        <p className="text-2xl font-bold text-green">{item.value}</p>
                                        <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleTabChange("messages")}
                                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <FiMessageCircle className="text-purple-400" />
                                    <span className="text-sm font-medium">View All Messages</span>
                                </button>
                                <button
                                    onClick={handleMarkAll}
                                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <FiCheckSquare className="text-green" />
                                    <span className="text-sm font-medium">Mark All as Read</span>
                                </button>
                                <button
                                    onClick={() => { loadStats(); loadMessages(); }}
                                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <FiRefreshCw className="text-orange-400" />
                                    <span className="text-sm font-medium">Refresh Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── MESSAGES TAB ── */}
            {tab === "messages" && (
                <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by name or email…"
                                style={{ backgroundColor: '#0f172a', borderColor: '#f97316', color: '#ffffff' }}
                                className="px-4 py-2.5 border-2 rounded-xl text-sm font-mono font-bold placeholder:text-orange-300 placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 md:w-80 shadow-md"
                            />
                            <button
                                type="submit"
                                aria-label="Search messages"
                                style={{ backgroundColor: '#f97316', borderColor: '#f97316', color: '#ffffff' }}
                                className="px-4 py-2.5 border-2 rounded-xl hover:bg-orange-600 transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center text-lg font-bold"
                            >
                                <FiSearch />
                            </button>
                        </form>

                        {/* Sort + actions */}
                        <div className="flex gap-3 items-center">
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setPage(0); }}
                                style={{ backgroundColor: '#0f172a', borderColor: '#f97316', color: '#ffffff' }}
                                className="px-4 py-2.5 border-2 rounded-xl text-sm font-mono font-bold focus:outline-none cursor-pointer shadow-md"
                            >
                                <option value="sentAt,desc" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="font-mono font-bold">Newest First</option>
                                <option value="sentAt,asc" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="font-mono font-bold">Oldest First</option>
                                <option value="name,asc" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="font-mono font-bold">Name A–Z</option>
                                <option value="name,desc" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="font-mono font-bold">Name Z–A</option>
                            </select>
                            <button
                                onClick={handleMarkAll}
                                style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', borderColor: '#f97316', color: '#f97316' }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-mono font-bold border-2 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-200 cursor-pointer shadow-md"
                            >
                                <FiCheckSquare /> Mark All Read
                            </button>
                        </div>
                    </div>

                    {/* Total */}
                    <p className="text-xs opacity-40">{totalElements} message{totalElements !== 1 ? "s" : ""} found</p>

                    {/* Table */}
                    {messagesLoading ? (
                        <div className="text-center py-12 opacity-40">Loading messages…</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 opacity-40">No messages found.</div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => handleOpenMessage(msg)}
                                    className={`p-4 rounded-2xl border backdrop-blur-md flex gap-4 items-start transition-colors cursor-pointer group ${
                                        msg.read
                                            ? "bg-black/30 border-white/5 hover:bg-white/[0.04]"
                                            : "bg-green/5 border-green/20 hover:bg-green/[0.08]"
                                    }`}
                                >
                                    {/* Unread dot */}
                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? "bg-white/20" : "bg-green shadow-[0_0_8px_#10b981]"}`} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 items-center mb-1">
                                            <span className="font-bold text-white/90 group-hover:text-green transition-colors">{msg.name}</span>
                                            <span className="text-xs text-white/40 font-mono">{msg.email}</span>
                                            <span className="text-xs text-white/30">·</span>
                                            <span className="text-xs text-white/30 font-mono">{msg.phone}</span>
                                            {!msg.read && (
                                                <span className="text-[10px] px-2 py-0.5 bg-green/15 text-green rounded-full font-mono uppercase">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/60 truncate">{msg.message}</p>
                                        <span className="text-[10px] text-orange-400 uppercase font-mono mt-1 block">
                                            {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : "—"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleOpenMessage(msg)}
                                            title="View message details"
                                            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                        >
                                            <FiEye />
                                        </button>
                                        {!msg.read && (
                                            <button
                                                onClick={() => handleMarkRead(msg.id)}
                                                title="Mark as read"
                                                className="p-2 rounded-lg hover:bg-green/10 text-green transition-colors"
                                            >
                                                <FiCheck />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            title="Delete"
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                            >
                                <FiChevronLeft />
                            </button>
                            <span className="text-sm opacity-60">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Message Detail View Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <FiMessageCircle className="text-green" /> Contact Submission
                                    </h3>
                                    <p className="text-xs opacity-50 mt-1">ID: #{selectedMessage.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Grid info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-white/40 uppercase font-mono tracking-wider">
                                            <FiUser /> Sender Name
                                        </div>
                                        <p className="font-semibold text-white">{selectedMessage.name}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-white/40 uppercase font-mono tracking-wider">
                                            <FiClock /> Sent At
                                        </div>
                                        <p className="font-mono text-sm text-orange-400">
                                            {selectedMessage.sentAt ? new Date(selectedMessage.sentAt).toLocaleString() : "—"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-white/40 uppercase font-mono tracking-wider">
                                            <FiMail /> Email Address
                                        </div>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="font-semibold text-green hover:underline break-all"
                                        >
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-white/40 uppercase font-mono tracking-wider">
                                            <FiPhone /> Phone Number
                                        </div>
                                        {selectedMessage.phone && selectedMessage.phone.trim() ? (
                                            <a
                                                href={`tel:${selectedMessage.phone}`}
                                                className="font-semibold text-green hover:underline"
                                            >
                                                {selectedMessage.phone}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-white/40 italic font-medium">Not provided</p>
                                        )}
                                    </div>
                                </div>

                                {/* Message content */}
                                <div className="space-y-2">
                                    <label className="text-xs text-white/40 uppercase font-mono tracking-wider block">Message Content</label>
                                    <div className="whitespace-pre-wrap break-words text-white/80 bg-white/5 border border-white/5 p-4 rounded-xl font-mono text-sm leading-relaxed max-h-[250px] overflow-y-auto">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <button
                                    onClick={async () => {
                                        const id = selectedMessage.id;
                                        setSelectedMessage(null);
                                        await handleDelete(id);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-semibold"
                                >
                                    <FiTrash2 /> Delete Message
                                </button>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-5 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminDashboard;
