import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const stats = [
    {
      label: "Total Reports",
      value: 1247,
      change: "+12%",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Active Lost Cases",
      value: 342,
      change: "+8%",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Found Cases",
      value: 198,
      change: "+15%",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-teal-100 text-teal-700",
    },
    {
      label: "Reunited",
      value: 89,
      change: "+23%",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Flagged Posts",
      value: 12,
      change: "-5%",
      icon: <Flag className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Active Users",
      value: 3542,
      change: "+18%",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const flaggedPosts = [
    {
      id: 1,
      petName: "Unknown",
      reporter: "suspicious_user_123",
      reason: "Duplicate post",
      location: "Quezon City",
      date: "May 23, 2026",
    },
    {
      id: 2,
      petName: "Max",
      reporter: "test_account",
      reason: "Spam content",
      location: "Pasig",
      date: "May 22, 2026",
    },
    {
      id: 3,
      petName: "Luna",
      reporter: "fake_report",
      reason: "Suspicious activity",
      location: "Makati",
      date: "May 21, 2026",
    },
  ];

  const recentActivity = [
    {
      action: "Report approved",
      user: "admin_maria",
      target: "Luna report",
      time: "5 min ago",
    },
    {
      action: "Post flagged",
      user: "system",
      target: "Unknown cat",
      time: "15 min ago",
    },
    {
      action: "User banned",
      user: "admin_juan",
      target: "spam_account",
      time: "1 hour ago",
    },
    {
      action: "Report removed",
      user: "admin_maria",
      target: "Duplicate post",
      time: "2 hours ago",
    },
  ];

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

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Online
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith("+")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
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

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {["overview", "flagged", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-purple-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedTab === "flagged" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Flagged Posts
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Review and moderate reports flagged by the
                    community or system
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {flaggedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {post.petName}
                            </h3>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              Flagged
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Reporter: {post.reporter} •{" "}
                            {post.location}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {post.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-slate-700">
                          Reason: {post.reason}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Remove
                        </button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                          Mark Duplicate
                        </button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Platform Overview
                </h2>

                {/* Chart Placeholder */}
                <div className="aspect-[2/1] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center text-slate-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">
                      Reports Analytics Chart
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      73%
                    </div>
                    <div className="text-sm text-slate-600">
                      Success Rate
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      2.4 days
                    </div>
                    <div className="text-sm text-slate-600">
                      Avg. Recovery Time
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      45
                    </div>
                    <div className="text-sm text-slate-600">
                      Reports This Week
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      98%
                    </div>
                    <div className="text-sm text-slate-600">
                      User Satisfaction
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Activity Log
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Recent moderation actions and system events
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="p-6 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 mb-1">
                          <span className="font-medium">
                            {activity.action}
                          </span>{" "}
                          on {activity.target}
                        </p>
                        <p className="text-xs text-slate-500">
                          By {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Today's Reports
                  </span>
                  <span className="font-semibold text-slate-900">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Pending Review
                  </span>
                  <span className="font-semibold text-slate-900">
                    8
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Active Moderators
                  </span>
                  <span className="font-semibold text-slate-900">
                    3
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Response Time
                  </span>
                  <span className="font-semibold text-slate-900">
                    2 hours
                  </span>
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Database
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    API
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Storage
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    68% Used
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Moderators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                Active Moderators
              </h3>
              <div className="space-y-3">
                {[
                  "Maria Santos",
                  "Juan Reyes",
                  "Sofia Cruz",
                ].map((mod, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {mod
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {mod}
                      </p>
                      <p className="text-xs text-emerald-600">
                        Online
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}