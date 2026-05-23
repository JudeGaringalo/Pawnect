import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, MapPin, Check } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);

    setTimeout(() => {
      navigate('/feed');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Check className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Report Submitted!
          </h2>

          <p className="text-slate-600 mb-6">
            Your pet report has been published and the community will be notified.
          </p>

          <p className="text-sm text-slate-500">
            Redirecting to feed...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Cancel</span>
            </button>

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                1
              </div>

              <div
                className={`w-12 h-0.5 ${
                  step >= 2 ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                2
              </div>

              <div
                className={`w-12 h-0.5 ${
                  step >= 3 ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                3
              </div>
            </div>

            <div className="w-20" />
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {step === 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Report a Pet
              </h1>
              <p className="text-slate-600">
                Let’s start by selecting the type of report.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType('lost')}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  reportType === 'lost'
                    ? 'border-red-500 bg-red-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Lost Pet
                </h3>
                <p className="text-sm text-slate-600">
                  Your pet is missing.
                </p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType('found')}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  reportType === 'found'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-4xl mb-3">🐾</div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Found Pet
                </h3>
                <p className="text-sm text-slate-600">
                  You found a pet.
                </p>
              </motion.button>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Pet Details
              </h1>
              <p className="text-slate-600">
                Provide information about the pet.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Photo
                </label>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pet Type
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Luna"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Golden Retriever"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Golden"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Size
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-medium hover:border-slate-300 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                Continue
              </button>
            </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Location & Details
              </h1>
              <p className="text-slate-600">
                Where was the pet last seen or found?
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., Quezon City, near Barangay Hall"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="aspect-[16/9] bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map Preview</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide additional details, distinctive markings, behavior, or circumstances."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Preference
                </label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Contact me via Pawnect messages</option>
                  <option>Display my phone number</option>
                  <option>Display my email</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-medium hover:border-slate-300 transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                Submit Report
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}