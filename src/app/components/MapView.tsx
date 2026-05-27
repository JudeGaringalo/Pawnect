import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft, Search, Filter, X } from 'lucide-react';

export default function MapView() {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const pins = [
    {
      id: 1,
      name: 'Luna',
      status: 'lost',
      location: 'Quezon City',
      type: 'Dog',
      image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=200&h=150&fit=crop',
      top: '35%',
      left: '40%',
    },
    {
      id: 2,
      name: 'Unknown Cat',
      status: 'found',
      location: 'Pasig',
      type: 'Cat',
      image: 'https://images.unsplash.com/photo-1558623535-33cc88178982?w=200&h=150&fit=crop',
      top: '45%',
      left: '60%',
    },
    {
      id: 3,
      name: 'Bruno',
      status: 'lost',
      location: 'Mandaluyong',
      type: 'Dog',
      image: 'https://images.unsplash.com/photo-1629555256341-09e5e9871647?w=200&h=150&fit=crop',
      top: '50%',
      left: '50%',
    },
    {
      id: 4,
      name: 'Mochi',
      status: 'reunited',
      location: 'Makati',
      type: 'Cat',
      image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=200&h=150&fit=crop',
      top: '60%',
      left: '45%',
    },
  ];

  const selectedPin = pins.find((p) => p.id === selectedPost);

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="px-6 py-4">
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
                placeholder="Search location..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-700 focus:bg-slate-100 transition-all"
              />
            </div>

            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Filter className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="w-full h-full relative">
            {/* Grid Lines for Map Effect */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-slate-400"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-slate-400"
                  style={{ left: `${i * 5}%` }}
                />
              ))}
            </div>

            {/* Pins */}
            {pins.map((pin) => (
              <motion.button
                key={pin.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedPost(pin.id)}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ top: pin.top, left: pin.left }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    pin.status === 'lost'
                      ? 'bg-red-500'
                      : pin.status === 'found'
                      ? 'bg-blue-500'
                      : 'bg-emerald-500'
                  } ${selectedPost === pin.id ? 'ring-4 ring-white' : ''}`}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Pin Preview */}
        {selectedPin && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg z-10 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={selectedPin.image}
                  alt={selectedPin.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{selectedPin.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedPin.status === 'lost'
                        ? 'bg-red-100 text-red-700'
                        : selectedPin.status === 'found'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedPin.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  {selectedPin.type} • {selectedPin.location}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/post/${selectedPin.id}`)}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Lost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Found</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Reunited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
