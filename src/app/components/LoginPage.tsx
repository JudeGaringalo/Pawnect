import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const logoSrc =
  "https://raw.githubusercontent.com/JudeGaringalo/Pawnect/refs/heads/main/public/images/logo.png";
const favicon =
  "https://raw.githubusercontent.com/JudeGaringalo/Pawnect/refs/heads/main/public/images/favicon.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] from-sky-50 via-blue-50/30 to-teal-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              <img
                src={favicon}
                alt="Pawnect logo"
                className="h-6 w-auto object-contain" 
              />
            </div>
            <span className="text-2xl font-bold text-slate-900">Pawnect</span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Continue to Pawnect
            </h1>
            <p className="text-slate-600">
              Use your Google account to report, search, and follow pet recovery cases.
            </p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 bg-white border-2 border-slate-300 rounded-full font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"/>
              <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
              <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0 8.36008 0 9.96565C0 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
              <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
