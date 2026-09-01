import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  PhoneCall,
  Mail,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  getDashboardStats,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addLeadConversation,
} from "../lib/api";
import type {
  DashboardStats,
  Lead,
  GetLeadsQuery,
  NewLeadInput,
  LeadStatus,
} from "../types/crm";
import {
  LEAD_SOURCES,
  LEAD_TAGS,
  LEAD_STATUSES,
  CONVERSATION_CHANNELS,
} from "../types/crm";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "CRM Dashboard — Tattoon Studio" },
      { name: "description", content: "AI Receptionist & Tattoo Studio Lead CRM Dashboard" },
    ],
  }),
  component: DashboardPage,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src="/tatto/Tatto%20image02.svg"
        alt="TATTOON Logo"
        className="h-7 w-auto object-contain brightness-110"
      />
    </Link>
  );
}

// Helpers for Status & Tag styling
function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-500/20 text-blue-300 border-blue-400/40 font-semibold";
    case "contacted":
      return "bg-amber-500/20 text-amber-300 border-amber-400/40 font-semibold";
    case "qualified":
      return "bg-purple-500/20 text-purple-300 border-purple-400/40 font-semibold";
    case "booked":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-semibold";
    case "completed":
      return "bg-green-500/20 text-green-300 border-green-400/40 font-semibold";
    case "lost":
      return "bg-rose-500/20 text-rose-300 border-rose-400/40 font-semibold";
    default:
      return "bg-zinc-800 text-zinc-300 border-zinc-700";
  }
}

