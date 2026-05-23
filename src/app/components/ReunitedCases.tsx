import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, MapPin, Clock, Heart, TrendingUp } from 'lucide-react';

export default function ReunitedCases() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Reunited', value: 89, icon: <CheckCircle className="w-6 h-6" /> },
    { label: 'This Month', value: 23, icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Avg. Time', value: '2.4 days', icon: <Clock className="w-6 h-6" /> },
    { label: 'Success Rate', value: '73%', icon: <Heart className="w-6 h-6" /> },
  ];

  const reunitedPets = [
    {
      id: 1,
      name: 'Luna',
      type: 'Dog',
      breed: 'Golden Retriever',
      location: 'Quezon City',
      lostDate: 'May 22, 2026',
      foundDate: 'May 23, 2026',
      timeToReunite: '18 hours',
      story: 'Thanks to the quick response from the community, Luna was found safe near the park. Special thanks to Juan who spotted her and contacted us immediately!',
      image: 'https://images.unsplash.com/photo-1558947530-cbcf6e9aeeae?w=600&h=400&fit=crop',
      owner: 'Maria Santos',
    },
    {
      id: 2,
      name: 'Mochi',
      type: 'Cat',
      breed: 'Persian',
      location: 'Makati',
      lostDate: 'May 19, 2026',
      foundDate: 'May 20, 2026',
      timeToReunite: '1 day',
      story: 'Mochi was found hiding in a nearby building. The security guard recognized her from the post and contacted us right away. So grateful for this community!',
      image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=600&h=400&fit=crop',
      owner: 'Ana Reyes',
    },
    {
      id: 3,
      name: 'Max',
      type: 'Dog',
      breed: 'Aspin',
      location: 'Pasig',
      lostDate: 'May 15, 2026',
      foundDate: 'May 18, 2026',
      timeToReunite: '3 days',
      story: 'Max was spotted by a kind rescuer who had been following our updates. He was scared but unharmed. Forever grateful to everyone who shared and helped search!',
      image: 'https://images.unsplash.com/photo-1629555256341-09e5e9871647?w=600&h=400&fit=crop',
      owner: 'Miguel Cruz',
    },
    {
      id: 4,
      name: 'Bella',
      type: 'Cat',
      breed: 'Domestic Shorthair',
      location: 'Taguig',
      lostDate: 'May 20, 2026',
      foundDate: 'May 21, 2026',
      timeToReunite: '12 hours',
      story: 'Bella was found just a few blocks away, waiting near a neighbor\'s door. The neighbor checked the app and immediately recognized her. Amazing!',
      image: 'https://images.unsplash.com/photo-1558623535-33cc88178982?w=600&h=400&fit=crop',
      owner: 'Sofia Torres',
    },
    {
      id: 5,
      name: 'Coco',
      type: 'Dog',
      breed: 'Shih Tzu',
      location: 'Mandaluyong',
      lostDate: 'May 16, 2026',
      foundDate: 'May 19, 2026',
      timeToReunite: '3 days',
      story: 'A barangay member spotted Coco and brought her to the barangay hall. They checked Pawnect and found the report. This app truly works!',
      image: 'https://images.unsplash.com/photo-1583787317796-2bc56f8556e2?w=600&h=400&fit=crop',
      owner: 'Carlos Mendoza',
    },
    {
      id: 6,
      name: 'Oreo',
      type: 'Cat',
      breed: 'Tuxedo Cat',
      location: 'Manila',
      lostDate: 'May 14, 2026',
      foundDate: 'May 16, 2026',
      timeToReunite: '2 days',
      story: 'Found Oreo at a nearby store where he was being fed by kind strangers. They saw the post and contacted us immediately. The community is amazing!',
      image: 'https://images.unsplash.com/photo-1517854883321-ab2a463cce90?w=600&h=400&fit=crop',
      owner: 'Patricia Santos',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/30 to-white">
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
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Success Stories</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Celebrating every pet that found their way home thanks to our community
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-emerald-200 p-6 text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reunited Cases Grid */}
        <div className="space-y-8">
          {reunitedPets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl border border-emerald-200 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="grid md:grid-cols-5 gap-6 p-8">
                {/* Image */}
                <div className="md:col-span-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Reunited
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-3">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">{pet.name}</h2>
                      <p className="text-lg text-slate-600">
                        {pet.type} • {pet.breed}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {pet.timeToReunite}
                      </div>
                      <div className="text-sm text-slate-500">to reunite</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span>{pet.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <span>Found: {pet.foundDate}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p className="text-slate-700 leading-relaxed">{pet.story}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                        {pet.owner
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pet.owner}</p>
                        <p className="text-sm text-slate-500">Pet Owner</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/post/${pet.id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      View Full Story
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-12 text-center text-white"
        >
          <Heart className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Together, We Make a Difference</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Every reunion is made possible by our caring community. Thank you for helping pets find
            their way home.
          </p>
          <button
            onClick={() => navigate('/create-report')}
            className="px-8 py-4 bg-white text-teal-700 rounded-full font-medium hover:shadow-xl transition-all"
          >
            Help Another Pet Today
          </button>
        </motion.div>
      </div>
    </div>
  );
}
