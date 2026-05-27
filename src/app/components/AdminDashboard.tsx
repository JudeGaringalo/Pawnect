import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Flag,
  Loader2,
  Clock,
  Eye,
} from "lucide-react";
import { useAuth, SERVER_URL } from "./AuthContext";
import { toast } from "sonner";

interface AdminStats {
  totalReports: number;
  lostCases: number;
  foundCases: number;
  reunited: number;
  flaggedPosts: number;
  activeUsers: number;
}

interface FlaggedPost {
  id: string;
  report_id: string | null;
  reason: string;
  status: string;
  created_at: string;
  pet_reports: {
    id: string;
    pet_name: string | null;
    location: string | null;
    location_name?: string | null;
    status: string;
    report_type?: string;
  } | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  target: string | null;
  target_id?: string | null;
  target_type?: string | null;
  profiles: {
    full_name: string | null;
  } | null;
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function readableAction(action: string) {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading: authLoading,
    getAuthHeader,
    isAdmin,
  } = useAuth();

  const [selectedTab, setSelectedTab] = useState<
    "overview" | "flagged" | "activity"
  >("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [flags, setFlags] = useState<FlaggedPost[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    string | null
  >(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/stats`, {
      headers: getAuthHeader(),
    });

    const json = await res.json();

    if (res.ok) {
      setStats(json.data);
    } else {
      console.log("Admin stats error:", json.error);
    }
  }, [getAuthHeader]);

  const fetchFlags = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/flags`, {
      headers: getAuthHeader(),
    });

    const json = await res.json();

    if (res.ok) {
      setFlags(json.data ?? []);
    } else {
      console.log("Admin flags error:", json.error);
    }
  }, [getAuthHeader]);

  const fetchActivity = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/activity`, {
      headers: getAuthHeader(),
    });

    const json = await res.json();

    if (res.ok) {
      setActivity(json.data ?? []);
    } else {
      console.log("Admin activity error:", json.error);
    }
  }, [getAuthHeader]);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchStats(),
        fetchFlags(),
        fetchActivity(),
      ]);
    } catch (err) {
      console.log("Admin fetch error:", err);
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchFlags, fetchActivity]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchAll();
  }, [user, authLoading, navigate, fetchAll]);

  const handleFlagAction = async (
    flagId: string,
    action: "approve" | "remove" | "duplicate",
  ) => {
    setActionLoading(`${flagId}-${action}`);

    try {
      const res = await fetch(
        `${SERVER_URL}/admin/flags/${flagId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({ action }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Action failed");
      }

      setFlags((prev) =>
        prev.filter((flag) => flag.id !== flagId),
      );

      if (action === "approve") {
        toast.success("Flag reviewed and report kept active");
      } else if (action === "remove") {
        toast.success("Report removed");
      } else {
        toast.success("Marked as duplicate");
      }

      await Promise.all([fetchStats(), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (
    !isAdmin &&
    profile?.role !== "admin" &&
    profile?.is_admin !== true
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-md">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-500 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => navigate("/feed")}
            className="px-6 py-3 bg-[#263143] text-white rounded-full"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "Total Reports",
          value: stats.totalReports,
          icon: <FileText className="w-6 h-6" />,
          color: "bg-blue-100 text-blue-700",
        },
        {
          label: "Active Lost Cases",
          value: stats.lostCases,
          icon: <AlertTriangle className="w-6 h-6" />,
          color: "bg-red-100 text-red-700",
        },
        {
          label: "Found Cases",
          value: stats.foundCases,
          icon: <CheckCircle className="w-6 h-6" />,
          color: "bg-teal-100 text-teal-700",
        },
        {
          label: "Reunited",
          value: stats.reunited,
          icon: <CheckCircle className="w-6 h-6" />,
          color: "bg-emerald-100 text-emerald-700",
        },
        {
          label: "Flagged Posts",
          value: stats.flaggedPosts,
          icon: <Flag className="w-6 h-6" />,
          color: "bg-orange-100 text-orange-700",
        },
        {
          label: "Active Users",
          value: stats.activeUsers,
          icon: <Users className="w-6 h-6" />,
          color: "bg-purple-100 text-purple-700",
        },
      ]
    : [];

  const successRate =
    stats && stats.totalReports > 0
      ? Math.round((stats.reunited / stats.totalReports) * 100)
      : 0;

  const unresolvedFlags = flags.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/feed")}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-slate-500">
                    Moderation & Analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Online
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            {
              id: "flagged",
              label: `Flagged ${unresolvedFlags ? `(${unresolvedFlags})` : ""}`,
            },
            { id: "activity", label: "Activity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setSelectedTab(
                  tab.id as "overview" | "flagged" | "activity",
                )
              }
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-purple-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Moderation Overview
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Live prototype metrics from Supabase reports,
                users, and flags.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500 mb-1">
                    Success Rate
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {successRate}%
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Reunited reports divided by total reports.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500 mb-1">
                    Pending Flags
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {stats?.flaggedPosts ?? 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Reports waiting for moderation.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500 mb-1">
                    Avg Recovery Time
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    —
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Prototype metric. Add a reunited_at column
                    later for exact tracking.
                  </p>
                </div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedTab("flagged")}
                  className="w-full px-4 py-3 bg-orange-50 text-orange-700 rounded-xl text-left font-medium hover:bg-orange-100 transition-colors"
                >
                  Review flagged posts
                </button>

                <button
                  onClick={() => navigate("/feed")}
                  className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl text-left font-medium hover:bg-slate-100 transition-colors"
                >
                  View public feed
                </button>

                <button
                  onClick={() => navigate("/map")}
                  className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl text-left font-medium hover:bg-slate-100 transition-colors"
                >
                  View map pins
                </button>
              </div>
            </aside>
          </div>
        )}

        {selectedTab === "flagged" && (
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Flagged Posts
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Review reports flagged by the community.
              </p>
            </div>

            {flags.length === 0 ? (
              <div className="p-12 text-center">
                <Flag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">
                  No pending flags
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Flagged reports will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {flags.map((flag) => {
                  const report = flag.pet_reports;
                  const loadingThis = actionLoading?.startsWith(
                    flag.id,
                  );

                  return (
                    <div
                      key={flag.id}
                      className="p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Flag className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-slate-900">
                              {report?.pet_name ||
                                "Unknown pet"}
                            </h3>
                          </div>

                          <p className="text-sm text-slate-600 mb-2">
                            Reason:{" "}
                            <span className="font-medium text-slate-800">
                              {flag.reason}
                            </span>
                          </p>

                          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                            <span>
                              Reporter:{" "}
                              {flag.profiles?.full_name ||
                                "Unknown user"}
                            </span>
                            <span>•</span>
                            <span>
                              Location:{" "}
                              {report?.location ||
                                report?.location_name ||
                                "Unknown location"}
                            </span>
                            <span>•</span>
                            <span>
                              {timeAgo(flag.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {report?.id && (
                            <button
                              onClick={() =>
                                navigate(`/post/${report.id}`)
                              }
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          )}

                          <button
                            disabled={!!loadingThis}
                            onClick={() =>
                              handleFlagAction(
                                flag.id,
                                "approve",
                              )
                            }
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors disabled:opacity-60 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Keep
                          </button>

                          <button
                            disabled={!!loadingThis}
                            onClick={() =>
                              handleFlagAction(
                                flag.id,
                                "duplicate",
                              )
                            }
                            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-60"
                          >
                            Duplicate
                          </button>

                          <button
                            disabled={!!loadingThis}
                            onClick={() =>
                              handleFlagAction(
                                flag.id,
                                "remove",
                              )
                            }
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-60 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {selectedTab === "activity" && (
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Admin Activity
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Recent moderation and report actions.
              </p>
            </div>

            {activity.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">
                  No activity yet
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Admin and report activity will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {readableAction(item.action)}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        By{" "}
                        {item.profiles?.full_name || "System"} •{" "}
                        {timeAgo(item.created_at)}
                      </p>
                      {(item.target || item.target_id) && (
                        <p className="text-xs text-slate-400 mt-1">
                          Target:{" "}
                          {item.target || item.target_id}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}