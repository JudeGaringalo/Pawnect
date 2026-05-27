import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, FileText, Bookmark, MessageCircle, Bell,
  TrendingUp, CheckCircle, Plus, Loader2, LogOut,
} from 'lucide-react';
import { useAuth, SERVER_URL } from './AuthContext';
import { toast } from 'sonner';

interface PetReport {
  id: string;
  pet_name: string;
  status: 'lost' | 'found' | 'reunited';
  pet_type: string;
  location: string;
  created_at: string;
  photo_url: string | null;
  reaction_count: number;
  comment_count: number;
}

interface SavedPost {
  id: string;
  pet_reports: PetReport;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Stats {
  activeReports: number;
  savedPosts: number;
  comments: number;
  reunited: number;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(s: string) {
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut, getAuthHeader } = useAuth();

  const [stats, setStats] = useState<Stats>({ activeReports: 0, savedPosts: 0, comments: 0, reunited: 0 });
  const [myReports, setMyReports] = useState<PetReport[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = getAuthHeader();
      const [statsRes, reportsRes, savedRes, notifsRes] = await Promise.all([
        fetch(`${SERVER_URL}/my-stats`, { headers }),
        fetch(`${SERVER_URL}/my-reports`, { headers }),
        fetch(`${SERVER_URL}/saved-posts`, { headers }),
        fetch(`${SERVER_URL}/notifications`, { headers }),
      ]);

      const [statsJson, reportsJson, savedJson, notifsJson] = await Promise.all([
        statsRes.json(), reportsRes.json(), savedRes.json(), notifsRes.json(),
      ]);

      if (statsRes.ok) setStats(statsJson.data);
      if (reportsRes.ok) setMyReports(reportsJson.data ?? []);
      if (savedRes.ok) setSavedPosts(savedJson.data ?? []);
      if (notifsRes.ok) setNotifications(notifsJson.data ?? []);
    } catch (err) {
      console.log('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarInitials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const statCards = [
    { label: 'Active Reports', value: stats.activeReports, icon: <FileText className="w-12 h-12" /> },
    { label: 'Saved Posts', value: stats.savedPosts, icon: <Bookmark className="w-12 h-12" /> },
    { label: 'Comments', value: stats.comments, icon: <MessageCircle className="w-12 h-12" /> },
    { label: 'Reunited', value: stats.reunited, icon: <CheckCircle className="w-12 h-12" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Feed</span>
            </button>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell className="w-6 h-6 text-slate-600" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-[#263143] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  avatarInitials
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{displayName}</h1>
                <p className="text-slate-600 mb-3">Pet owner & community member</p>
                {profile?.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.is_admin && (
                  <span className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/create-report')}
                className="px-8 py-3 bg-[#1F2937] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Report
              </button>
              {profile?.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 py-6 px-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
                <div className="w-12 h-12 rounded-xl text-[#45556C] flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* My Reports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">My Reports</h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : myReports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-slate-600 mb-4">No reports yet</p>
                  <button
                    onClick={() => navigate('/create-report')}
                    className="px-6 py-3 bg-[#263143] text-white rounded-full font-medium"
                  >
                    Create your first report
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/post/${report.id}`)}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          {report.photo_url ? (
                            <img src={report.photo_url} alt={report.pet_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{report.pet_name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.status === 'lost' ? 'bg-red-100 text-red-700'
                              : report.status === 'reunited' ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{report.pet_type} • {report.location}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{report.reaction_count} reactions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{report.comment_count} comments</span>
                            </div>
                            <span>{formatDate(report.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Saved Posts</h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : savedPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
                  No saved posts yet
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {savedPosts.map((sp, index) => {
                    const report = sp.pet_reports;
                    if (!report) return null;
                    return (
                      <motion.div
                        key={sp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/post/${report.id}`)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                          {report.photo_url ? (
                            <img src={report.photo_url} alt={report.pet_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">{report.pet_name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{report.pet_type} • {report.location}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity / Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500">No notifications yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-3 ${!notif.read ? 'opacity-100' : 'opacity-60'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#D8E2F0] flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-[#0F172B]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/create-report')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <Plus className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">Create New Report</span>
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <MapPin className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">View Map</span>
                </button>
                <button
                  onClick={() => navigate('/reunited')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <CheckCircle className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">Reunited Stories</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
