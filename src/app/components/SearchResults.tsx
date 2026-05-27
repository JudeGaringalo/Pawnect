import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, MapPin, ArrowLeft, SlidersHorizontal, Loader2 } from 'lucide-react';
import { SERVER_URL } from './AuthContext';
import { useAuth } from './AuthContext';

interface PetReport {
  id: string;
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  location: string;
  status: 'lost' | 'found' | 'reunited';
  photo_url: string | null;
  created_at: string;
}

const searchSuggestions = [
  'black aspin near Pasig',
  'white cat in Quezon City',
  'golden retriever lost',
  'found puppy Makati',
  'brown dog Shaw Boulevard',
];

export default function SearchResults() {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (query: string, status: string, petType: string) => {
      if (!query.trim()) { setResults([]); return; }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('search', query);
        params.set('limit', '30');
        if (status !== 'all') params.set('status', status);
        if (petType !== 'all') params.set('pet_type', petType);

        const res = await fetch(`${SERVER_URL}/reports?${params}`, {
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (res.ok) setResults(json.data ?? []);
        else console.log('Search error:', json.error);
      } catch (err) {
        console.log('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(() => {
      doSearch(searchQuery, filterStatus, filterType);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, filterStatus, filterType, doSearch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/feed')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pet name, breed, color, or location"
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-700 focus:bg-slate-100 transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-[#263143] text-white' : 'hover:bg-slate-100'}`}
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#263143]"
              >
                <option value="all">All Types</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Bird">Birds</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1F2937]"
              >
                <option value="all">All Status</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="reunited">Reunited</option>
              </select>
            </motion.div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {!searchQuery ? (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Popular Searches</h2>
            <div className="space-y-2">
              {searchSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSearchQuery(suggestion)}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#1F2937] hover:shadow-md transition-all text-left"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-slate-600">
                    Found <span className="font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''}{' '}
                    for "<span className="font-semibold">{searchQuery}</span>"
                  </p>
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-lg font-medium text-slate-600 mb-2">No results found</p>
                    <p className="text-slate-500">Try different keywords or remove filters</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => navigate(`/post/${result.id}`)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                          {result.photo_url ? (
                            <img
                              src={result.photo_url}
                              alt={result.pet_name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">{result.pet_name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.status === 'lost' ? 'bg-red-100 text-red-700'
                              : result.status === 'found' ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {result.pet_type} • {result.breed || 'Unknown breed'}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4" />
                            <span>{result.location}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
