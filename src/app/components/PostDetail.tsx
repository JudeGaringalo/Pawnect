import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Heart, Bookmark, Share2, MessageCircle,
  AlertCircle, CheckCircle, Loader2, Flag,
} from 'lucide-react';
import { useAuth, SERVER_URL } from './AuthContext';
import { toast } from 'sonner';

interface Profile {
  full_name: string;
  avatar_url: string | null;
}

interface PetReport {
  id: string;
  user_id: string;
  status: 'lost' | 'found' | 'reunited';
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  size: string;
  gender: string;
  location: string;
  description: string;
  photo_url: string | null;
  created_at: string;
  incident_date: string | null;
  incident_time: string | null;
  reaction_count: number;
  comment_count: number;
  user_reacted: boolean;
  user_saved: boolean;
  profiles: Profile | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function timeAgo(s: string) {
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, getAuthHeader } = useAuth();

  const [post, setPost] = useState<PetReport | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [markingReunited, setMarkingReunited] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/reports/${id}`, {
        headers: getAuthHeader(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Post not found');
      setPost(json.data);
      setLiked(json.data.user_reacted);
      setLikeCount(json.data.reaction_count);
      setSaved(json.data.user_saved);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`${SERVER_URL}/reports/${id}/comments`, {
        headers: getAuthHeader(),
      });
      const json = await res.json();
      if (res.ok) setComments(json.data ?? []);
    } catch {}
  }, [id]);

  useEffect(() => { fetchPost(); fetchComments(); }, [fetchPost, fetchComments]);

  const toggleLike = async () => {
    if (!user) { navigate('/login'); return; }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    try {
      const res = await fetch(`${SERVER_URL}/reactions/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ report_id: id }),
      });
      const json = await res.json();
      if (res.ok) {
        setLiked(json.reacted);
        setLikeCount(json.count);
      } else {
        setLiked(wasLiked);
        setLikeCount((c) => wasLiked ? c + 1 : c - 1);
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : c - 1);
    }
  };

  const toggleSave = async () => {
    if (!user) { navigate('/login'); return; }
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      const res = await fetch(`${SERVER_URL}/saved-posts/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ report_id: id }),
      });
      const json = await res.json();
      if (res.ok) {
        setSaved(json.saved);
        toast.success(json.saved ? 'Post saved!' : 'Post unsaved');
      } else {
        setSaved(wasSaved);
        toast.error(json.error || 'Failed');
      }
    } catch {
      setSaved(wasSaved);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) { navigate('/login'); return; }
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${SERVER_URL}/reports/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ content: comment.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setComments((prev) => [json.data, ...prev]);
        setComment('');
        toast.success('Comment posted!');
      } else {
        toast.error(json.error || 'Failed to post comment');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleMarkReunited = async () => {
    if (!user || !post) return;
    setMarkingReunited(true);
    try {
      const res = await fetch(`${SERVER_URL}/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status: 'reunited' }),
      });
      const json = await res.json();
      if (res.ok) {
        setPost((p) => p ? { ...p, status: 'reunited' } : p);
        toast.success('🎉 Marked as reunited! Congratulations!');
      } else {
        toast.error(json.error || 'Failed to update status');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setMarkingReunited(false);
    }
  };

  const handleFlag = async () => {
    if (!user) { navigate('/login'); return; }
    const reason = prompt('Why are you flagging this post?');
    if (!reason) return;
    try {
      const res = await fetch(`${SERVER_URL}/flags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ report_id: id, reason }),
      });
      if (res.ok) toast.success('Report flagged for review');
      else toast.error('Failed to flag');
    } catch {
      toast.error('Network error');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-xl font-semibold text-slate-700 mb-2">Post not found</p>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/feed')}
            className="px-6 py-3 bg-[#263143] text-white rounded-full"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === post.user_id;

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
                onClick={toggleSave}
                className={`p-2 rounded-full transition-colors ${
                  saved ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
              </motion.button>
              <button
                onClick={handleShare}
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={handleFlag}
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                title="Flag this post"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#263143] flex items-center justify-center text-white font-semibold overflow-hidden">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (post.profiles?.full_name || 'U')[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{post.profiles?.full_name || 'Anonymous'}</div>
                    <div className="text-sm text-slate-500">{formatDate(post.created_at)}</div>
                  </div>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${
                  post.status === 'lost'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : post.status === 'found'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                  {post.status.toUpperCase()}
                </span>
              </div>

              {post.photo_url && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.photo_url} alt={post.pet_name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.pet_name}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Type & Breed</div>
                    <div className="font-medium text-slate-900">{post.pet_type} • {post.breed || '—'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Color & Size</div>
                    <div className="font-medium text-slate-900">{post.color || '—'} • {post.size || '—'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Gender</div>
                    <div className="font-medium text-slate-900">{post.gender || '—'}</div>
                  </div>
                  {post.incident_date && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">Date</div>
                      <div className="font-medium text-slate-900">
                        {post.incident_date} {post.incident_time && `at ${post.incident_time}`}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{post.location}</span>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">{post.description}</p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleLike}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="font-medium">{likeCount}</span>
                  </motion.button>
                  <button className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{comments.length}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 mt-4"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Comments ({comments.length})
              </h2>

              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#45556C] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user ? (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={user ? 'Share any information that might help...' : 'Sign in to comment'}
                      disabled={!user}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 resize-none disabled:opacity-60"
                      rows={3}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!user || !comment.trim() || submittingComment}
                      className="mt-2 px-6 py-2 bg-[#263143] text-white rounded-full hover:bg-[#1F2937] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingComment && <Loader2 className="w-4 h-4 animate-spin" />}
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {comments.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No comments yet. Be the first to help!</p>
              ) : (
                <div className="space-y-6">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold flex-shrink-0">
                        {c.profiles?.avatar_url ? (
                          <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          (c.profiles?.full_name || 'U')[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="font-semibold text-slate-900 mb-1">{c.profiles?.full_name || 'Anonymous'}</div>
                          <p className="text-slate-700">{c.content}</p>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">{timeAgo(c.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Location</h3>
              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{post.location}</span>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="w-full py-3 bg-[#D8E2F0] text-[#0F172B] rounded-xl hover:bg-[#1F2937] hover:text-white transition-colors font-medium"
              >
                View on Map
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Post Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Posted by</span>
                  <span className="font-medium text-slate-900">{post.profiles?.full_name || 'Anonymous'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">{formatDate(post.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reactions</span>
                  <span className="font-medium text-slate-900">{likeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Comments</span>
                  <span className="font-medium text-slate-900">{comments.length}</span>
                </div>
              </div>
            </motion.div>

            {post.status !== 'reunited' && isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#E2E8F0] rounded-2xl border border-slate-300 p-6"
              >
                <CheckCircle className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-[#0F172B] mb-2">Found your pet?</h3>
                <p className="text-sm text-[#45556C] mb-4">
                  Mark this post as reunited to celebrate with the community!
                </p>
                <button
                  onClick={handleMarkReunited}
                  disabled={markingReunited}
                  className="w-full py-3 bg-[#263143] text-white rounded-xl hover:bg-[#1F2937] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {markingReunited && <Loader2 className="w-4 h-4 animate-spin" />}
                  Mark as Reunited
                </button>
              </motion.div>
            )}

            {post.status === 'reunited' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-emerald-800 mb-1">Reunited! 🎉</h3>
                <p className="text-sm text-emerald-700">This pet has been safely returned home.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
