import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Shield, AlertTriangle, TrendingUp, Users, FileText,
  CheckCircle, XCircle, Flag, Loader2, Clock,
} from 'lucide-react';
import { useAuth, SERVER_URL } from './AuthContext';
import { toast } from 'sonner';

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
  reason: string;
  status: string;
  created_at: string;
  pet_reports: { id: string; pet_name: string; location: string; status: string } | null;
  profiles: { full_name: string } | null;
}

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  target: string | null;
  profiles: { full_name: string } | null;
}

function timeAgo(s: string) {
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, getAuthHeader } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [flags, setFlags] = useState<FlaggedPost[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/stats`, { headers: getAuthHeader() });
    const json = await res.json();
    if (res.ok) setStats(json.data);
    else console.log('Admin stats error:', json.error);
  }, []);

  const fetchFlags = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/flags`, { headers: getAuthHeader() });
    const json = await res.json();
    if (res.ok) setFlags(json.data ?? []);
  }, []);

  const fetchActivity = useCallback(async () => {
    const res = await fetch(`${SERVER_URL}/admin/activity`, { headers: getAuthHeader() });
    const json = await res.json();
    if (res.ok) setActivity(json.data ?? []);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (profile && !profile.is_admin) { navigate('/feed'); return; }
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchFlags(), fetchActivity()]);
      setLoading(false);
    };
    load();
  }, [user, profile, authLoading]);

  const handleFlagAction = async (flagId: string, action: string) => {
    setActionLoading(flagId + action);
    try {
      const res = await fetch(`${SERVER_URL}/admin/flags/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (res.ok) {
        setFlags((prev) => prev.filter((f) => f.id !== flagId));
        toast.success(`Post ${action}d successfully`);
        fetchStats();
      } else {
        toast.error(json.error || 'Action failed');
      }
    } catch {
      toast.error('Network error');
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

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">You need admin privileges to access this page.</p>
          <button onClick={() => navigate('/feed')} className="px-6 py-3 bg-[#263143] text-white rounded-full">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Total Reports', value: stats.totalReports, change: '', icon: <FileText className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
        { label: 'Active Lost Cases', value: stats.lostCases, change: '', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-100 text-red-700' },
        { label: 'Found Cases', value: stats.foundCases, change: '', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-teal-100 text-teal-700' },
        { label: 'Reunited', value: stats.reunited, change: '', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Flagged Posts', value: stats.flaggedPosts, change: '', icon: <Flag className="w-6 h-6" />, color: 'bg-orange-100 text-orange-700' },
        { label: 'Active Users', value: stats.activeUsers, change: '', icon: <Users className="w-6 h-6" />, color: 'bg-purple-100 text-purple-700' },
      ]
    : [];

  const successRate = stats && stats.totalReports > 0
    ? Math.round((stats.reunited / stats.totalReports) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/feed')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900">Admin Dashboard</h1>
                  <p className="text-xs text-slate-500">Moderation & Analytics</p>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Online</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['overview', 'flagged', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'flagged' && flags.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">{flags.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedTab === 'flagged' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">Flagged Posts</h2>
                  <p className="text-sm text-slate-600 mt-1">Review and moderate reports flagged by the community</p>
                </div>

                {flags.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Flag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No flagged posts to review</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {flags.map((flag) => (
                      <div key={flag.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">
                                {flag.pet_reports?.pet_name || 'Unknown Pet'}
                              </h3>
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                Flagged
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">
                              Reporter: {flag.profiles?.full_name || 'Anonymous'} • {flag.pet_reports?.location || '—'}
                            </p>
                          </div>
                          <span className="text-xs text-slate-500">{timeAgo(flag.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-slate-700">Reason: {flag.reason}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleFlagAction(flag.id, 'approve')}
                            disabled={actionLoading !== null}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === flag.id + 'approve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Keep Post
                          </button>
                          <button
                            onClick={() => handleFlagAction(flag.id, 'remove')}
                            disabled={actionLoading !== null}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === flag.id + 'remove' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Remove Post
                          </button>
                          <button
                            onClick={() => flag.pet_reports && navigate(`/post/${flag.pet_reports.id}`)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'overview' && stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Platform Overview</h2>

                <div className="aspect-[2/1] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center text-slate-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      {stats.totalReports} total reports tracked
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{successRate}%</div>
                    <div className="text-sm text-slate-600">Success Rate</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stats.reunited}</div>
                    <div className="text-sm text-slate-600">Total Reunited</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stats.lostCases}</div>
                    <div className="text-sm text-slate-600">Active Lost Cases</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stats.activeUsers}</div>
                    <div className="text-sm text-slate-600">Registered Users</div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">Activity Log</h2>
                  <p className="text-sm text-slate-600 mt-1">Recent system events and moderation actions</p>
                </div>

                {activity.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {activity.map((item, index) => (
                      <div key={item.id || index} className="p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 mb-1">
                            <span className="font-medium">{item.action.replace(/_/g, ' ')}</span>
                            {item.target && ` — ${item.target}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.profiles?.full_name || 'System'} • {timeAgo(item.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
              {stats && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Reports</span>
                    <span className="font-semibold text-slate-900">{stats.totalReports}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Pending Flags</span>
                    <span className="font-semibold text-orange-600">{stats.flaggedPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Reunited Cases</span>
                    <span className="font-semibold text-emerald-600">{stats.reunited}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Success Rate</span>
                    <span className="font-semibold text-slate-900">{successRate}%</span>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">System Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Database', status: 'Healthy' },
                  { label: 'API', status: 'Online' },
                  { label: 'Storage', status: 'Active' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {item.status}
                    </span>
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
