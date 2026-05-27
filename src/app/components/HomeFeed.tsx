import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  MapPin,
  Search,
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, SERVER_URL } from "./AuthContext";

const favicon =
  "https://raw.githubusercontent.com/JudeGaringalo/Pawnect/refs/heads/main/public/images/favicon.png";

interface PetReport {
  id: string;
  status: "lost" | "found" | "reunited";
  pet_name: string | null;
  pet_type: string;
  animal_type?: string;
  breed: string | null;
  color: string | null;
  size: string | null;
  location: string | null;
  location_name?: string | null;
  created_at: string;
  description: string | null;
  photo_url: string | null;
  image_url?: string | null;
  reaction_count: number;
  comment_count: number;
  user_saved?: boolean;
  profiles: {
    full_name: string | null;
    username?: string | null;
    avatar_url: string | null;
  } | null;
}

const filters = [
  { id: "all", label: "All Posts" },
  { id: "lost", label: "Lost" },
  { id: "found", label: "Found" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "reunited", label: "Reunited" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "lost":
      return "bg-red-100 text-red-700 border-red-200";
    case "found":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "reunited":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "lost":
      return <AlertCircle className="w-4 h-4" />;
    case "found":
      return <MapPin className="w-4 h-4" />;
    case "reunited":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function readJsonResponse(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: text || "Unexpected server response",
    };
  }
}

