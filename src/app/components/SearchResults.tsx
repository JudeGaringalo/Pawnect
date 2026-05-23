import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, ArrowLeft, SlidersHorizontal } from 'lucide-react';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const searchSuggestions = [
    'black aspin near Pasig',
    'white cat in Quezon City',
    'golden retriever lost',
    'found puppy Makati',
    'brown dog Shaw Boulevard',
  ];

  const results = [
    {
      id: 1,
      name: 'Luna',
      type: 'Dog',
      breed: 'Golden Retriever',
      color: 'Golden',
      location: 'Quezon City',
      status: 'lost',
      image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Unknown',
      type: 'Cat',
      breed: 'Domestic Shorthair',
      color: 'White',
      location: 'Pasig',
      status: 'found',
      image: 'https://images.unsplash.com/photo-1558623535-33cc88178982?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Bruno',
      type: 'Dog',
      breed: 'Aspin',
      color: 'Brown',
      location: 'Mandaluyong',
      status: 'lost',
      image: 'https://images.unsplash.com/photo-1629555256341-09e5e9871647?w=400&h=300&fit=crop',
    },
  ];

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
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <SlidersHorizontal className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Types</option>
                <option>Dogs</option>
                <option>Cats</option>
              </select>
              <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Status</option>
                <option>Lost</option>
                <option>Found</option>
                <option>Reunited</option>
              </select>
              <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Locations</option>
                <option>Quezon City</option>
                <option>Pasig</option>
                <option>Makati</option>
              </select>
              <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Sort by Latest</option>
                <option>Sort by Nearest</option>
                <option>Most Commented</option>
              </select>
            </motion.div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {searchQuery === '' ? (
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
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-slate-600">
                Found <span className="font-semibold">{results.length}</span> results
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/post/${result.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{result.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.status === 'lost'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {result.type} • {result.breed}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span>{result.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
