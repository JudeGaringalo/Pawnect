import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  FileText,
  Bookmark,
  MessageCircle,
  Bell,
  TrendingUp,
  CheckCircle,
  Plus,
} from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Reports', value: 2, icon: <FileText className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
    { label: 'Saved Posts', value: 8, icon: <Bookmark className="w-6 h-6" />, color: 'bg-teal-100 text-teal-700' },
    { label: 'Comments', value: 15, icon: <MessageCircle className="w-6 h-6" />, color: 'bg-purple-100 text-purple-700' },
    { label: 'Reunited', value: 1, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-700' },
  ];

  const myReports = [
    {
      id: 1,
      name: 'Luna',
      status: 'lost',
      type: 'Dog',
      location: 'Quezon City',
      date: 'May 22, 2026',
      views: 124,
      comments: 8,
      image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=300&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Mochi',
      status: 'reunited',
      type: 'Cat',
      location: 'Makati',
      date: 'May 20, 2026',
      views: 89,
      comments: 23,
      image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&h=200&fit=crop',
    },
  ];

  const savedPosts = [
    {
      id: 3,
      name: 'Bruno',
      status: 'lost',
      type: 'Dog',
      location: 'Mandaluyong',
      image: 'https://images.unsplash.com/photo-1629555256341-09e5e9871647?w=300&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Unknown Cat',
      status: 'found',
      type: 'Cat',
      location: 'Pasig',
      image: 'https://images.unsplash.com/photo-1558623535-33cc88178982?w=300&h=200&fit=crop',
    },
  ];

  const recentActivity = [
    { text: 'New comment on your post "Luna"', time: '2 hours ago', type: 'comment' },
    { text: 'Your report received 10 new views', time: '5 hours ago', type: 'view' },
    { text: 'Someone saved your post', time: '1 day ago', type: 'save' },
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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                MS
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Maria Santos</h1>
                <p className="text-slate-600 mb-3">Pet owner & community member</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>Quezon City, Philippines</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/create-report')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Report
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Reports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">My Reports</h2>
                <button className="text-teal-600 hover:text-teal-700 font-medium">View All</button>
              </div>

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
                      <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={report.image} alt={report.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{report.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.status === 'lost'
                                ? 'bg-red-100 text-red-700'
                                : report.status === 'reunited'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {report.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">
                          {report.type} • {report.location}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{report.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{report.comments} comments</span>
                          </div>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Saved Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Saved Posts</h2>
                <button className="text-teal-600 hover:text-teal-700 font-medium">View All</button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {savedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{post.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {post.type} • {post.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <Plus className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">Create New Report</span>
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">View Map</span>
                </button>
                <button
                  onClick={() => navigate('/reunited')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
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