export default function HomeFeed() {
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();

  const [activeFilter, setActiveFilter] = useState("all");
  const [posts, setPosts] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [likedPosts, setLikedPosts] = useState<
    Record<string, number>
  >({});
  const [savedPosts, setSavedPosts] = useState<Set<string>>(
    new Set(),
  );

  const [recentActivity, setRecentActivity] = useState<any[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (activeFilter === "dog") {
        params.set("pet_type", "dog");
      } else if (activeFilter === "cat") {
        params.set("pet_type", "cat");
      } else if (activeFilter !== "all") {
        params.set("status", activeFilter);
      }

      params.set("limit", "20");

      const res = await fetch(
        `${SERVER_URL}/reports?${params.toString()}`,
        {
          method: "GET",
          headers: {
            ...getAuthHeader(),
          },
        },
      );

      const json = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(
          json.error || json.message || "Failed to load posts",
        );
      }

      const nextPosts = json.data ?? [];
      setPosts(nextPosts);

      const liked: Record<string, number> = {};
      const saved = new Set<string>();

      nextPosts.forEach((post: PetReport) => {
        liked[post.id] = post.reaction_count ?? 0;

        if (post.user_saved) {
          saved.add(post.id);
        }
      });

      setLikedPosts(liked);
      setSavedPosts(saved);
    } catch (err: any) {
      console.log("Error fetching posts:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, getAuthHeader]);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(
        `${SERVER_URL}/reports?limit=3&offset=0`,
        {
          method: "GET",
          headers: {
            ...getAuthHeader(),
          },
        },
      );

      const json = await readJsonResponse(res);

      if (!res.ok) return;

      setRecentActivity(
        (json.data ?? [])
          .slice(0, 3)
          .map((post: PetReport) => ({
            pet: post.pet_name || "Unknown pet",
            status: post.status,
            time: formatDate(post.created_at),
          })),
      );
    } catch (err) {
      console.log("Error fetching recent activity:", err);
    }
  }, [getAuthHeader]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/notifications`, {
        method: "GET",
        headers: {
          ...getAuthHeader(),
        },
      });

      const json = await readJsonResponse(res);

      if (!res.ok) return;

      const unread = (json.data ?? []).filter(
        (n: any) => !n.read,
      ).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log("Error fetching notifications:", err);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const toggleLike = async (
    postId: string,
    currentCount: number,
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const prev = likedPosts[postId] ?? currentCount ?? 0;

    setLikedPosts((current) => ({
      ...current,
      [postId]: prev + 1,
    }));

    try {
      const res = await fetch(
        `${SERVER_URL}/reactions/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            report_id: postId,
          }),
        },
      );

      const json = await readJsonResponse(res);

      if (res.ok) {
        setLikedPosts((current) => ({
          ...current,
          [postId]: json.count ?? prev,
        }));
      } else {
        setLikedPosts((current) => ({
          ...current,
          [postId]: prev,
        }));

        toast.error(json.error || "Failed to update reaction");
      }
    } catch {
      setLikedPosts((current) => ({
        ...current,
        [postId]: prev,
      }));

      toast.error("Failed to update reaction");
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const wasSaved = savedPosts.has(postId);

    setSavedPosts((current) => {
      const next = new Set(current);

      if (wasSaved) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      return next;
    });

    try {
      const res = await fetch(
        `${SERVER_URL}/saved-posts/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            report_id: postId,
          }),
        },
      );

      const json = await readJsonResponse(res);

      if (!res.ok) {
        setSavedPosts((current) => {
          const next = new Set(current);

          if (wasSaved) {
            next.add(postId);
          } else {
            next.delete(postId);
          }

          return next;
        });

        toast.error(json.error || "Failed to save post");
        return;
      }

      toast.success(
        json.saved ? "Post saved!" : "Post unsaved",
      );
    } catch {
      setSavedPosts((current) => {
        const next = new Set(current);

        if (wasSaved) {
          next.add(postId);
        } else {
          next.delete(postId);
        }

        return next;
      });

      toast.error("Failed to save post");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <img
                  src={favicon}
                  alt="Pawnect logo"
                  className="h-6 w-auto object-contain"
                />
              </div>

              <span className="text-2xl font-bold text-slate-900">
                Pawnect
              </span>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by pet name, breed, color, or location"
                  onClick={() => navigate("/search")}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:border-[#1F2937] cursor-pointer transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate("/create-report")}
                className="px-4 py-2 bg-[#263143] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">
                  Report Pet
                </span>
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell className="w-6 h-6 text-slate-600" />

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-[#263143] flex items-center justify-center text-white text-sm font-semibold">
                    {(user.user_metadata?.full_name ||
                      user.username ||
                      "U")[0].toUpperCase()}
                  </div>
                ) : (
                  <User className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 overflow-x-auto py-1 px-1">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-[#263143] text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-[#263143]"
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <p>Loading posts...</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
                <p className="font-semibold mb-2">
                  Failed to load posts
                </p>
                <p className="text-sm mb-4">{error}</p>

                <button
                  onClick={fetchPosts}
                  className="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="text-6xl mb-4">🐾</div>

                <p className="text-lg font-medium text-slate-600 mb-2">
                  No posts found
                </p>

                <p className="text-sm mb-6">
                  Be the first to report a lost or found pet!
                </p>

                <button
                  onClick={() => navigate("/create-report")}
                  className="px-6 py-3 bg-[#263143] text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Create Report
                </button>
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <div className="space-y-4">
                {posts.map((post, index) => {
                  const postStatus = post.status || "lost";
                  const petName =
                    post.pet_name || "Unknown pet";
                  const petType =
                    post.pet_type || post.animal_type || "Pet";
                  const location =
                    post.location ||
                    post.location_name ||
                    "Unknown location";
                  const photoUrl =
                    post.photo_url || post.image_url || null;
                  const reporterName =
                    post.profiles?.full_name ||
                    post.profiles?.username ||
                    "Anonymous";

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C28A45] flex items-center justify-center text-white font-semibold overflow-hidden">
                            {post.profiles?.avatar_url ? (
                              <img
                                src={post.profiles.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              reporterName[0].toUpperCase()
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">
                                {petName}
                              </span>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                                  postStatus,
                                )}`}
                              >
                                {getStatusIcon(postStatus)}
                                {postStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  postStatus.slice(1)}
                              </span>
                            </div>

                            <div className="text-sm text-slate-500 pt-1">
                              {reporterName} •{" "}
                              {formatDate(post.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {photoUrl && (
                        <div
                          className="aspect-[16/10] overflow-hidden cursor-pointer"
                          onClick={() =>
                            navigate(`/post/${post.id}`)
                          }
                        >
                          <img
                            src={photoUrl}
                            alt={petName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">
                              Type & Breed
                            </div>

                            <div className="text-sm font-medium text-slate-900">
                              {petType} •{" "}
                              {post.breed || "Unknown"}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-slate-500 mb-1">
                              Color & Size
                            </div>

                            <div className="text-sm font-medium text-slate-900">
                              {post.color || "—"} •{" "}
                              {post.size || "—"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 mb-4">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">
                            {location}
                          </span>
                        </div>

                        <p className="text-slate-700 mb-4 line-clamp-2">
                          {post.description ||
                            "No description provided."}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                toggleLike(
                                  post.id,
                                  post.reaction_count ?? 0,
                                )
                              }
                              className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {likedPosts[post.id] ??
                                  post.reaction_count ??
                                  0}
                              </span>
                            </motion.button>

                            <button
                              onClick={() =>
                                navigate(`/post/${post.id}`)
                              }
                              className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {post.comment_count ?? 0}
                              </span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                toggleSave(post.id)
                              }
                              className={`p-2 rounded-full transition-colors ${
                                savedPosts.has(post.id)
                                  ? "bg-teal-100 text-teal-600"
                                  : "hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Bookmark
                                className={`w-5 h-5 ${
                                  savedPosts.has(post.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </motion.button>

                            <button
                              onClick={() => navigate("/map")}
                              className="px-4 py-2 bg-[#D8E2F0] text-[#1F2937] rounded-full hover:bg-[#1F2937] hover:text-[#D8E2F0] transition-colors text-sm font-medium"
                            >
                              View on Map
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/map")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <Map className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">
                    View Map
                  </span>
                </button>

                <button
                  onClick={() => navigate("/search")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <Search className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">
                    Advanced Search
                  </span>
                </button>

                <button
                  onClick={() => navigate("/reunited")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <CheckCircle className="w-5 h-5 text-[#263143]" />
                  <span className="text-sm font-medium text-slate-700">
                    Success Stories
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Recent Activity
              </h3>

              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#D8E2F0] flex items-center justify-center">
                        {activity.status === "reunited" ? (
                          <CheckCircle className="w-4 h-4 text-[#0F172B]" />
                        ) : activity.status === "lost" ? (
                          <AlertCircle className="w-4 h-4 text-[#0F172B]" />
                        ) : (
                          <MapPin className="w-4 h-4 text-[#0F172B]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">
                            {activity.pet}
                          </span>{" "}
                          {activity.status === "reunited"
                            ? "was reunited"
                            : activity.status === "lost"
                              ? "reported missing"
                              : "was found"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-yellow-200 rounded-2xl border border-amber-500 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                Safety Reminder
              </h3>

              <p className="text-sm text-slate-700">
                Always meet in public places when arranging pet
                returns. Verify ownership before releasing a
                pet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 gap-2 p-4">
          <button className="flex flex-col items-center gap-1 text-teal-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>

          <button
            onClick={() => navigate("/search")}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>

          <button
            onClick={() => navigate("/map")}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">Map</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
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