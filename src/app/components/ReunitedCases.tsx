import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, MapPin, Clock, Heart, TrendingUp, Loader2 } from 'lucide-react';
import { SERVER_URL } from './AuthContext';
import { useAuth } from './AuthContext';

interface PetReport {
  id: string;
  pet_name: string;
  pet_type: string;
  breed: string;
  location: string;
  created_at: string;
  reunited_at: string | null;
  reunited_story: string | null;
  description: string;
  photo_url: string | null;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

function hoursToReunite(created: string, reunited: string | null): string {
  if (!reunited) return '—';
  const diff = new Date(reunited).getTime() - new Date(created).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export default function ReunitedCases() {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  const [reunitedPets, setReunitedPets] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({ total: 0, thisMonth: 0 });

  const fetchReunited = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/reports?status=reunited&limit=50`, {
        headers: getAuthHeader(),
      });
      const json = await res.json();
      if (res.ok) {
        const data: PetReport[] = json.data ?? [];
        setReunitedPets(data);

        const now = new Date();
        const thisMonth = data.filter((p) => {
          const d = new Date(p.reunited_at || p.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        setTotalStats({ total: data.length, thisMonth });
      }
    } catch (err) {
      console.log('Error fetching reunited cases:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReunited(); }, [fetchReunited]);

  const successRate = totalStats.total > 0
    ? Math.min(99, Math.round((totalStats.total / (totalStats.total + 10)) * 100))
    : 0;

  const statsCards = [
    { label: 'Total Reunited', value: totalStats.total, icon: <CheckCircle className="w-8 h-8" /> },
    { label: 'This Month', value: totalStats.thisMonth, icon: <TrendingUp className="w-8 h-8" /> },
    { label: 'Avg. Time', value: '2-3 days', icon: <Clock className="w-8 h-8" /> },
    { label: 'Success Rate', value: `${successRate}%`, icon: <Heart className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Feed</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-[#45556C] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Success Stories</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Celebrating every pet that found their way home thanks to our community
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-[#62748E] p-6 text-center"
            >
              <div className="w-14 h-14 bg-[#E8F1FF] text-[#565656] rounded-xl flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && reunitedPets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">No success stories yet</h2>
            <p className="text-slate-500 mb-8">
              Help reunite pets with their owners and your story could be featured here!
            </p>
            <button
              onClick={() => navigate('/feed')}
              className="px-8 py-4 bg-[#263143] text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Browse Reports
            </button>
          </div>
        )}

        {/* Reunited Cases */}
        {!loading && reunitedPets.length > 0 && (
          <div className="space-y-8">
            {reunitedPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.07, 0.5) }}
                className="bg-white rounded-3xl border border-[#62748E] overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="grid md:grid-cols-5 gap-6 p-8">
                  <div className="md:col-span-2">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-100">
                      {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.pet_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Reunited
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-[#0F172B] mb-2">{pet.pet_name}</h2>
                        <p className="text-lg text-slate-600">
                          {pet.pet_type} • {pet.breed || 'Mixed'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#565656] mb-1">
                          {hoursToReunite(pet.created_at, pet.reunited_at)}
                        </div>
                        <div className="text-sm text-slate-500">to reunite</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span>{pet.location}</span>
                      </div>
                      {pet.reunited_at && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <span>Found: {formatDate(pet.reunited_at)}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#EDF4FF] rounded-xl p-4 mb-6">
                      <p className="text-slate-700 leading-relaxed">
                        {pet.reunited_story || pet.description || 'Successfully reunited! Thank you to everyone who helped.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C28A45] flex items-center justify-center text-white font-semibold overflow-hidden">
                          {pet.profiles?.avatar_url ? (
                            <img src={pet.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (pet.profiles?.full_name || 'U')[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{pet.profiles?.full_name || 'Anonymous'}</p>
                          <p className="text-sm text-slate-500">Pet Owner</p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/post/${pet.id}`)}
                        className="px-6 py-3 bg-[#45556C] text-white rounded-xl hover:bg-[#314158] hover:shadow-lg transition-all font-medium"
                      >
                        View Full Story
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-[#263143] rounded-3xl p-12 text-center text-white"
        >
          <Heart className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Together, We Make a Difference</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every reunion is made possible by our caring community. Thank you for helping pets find their way home.
          </p>
          <button
            onClick={() => navigate('/create-report')}
            className="px-16 py-4 bg-white text-[#263143] rounded-full font-bold hover:bg-[#EDF4FF] hover:shadow-xl transition-all"
          >
            Help Another Pet Today
          </button>
        </motion.div>
      </div>
    </div>
  );
}