function getSourceBadgeClass(source: string) {
  switch (source.toLowerCase()) {
    case "voice_agent":
    case "voice":
      return "bg-amber-500/20 text-amber-300 border-amber-400/40 font-semibold";
    case "email":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-semibold";
    case "website":
      return "bg-indigo-500/20 text-indigo-300 border-indigo-400/40 font-semibold";
    case "instagram":
      return "bg-pink-500/20 text-pink-300 border-pink-400/40 font-semibold";
    case "facebook":
      return "bg-blue-600/20 text-blue-300 border-blue-400/40 font-semibold";
    case "sms":
      return "bg-teal-500/20 text-teal-300 border-teal-400/40 font-semibold";
    default:
      return "bg-zinc-800 text-zinc-300 border-zinc-700";
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

function DashboardPage() {
  // Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Leads list state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Filter & Search states
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Modals & Selected Lead
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [loadingActiveLead, setLoadingActiveLead] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState<NewLeadInput>({
    name: "",
    email: "",
    phone: "",
    source: "website",
    tag: "WEBSITE",
    status: "new",
    message: "",
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Conversation input state inside modal
  const [newMsgContent, setNewMsgContent] = useState("");
  const [newMsgRole, setNewMsgRole] = useState<"user" | "assistant">("assistant");
  const [newMsgChannel, setNewMsgChannel] = useState("website");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Status update indicator
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch stats from backend
  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load dashboard stats:", err);
      setStatsError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch leads from backend
  const loadLeads = useCallback(
    async (pageToLoad: number = 1) => {
      try {
        setLoadingLeads(true);
        setLeadsError(null);
        const queryParams: GetLeadsQuery = {
          page: pageToLoad,
          limit: pagination.limit,
        };

        if (searchQuery.trim()) queryParams.search = searchQuery.trim();
        if (selectedSource) queryParams.source = selectedSource;
        if (selectedStatus) queryParams.status = selectedStatus;
        if (selectedTag) queryParams.tag = selectedTag;

        const res = await getLeads(queryParams);
        setLeads(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error("Failed to load leads:", err);
        setLeadsError(err.message || "Failed to load leads from backend");
      } finally {
        setLoadingLeads(false);
      }
    },
    [pagination.limit, searchQuery, selectedSource, selectedStatus, selectedTag]
  );

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadLeads(1);
  }, [loadLeads]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Handle Refresh
  const handleRefresh = async () => {
    await Promise.all([loadStats(), loadLeads(pagination.page)]);
    showToast("Dashboard refreshed");
  };

  // Handle Quick Status Change from Table Dropdown
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      setUpdatingLeadId(leadId);
      const updated = await updateLead(leadId, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: updated.status } : l)));
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      loadStats(); // Update counters
      showToast(`Status updated to ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update lead status", "error");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  // Open Lead Details & Conversations Modal
  const handleOpenDetails = async (lead: Lead) => {
    try {
      setActiveLead(lead);
      setIsDetailsModalOpen(true);
      setLoadingActiveLead(true);
      const fullLead = await getLeadById(lead.id);
      setActiveLead(fullLead);
      setNewMsgChannel(fullLead.source.startsWith("voice") ? "voice" : fullLead.source || "website");
    } catch (err: any) {
      showToast(err.message || "Failed to fetch lead details", "error");
    } finally {
      setLoadingActiveLead(false);
    }
  };

  // Add a new conversation message
  const handleSendConversationMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newMsgContent.trim()) return;

    try {
      setSendingMsg(true);
      const createdMsg = await addLeadConversation(activeLead.id, {
        channel: newMsgChannel,
        role: newMsgRole,
        content: newMsgContent.trim(),
      });

      setActiveLead((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          conversations: [...(prev.conversations || []), createdMsg],
        };
      });
      setNewMsgContent("");
      showToast("Message added to conversation");
    } catch (err: any) {
      showToast(err.message || "Failed to add conversation message", "error");
    } finally {
      setSendingMsg(false);
    }
  };

  // Create New Lead Submit
  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim()) {
      setCreateError("Name is required");
      return;
    }

    try {
      setCreateSubmitting(true);
      setCreateError(null);
      await createLead({
        name: newLeadForm.name.trim(),
        email: newLeadForm.email?.trim() || null,
        phone: newLeadForm.phone?.trim() || null,
        source: newLeadForm.source || "website",
        tag: newLeadForm.tag || "WEBSITE",
        status: newLeadForm.status || "new",
        message: newLeadForm.message?.trim() || null,
      });

      setIsCreateModalOpen(false);
      setNewLeadForm({
        name: "",
        email: "",
        phone: "",
        source: "website",
        tag: "WEBSITE",
        status: "new",
        message: "",
      });
      showToast("Lead registered successfully");
      loadStats();
      loadLeads(1);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create lead");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Delete Lead
  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await deleteLead(leadToDelete.id);
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
      showToast("Lead deleted successfully");
      loadStats();
      loadLeads(pagination.page);
    } catch (err: any) {
      showToast(err.message || "Failed to delete lead", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#111319] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 border shadow-2xl backdrop-blur-md rounded-sm ${
              toastMessage.type === "success"
                ? "bg-[#1c202e] border-amber-500/50 text-white"
                : "bg-rose-950/95 border-rose-500/60 text-rose-100"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={20} className="text-amber-400" />
            ) : (
              <AlertCircle size={20} className="text-rose-400" />
            )}
            <span className="text-sm font-medium tracking-wide">
              {toastMessage.text}
            </span>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#161822]/90 backdrop-blur-md px-6 py-4 md:px-10 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="flex items-center gap-6 font-display text-sm tracking-widest uppercase">
              <Link
                to="/"
                className="text-zinc-400 transition-colors hover:text-amber-300 font-medium"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-amber-400 border-b-2 border-amber-400 pb-0.5 font-bold"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loadingStats || loadingLeads}
              className="flex items-center gap-2 border border-zinc-700 bg-zinc-800/80 px-4 py-2 font-display text-xs tracking-wider uppercase text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300 disabled:opacity-50 rounded-sm"
              title="Refresh Data"
            >
              <RefreshCw
                size={14}
                className={loadingStats || loadingLeads ? "animate-spin text-amber-400" : ""}
              />
              <span className="hidden sm:inline font-semibold">Refresh</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 border border-amber-500 bg-amber-400 px-4 py-2 font-display text-xs tracking-widest font-bold uppercase text-zinc-950 transition-all hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 rounded-sm"
            >
              <Plus size={15} />
              <span>New Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8 md:px-10 md:py-10 space-y-8">
        {/* DASHBOARD TITLE SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-display text-xs tracking-[0.18em] text-amber-300 uppercase font-semibold rounded-sm">
              <Sparkles size={12} className="text-amber-400" />
              CRM Overview & AI Receptionist
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Lead Management <span className="text-amber-400">Hub</span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-300 font-normal">
              Monitor incoming voice calls, email inquiries, studio bookings, and conversion stages.
            </p>
          </div>
          {stats && (
            <div className="flex items-center gap-3 text-xs font-display tracking-widest uppercase bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-sm">
              <span className="text-purple-300 font-bold">{stats.qualifiedLeads} Qualified</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-300 font-bold">{stats.bookedLeads} Booked</span>
            </div>
          )}
        </div>

        {/* SUMMARY CARDS */}
        {statsError ? (
          <div className="border border-rose-500/40 bg-rose-950/40 p-4 flex items-center justify-between gap-4 rounded-sm">
            <div className="flex items-center gap-3 text-rose-200 text-sm">
              <AlertCircle size={20} className="text-rose-400 shrink-0" />
              <span>{statsError}</span>
            </div>
            <button
              onClick={loadStats}
              className="text-xs uppercase font-display tracking-wider text-rose-300 underline hover:text-white font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Leads */}
            <div className="border border-zinc-800 bg-[#1a1c27] p-5 sm:p-6 relative overflow-hidden group hover:border-amber-400/60 transition-all rounded-sm shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-widest uppercase text-zinc-300 font-bold">
                  Total Leads
                </span>
                <div className="p-2 border border-zinc-700 bg-zinc-900/80 text-amber-400 rounded-sm">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-white">
                  {loadingStats ? "..." : (stats?.totalLeads ?? 0)}
                </span>
                <span className="text-xs text-zinc-300 font-medium">inquiries</span>
              </div>
              <div className="mt-3 text-xs text-zinc-300 flex items-center gap-2 font-medium">
                <span className="text-amber-400 font-semibold">
                  {stats ? `${stats.websiteLeads} website inquiries` : "0 website"}
                </span>
              </div>
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </div>

            {/* Card 2: Voice Leads */}
            <div className="border border-zinc-800 bg-[#1a1c27] p-5 sm:p-6 relative overflow-hidden group hover:border-amber-400/60 transition-all rounded-sm shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-widest uppercase text-zinc-300 font-bold">
                  Voice Leads
                </span>
                <div className="p-2 border border-zinc-700 bg-zinc-900/80 text-amber-400 rounded-sm">
                  <PhoneCall size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-amber-300">
                  {loadingStats ? "..." : (stats?.voiceLeads ?? 0)}
                </span>
                <span className="text-xs text-zinc-300 font-medium">AI receptionist</span>
              </div>
              <div className="mt-3 text-xs text-zinc-300 font-medium">
                Automated phone calls
              </div>
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </div>

            {/* Card 3: Email Leads */}
            <div className="border border-zinc-800 bg-[#1a1c27] p-5 sm:p-6 relative overflow-hidden group hover:border-cyan-400/60 transition-all rounded-sm shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-widest uppercase text-zinc-300 font-bold">
                  Email Leads
                </span>
                <div className="p-2 border border-zinc-700 bg-zinc-900/80 text-cyan-400 rounded-sm">
                  <Mail size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-cyan-300">
                  {loadingStats ? "..." : (stats?.emailLeads ?? 0)}
                </span>
                <span className="text-xs text-zinc-300 font-medium">via n8n / email</span>
              </div>
              <div className="mt-3 text-xs text-zinc-300 font-medium">
                Parsed inbox inquiries
              </div>
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </div>

            {/* Card 4: New Leads */}
            <div className="border border-zinc-800 bg-[#1a1c27] p-5 sm:p-6 relative overflow-hidden group hover:border-blue-400/60 transition-all rounded-sm shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs tracking-widest uppercase text-zinc-300 font-bold">
                  New Leads
                </span>
                <div className="p-2 border border-zinc-700 bg-zinc-900/80 text-blue-400 rounded-sm">
                  <UserPlus size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-blue-400">
                  {loadingStats ? "..." : (stats?.newLeads ?? 0)}
                </span>
                <span className="text-xs text-zinc-300 font-medium">awaiting review</span>
              </div>
              <div className="mt-3 text-xs text-zinc-300 font-medium">
                Action required
              </div>
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </div>
          </div>
        )}

        {/* FILTER & SEARCH TOOLBAR */}
        <div className="border border-zinc-800 bg-[#171924] p-4 sm:p-5 rounded-sm shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, email, phone, or tattoo idea..."
                  className="w-full border border-zinc-700 bg-zinc-900/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm transition-colors"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="border border-zinc-700 bg-zinc-800 px-5 py-2.5 font-display text-xs tracking-wider uppercase text-zinc-100 hover:border-amber-400 hover:text-amber-300 transition-colors font-bold rounded-sm"
              >
                Search
              </button>
            </form>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Source Filter */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-zinc-400" />
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="border border-zinc-700 bg-zinc-900 py-2 px-3 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                >
                  <option value="">All Sources</option>
                  {LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-zinc-700 bg-zinc-900 py-2 px-3 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
              >
                <option value="">All Statuses</option>
                {LEAD_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border border-zinc-700 bg-zinc-900 py-2 px-3 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
              >
                <option value="">All Tags</option>
                {LEAD_TAGS.map((tg) => (
                  <option key={tg} value={tg}>
                    {tg}
                  </option>
                ))}
              </select>

              {/* Reset Filters */}
              {(selectedSource || selectedStatus || selectedTag || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSource("");
                    setSelectedStatus("");
                    setSelectedTag("");
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                  className="text-xs text-amber-300 underline hover:text-white px-2 py-1 font-display uppercase tracking-wider font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RECENT LEADS TABLE */}
        <div className="border border-zinc-800 bg-[#171924] rounded-sm shadow-md overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 bg-[#1b1e2c]">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                Recent Leads
              </h2>
              <p className="text-xs text-zinc-300 mt-0.5 font-medium">
                {pagination.total} total inquiries recorded in PostgreSQL database
              </p>
            </div>

            {loadingLeads && (
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <RefreshCw size={14} className="animate-spin text-amber-400" />
                <span>Loading leads...</span>
              </div>
            )}
          </div>

          {leadsError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle size={32} className="mx-auto text-rose-400" />
              <p className="text-sm text-rose-200 font-medium">{leadsError}</p>
              <button
                onClick={() => loadLeads(pagination.page)}
                className="inline-block border border-zinc-700 bg-zinc-800 px-5 py-2 text-xs uppercase font-display tracking-widest text-white hover:border-amber-400 hover:text-amber-300 font-bold rounded-sm"
              >
                Retry Loading
              </button>
            </div>
          ) : loadingLeads && leads.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw size={26} className="mx-auto animate-spin text-amber-400" />
              <p className="text-sm font-display uppercase tracking-widest text-zinc-300 font-semibold">
                Loading leads...
              </p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <Users size={36} className="mx-auto text-zinc-400" />
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                  No leads found yet.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto font-normal">
                  {selectedSource || selectedStatus || selectedTag || searchQuery
                    ? "No leads matched your filter criteria. Try adjusting or clearing filters."
                    : "No inquiries have been recorded yet. Leads generated via website, voice agent, or email will appear here."}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 border border-amber-500 bg-amber-400/20 px-5 py-2.5 font-display text-xs tracking-widest font-bold uppercase text-amber-300 hover:bg-amber-400 hover:text-zinc-950 transition-all rounded-sm"
              >
                <Plus size={15} />
                <span>Add First Lead</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#141620] font-display text-xs uppercase tracking-wider text-zinc-300 font-bold">
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Tag</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created At</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#1f2232] transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-100 font-bold">{lead.name}</span>
                        </div>
                        {lead.message && (
                          <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-xs font-normal">
                            "{lead.message}"
                          </p>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-zinc-200">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-zinc-200 hover:text-amber-300 transition-colors font-medium underline-offset-2 hover:underline"
                          >
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-zinc-200 whitespace-nowrap font-medium">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-zinc-200 hover:text-amber-300 transition-colors"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Source Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center border px-2.5 py-1 font-display text-[0.7rem] tracking-wider uppercase rounded-sm ${getSourceBadgeClass(
                            lead.source
                          )}`}
                        >
                          {lead.source.replace("_", " ")}
                        </span>
                      </td>

                      {/* Tag Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-display text-[0.7rem] tracking-wider uppercase text-zinc-200 font-semibold rounded-sm">
                          {lead.tag || "WEBSITE"}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            disabled={updatingLeadId === lead.id}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`border px-2.5 py-1 font-display text-xs tracking-wider uppercase cursor-pointer focus:outline-none transition-colors rounded-sm ${getStatusBadgeClass(
                              lead.status
                            )} disabled:opacity-50`}
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option
                                key={st}
                                value={st}
                                className="bg-zinc-900 text-white font-sans"
                              >
                                {st.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-zinc-300 font-medium">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetails(lead)}
                            className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-400 hover:text-amber-300 transition-colors rounded-sm shadow-sm"
                            title="View Details & Conversations"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setLeadToDelete(lead);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-rose-500 hover:text-rose-300 transition-colors rounded-sm shadow-sm"
                            title="Delete Lead"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-zinc-800 flex items-center justify-between gap-4 bg-[#141620]">
              <span className="text-xs text-zinc-300 font-display tracking-wider uppercase font-semibold">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadLeads(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loadingLeads}
                  className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => loadLeads(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loadingLeads}
                  className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-sm"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* LEAD DETAILS & CONVERSATIONS MODAL */}
      {isDetailsModalOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="border border-zinc-700 bg-[#161824] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl rounded-sm overflow-hidden text-zinc-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#1b1e2e]">
              <div>
                <span className="font-display text-xs tracking-[0.2em] text-amber-400 uppercase font-bold">
                  Lead Details & Inquiries
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {activeLead.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border border-zinc-800 bg-[#12141c] rounded-sm">
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Email
                  </span>
                  <span className="font-bold text-white break-all mt-0.5 block">
                    {activeLead.email || "—"}
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Phone
                  </span>
                  <span className="font-bold text-white mt-0.5 block">
                    {activeLead.phone || "—"}
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Source / Tag
                  </span>
                  <span className="font-bold text-amber-300 mt-0.5 block">
                    {activeLead.source} ({activeLead.tag})
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Status
                  </span>
                  <span
                    className={`inline-block border px-2.5 py-0.5 mt-1 font-display text-xs uppercase tracking-wider rounded-sm ${getStatusBadgeClass(
                      activeLead.status
                    )}`}
                  >
                    {activeLead.status}
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Created At
                  </span>
                  <span className="text-zinc-300 mt-0.5 block font-medium">
                    {formatDate(activeLead.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs tracking-wider uppercase text-zinc-400 block font-semibold">
                    Last Updated
                  </span>
                  <span className="text-zinc-300 mt-0.5 block font-medium">
                    {formatDate(activeLead.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Initial Lead Inquiry Message */}
              {activeLead.message && (
                <div className="space-y-2">
                  <span className="font-display text-xs uppercase tracking-widest text-zinc-300 font-bold">
                    Customer Note / Tattoo Idea
                  </span>
                  <div className="p-3.5 border border-zinc-700 bg-[#12141c] text-zinc-100 whitespace-pre-wrap leading-relaxed rounded-sm font-normal">
                    {activeLead.message}
                  </div>
                </div>
              )}

              {/* Conversation History */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-widest text-amber-300 flex items-center gap-1.5 font-bold">
                    <MessageSquare size={14} className="text-amber-400" />
                    Conversation History (
                    {activeLead.conversations?.length || 0})
                  </span>
                </div>

                {loadingActiveLead ? (
                  <div className="py-6 text-center text-zinc-300 text-xs">
                    Loading conversation messages...
                  </div>
                ) : !activeLead.conversations || activeLead.conversations.length === 0 ? (
                  <div className="p-4 border border-dashed border-zinc-700 bg-[#12141c] text-center text-xs text-zinc-300 rounded-sm">
                    No transcript or messages logged yet for this lead.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {activeLead.conversations.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 border text-xs sm:text-sm rounded-sm ${
                          msg.role === "assistant"
                            ? "bg-amber-500/10 border-amber-500/40 ml-4 text-white"
                            : "bg-[#12141c] border-zinc-700 mr-4 text-zinc-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 text-xs font-display uppercase tracking-wider text-zinc-400">
                          <span
                            className={
                              msg.role === "assistant"
                                ? "text-amber-300 font-bold"
                                : "text-white font-bold"
                            }
                          >
                            {msg.role === "assistant" ? "AI Receptionist" : activeLead.name} ({msg.channel})
                          </span>
                          <span className="text-zinc-400">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap font-normal">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add message form */}
                <form
                  onSubmit={handleSendConversationMessage}
                  className="pt-3 border-t border-zinc-800 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={newMsgRole}
                      onChange={(e) =>
                        setNewMsgRole(e.target.value as "user" | "assistant")
                      }
                      className="border border-zinc-700 bg-zinc-900 py-1.5 px-2.5 text-xs uppercase font-display tracking-wider text-zinc-200 focus:border-amber-400 focus:outline-none rounded-sm font-semibold"
                    >
                      <option value="assistant">As AI Receptionist</option>
                      <option value="user">As User / Customer</option>
                    </select>

                    <select
                      value={newMsgChannel}
                      onChange={(e) => setNewMsgChannel(e.target.value)}
                      className="border border-zinc-700 bg-zinc-900 py-1.5 px-2.5 text-xs uppercase font-display tracking-wider text-zinc-200 focus:border-amber-400 focus:outline-none rounded-sm font-semibold"
                    >
                      {CONVERSATION_CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMsgContent}
                      onChange={(e) => setNewMsgContent(e.target.value)}
                      placeholder="Add note or message transcript..."
                      className="flex-1 border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm"
                    />
                    <button
                      type="submit"
                      disabled={sendingMsg || !newMsgContent.trim()}
                      className="border border-amber-500 bg-amber-400 px-4 py-2.5 font-display text-xs tracking-wider uppercase font-bold text-zinc-950 disabled:opacity-50 hover:bg-amber-300 flex items-center gap-1.5 rounded-sm"
                    >
                      <Send size={13} />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#12141c] flex items-center justify-between">
              <button
                onClick={() => {
                  setLeadToDelete(activeLead);
                  setIsDetailsModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
                className="text-xs text-rose-300 hover:text-rose-200 font-display uppercase tracking-wider flex items-center gap-1 font-bold"
              >
                <Trash2 size={14} />
                <span>Delete Lead</span>
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="border border-zinc-700 bg-zinc-800 px-5 py-2 font-display text-xs tracking-widest uppercase text-white hover:border-amber-400 hover:text-amber-300 transition-colors font-bold rounded-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="border border-zinc-700 bg-[#161824] w-full max-w-lg shadow-2xl rounded-sm overflow-hidden text-zinc-100">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#1b1e2e]">
              <div>
                <span className="font-display text-xs tracking-[0.2em] text-amber-400 uppercase font-bold">
                  CRM Entry
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  Register New Lead
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 border border-rose-500/50 bg-rose-950/40 text-rose-100 text-xs flex items-center gap-2 rounded-sm font-medium">
                  <AlertCircle size={16} className="text-rose-400 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) =>
                    setNewLeadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Marcus Vance"
                  className="w-full border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email || ""}
                    onChange={(e) =>
                      setNewLeadForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="e.g. marcus@example.com"
                    className="w-full border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newLeadForm.phone || ""}
                    onChange={(e) =>
                      setNewLeadForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="e.g. +14035550192"
                    className="w-full border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                    Source
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => {
                      const s = e.target.value;
                      const tagMap: Record<string, string> = {
                        voice_agent: "VOICE_AGENT",
                        email: "EMAIL",
                        website: "WEBSITE",
                        instagram: "INSTAGRAM",
                        facebook: "FACEBOOK",
                        sms: "SMS",
                        other: "OTHER",
                      };
                      setNewLeadForm((prev) => ({
                        ...prev,
                        source: s,
                        tag: tagMap[s] || "WEBSITE",
                      }));
                    }}
                    className="w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                  >
                    {LEAD_SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                    Tag
                  </label>
                  <select
                    value={newLeadForm.tag}
                    onChange={(e) =>
                      setNewLeadForm((prev) => ({ ...prev, tag: e.target.value }))
                    }
                    className="w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                  >
                    {LEAD_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                    Initial Status
                  </label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) =>
                      setNewLeadForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-display text-xs uppercase tracking-widest text-zinc-300 block font-bold">
                  Tattoo Concept / Notes
                </label>
                <textarea
                  rows={3}
                  value={newLeadForm.message || ""}
                  onChange={(e) =>
                    setNewLeadForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="e.g. Small fine-line dragon on left forearm..."
                  className="w-full border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none rounded-sm font-medium"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border border-zinc-700 bg-zinc-800 px-5 py-2.5 font-display text-xs tracking-widest uppercase text-white hover:border-amber-400 hover:text-amber-300 transition-colors font-bold rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="border border-amber-500 bg-amber-400 px-6 py-2.5 font-display text-xs tracking-widest font-bold uppercase text-zinc-950 hover:bg-amber-300 disabled:opacity-50 transition-all rounded-sm shadow-md"
                >
                  {createSubmitting ? "Creating..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="border border-rose-500/50 bg-[#161824] w-full max-w-md p-6 shadow-2xl space-y-4 rounded-sm">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle size={24} />
              <h3 className="font-display text-lg font-bold text-white">
                Delete Lead Confirmation
              </h3>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed font-normal">
              Are you sure you want to delete{" "}
              <strong className="text-white font-bold">{leadToDelete.name}</strong>? This action
              cannot be undone and all associated conversations will be removed.
            </p>
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setLeadToDelete(null);
                }}
                className="border border-zinc-700 bg-zinc-800 px-5 py-2 font-display text-xs tracking-widest uppercase text-white hover:border-amber-400 hover:text-amber-300 transition-colors font-bold rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="border border-rose-500 bg-rose-600 px-5 py-2 font-display text-xs tracking-widest font-bold uppercase text-white hover:bg-rose-500 transition-colors rounded-sm shadow-md"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-[#141620] px-6 py-6 text-center text-xs text-zinc-300 font-medium">
        Tattoon CRM Hub — Powered by Express.js & PostgreSQL
      </footer>
    </div>
  );
}
