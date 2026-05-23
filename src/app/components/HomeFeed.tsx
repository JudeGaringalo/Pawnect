import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  MapPin,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Bookmark,
  Map,
  Plus,
  Bell,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function HomeFeed() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'lost', label: 'Lost' },
    { id: 'found', label: 'Found' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'dogs', label: 'Dogs' },
    { id: 'cats', label: 'Cats' },
    { id: 'reunited', label: 'Reunited' },
  ];

  const petPosts = [
    {
      id: 1,
      status: 'lost',
      petName: 'Luna',
      type: 'Dog',
      breed: 'Golden Retriever',
      color: 'Golden',
      size: 'Large',
      location: 'Quezon City, near Barangay Hall',
      date: 'May 22, 2026',
      time: '6:30 PM',
      description: 'Lost near the barangay hall. Wearing a red collar with silver tag.',
      image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=600&h=400&fit=crop',
      reactions: 24,
      comments: 8,
      isPossibleMatch: false,
    },
    {
      id: 2,
      status: 'found',
      petName: 'Unknown',
      type: 'Cat',
      breed: 'Domestic Shorthair',
      color: 'White with black patches',
      size: 'Medium',
      location: 'Pasig, near Ortigas Center',
      date: 'May 23, 2026',
      time: '8:00 AM',
      description: 'Found near the convenience store this morning. Very friendly and well-groomed.',
      image: 'https://images.unsplash.com/photo-1558623535-33cc88178982?w=600&h=400&fit=crop',
      reactions: 15,
      comments: 5,
      isPossibleMatch: true,
    },
    {
      id: 3,
      status: 'lost',
      petName: 'Bruno',
      type: 'Dog',
      breed: 'Aspin',
      color: 'Brown',
      size: 'Medium',
      location: 'Mandaluyong, Shaw Boulevard',
      date: 'May 21, 2026',
      time: '4:00 PM',
      description: 'Missing since yesterday afternoon. Last seen running towards the park.',
      image: 'https://images.unsplash.com/photo-1629555256341-09e5e9871647?w=600&h=400&fit=crop',
      reactions: 42,
      comments: 15,
      isPossibleMatch: false,
    },
    {
      id: 4,
      status: 'reunited',
      petName: 'Mochi',
      type: 'Cat',
      breed: 'Persian',
      color: 'White',
      size: 'Small',
      location: 'Makati, Ayala Avenue',
      date: 'May 20, 2026',
      time: '10:00 AM',
      description: 'Successfully reunited! Thank you to everyone who helped.',
      image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=600&h=400&fit=crop',
      reactions: 89,
      comments: 23,
      isPossibleMatch: false,
    },
    {
      id: 5,
      status: 'found',
      petName: 'Unknown',
      type: 'Dog',
      breed: 'Mixed breed',
      color: 'Black',
      size: 'Small',
      location: 'Taguig, BGC',
      date: 'May 23, 2026',
      time: '7:30 AM',
      description: 'Found wandering near the park. Looks scared and hungry.',
      image: 'https://images.unsplash.com/photo-1583787317796-2bc56f8556e2?w=600&h=400&fit=crop',
      reactions: 18,
      comments: 6,
      isPossibleMatch: false,
    },
  ];

  const recentActivity = [
    { pet: 'Max', status: 'reunited', time: '2 hours ago' },
    { pet: 'Bella', status: 'new', time: '3 hours ago' },
    { pet: 'Coco', status: 'comment', time: '5 hours ago' },
  ];

  const toggleSave = (postId: number) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'found':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reunited':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lost':
        return <AlertCircle className="w-4 h-4" />;
      case 'found':
        return <MapPin className="w-4 h-4" />;
      case 'reunited':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-xl">Pawnect</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/create-report')}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Report Pet</span>
              </button>
              <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <User className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by pet name, breed, color, or location"
                onClick={() => navigate('/search')}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            {/* Filters */}
            <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Pet Posts */}
            <div className="space-y-4">
              {petPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                        {post.petName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{post.petName}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {getStatusIcon(post.status)}
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          {post.isPossibleMatch && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              Possible Match
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">
                          {post.date} • {post.time}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div
                    className="aspect-[16/10] overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <img
                      src={post.image}
                      alt={post.petName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Post Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Type & Breed</div>
                        <div className="text-sm font-medium text-slate-900">
                          {post.type} • {post.breed}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Color & Size</div>
                        <div className="text-sm font-medium text-slate-900">
                          {post.color} • {post.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-sm text-slate-700">{post.location}</span>
                    </div>

                    <p className="text-slate-700 mb-4">{post.description}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                          <span className="text-sm font-medium">{post.reactions}</span>
                        </motion.button>
                        <button
                          onClick={() => navigate(`/post/${post.id}`)}
                          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSave(post.id)}
                          className={`p-2 rounded-full transition-colors ${
                            savedPosts.has(post.id)
                              ? 'bg-teal-100 text-teal-600'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Bookmark
                            className={`w-5 h-5 ${savedPosts.has(post.id) ? 'fill-current' : ''}`}
                          />
                        </motion.button>
                        <button
                          onClick={() => navigate('/map')}
                          className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors text-sm font-medium"
                        >
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/map')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <Map className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">View Map</span>
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <Search className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">Advanced Search</span>
                </button>
                <button
                  onClick={() => navigate('/reunited')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Success Stories</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      {activity.status === 'reunited' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : activity.status === 'new' ? (
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-teal-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">
                        {activity.pet}{' '}
                        {activity.status === 'reunited'
                          ? 'was reunited'
                          : activity.status === 'new'
                          ? 'reported'
                          : 'has new comment'}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Safety Reminder</h3>
              <p className="text-sm text-slate-700">
                Always meet in public places when arranging pet returns. Verify ownership before releasing a pet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 gap-2 p-4">
          <button className="flex flex-col items-center gap-1 text-teal-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>
          <button
            onClick={() => navigate('/search')}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">Map</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
