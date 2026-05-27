import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  AlertCircle,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');

  const post = {
    id: 1,
    status: 'lost',
    petName: 'Luna',
    type: 'Dog',
    breed: 'Golden Retriever',
    color: 'Golden',
    size: 'Large',
    gender: 'Female',
    location: 'Quezon City, near Barangay Hall',
    date: 'May 22, 2026',
    time: '6:30 PM',
    description:
      'Lost near the barangay hall. Wearing a red collar with silver tag. Very friendly and responds to her name. Last seen running towards the park. Please contact me if you have any information.',
    image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=800&h=600&fit=crop',
    ownerName: 'Maria Santos',
    ownerAvatar: 'MS',
    reactions: 24,
    comments: [
      {
        id: 1,
        user: 'Juan Reyes',
        avatar: 'JR',
        text: 'Seen near the barangay hall around 6:30 PM. She was walking towards the market.',
        time: '2 hours ago',
      },
      {
        id: 2,
        user: 'Sofia Cruz',
        avatar: 'SC',
        text: 'This looks like the dog I saw yesterday near the convenience store. I will keep an eye out!',
        time: '4 hours ago',
      },
      {
        id: 3,
        user: 'Miguel Torres',
        avatar: 'MT',
        text: 'I shared this with our barangay group. Hoping we can find Luna soon!',
        time: '5 hours ago',
      },
    ],
  };

  const activity = [
    { type: 'posted', user: 'Maria Santos', time: '8 hours ago' },
    { type: 'comment', user: 'Juan Reyes', time: '2 hours ago' },
    { type: 'comment', user: 'Sofia Cruz', time: '4 hours ago' },
  ];

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComment('');
    }
  };

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

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSaved(!saved)}
                className={`p-2 rounded-full transition-colors ${
                  saved ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
              </motion.button>
              <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              {/* Owner Info */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#263143] flex items-center justify-center text-white font-semibold">
                    {post.ownerAvatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{post.ownerName}</div>
                    <div className="text-sm text-slate-500">
                      {post.date} • {post.time}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${
                    post.status === 'lost'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {post.status.toUpperCase()}
                </span>
              </div>

              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.petName} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.petName}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Type & Breed</div>
                    <div className="font-medium text-slate-900">
                      {post.type} • {post.breed}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Color & Size</div>
                    <div className="font-medium text-slate-900">
                      {post.color} • {post.size}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Gender</div>
                    <div className="font-medium text-slate-900">{post.gender}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Last Seen</div>
                    <div className="font-medium text-slate-900">{post.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{post.location}</span>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">{post.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLiked(!liked)}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="font-medium">{post.reactions}</span>
                  </motion.button>
                  <button className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{post.comments.length}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* I Have Information Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full py-4 bg-[#263143] text-white rounded-xl font-medium hover:bg-[#1F2937] hover:shadow-lg transition-all"
            >
              I Have Information
            </motion.button>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mt-4"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Comments ({post.comments.length})
              </h2>

              {/* Comment Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#45556C] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    U
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share any information that might help..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={3}
                    ></textarea>
                    <button
                      onClick={handleSubmitComment}
                      className="mt-2 px-6 py-2 bg-[#263143] text-white rounded-full hover:bg-[#1F2937] transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="font-semibold text-slate-900 mb-1">{comment.user}</div>
                        <p className="text-slate-700">{comment.text}</p>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">{comment.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Location</h3>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-12 h-12 text-slate-400" />
              </div>
              <button
                onClick={() => navigate('/map')}
                className="w-full py-3 bg-[#D8E2F0] text-[#0F172B] rounded-xl hover:bg-[#1F2937] hover:text-white transition-colors font-medium"
              >
                View on Map
              </button>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Activity</h3>
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D8E2F0] flex items-center justify-center flex-shrink-0">
                      {item.type === 'posted' ? (
                        <AlertCircle className="w-4 h-4 text-[#0F172B]" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-[#0F172B]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{item.user}</span>{' '}
                        {item.type === 'posted' ? 'posted this report' : 'left a comment'}
                      </p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mark as Reunited */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#E2E8F0] rounded-2xl border border-black-300 p-6"
            >
              <CheckCircle className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-[#0F172B] mb-2">Found your pet?</h3>
              <p className="text-sm text-[#45556C] mb-4">
                Mark this post as reunited to celebrate with the community!
              </p>
              <button className="w-full py-3 bg-[#263143] text-white rounded-xl hover:bg-[#1F2937] transition-colors font-medium">
                Mark as Reunited
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
