import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const favicon =
  "https://raw.githubusercontent.com/JudeGaringalo/Pawnect/refs/heads/main/public/images/favicon.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithUsername, user, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      toast.error("Username and password are required");
      return;
    }

    if (cleanUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (cleanPassword.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signInWithUsername(
        cleanUsername,
        cleanPassword,
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Profile created");
      navigate("/feed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center px-6">
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

            <span className="text-2xl font-bold text-slate-900">
              Pawnect
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Continue to Pawnect
            </h1>

            <p className="text-slate-600">
              Enter any new username and password to create a
              prototype profile.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Username"
                className="w-full rounded-full border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-800 outline-none transition-all focus:border-[#263143] focus:ring-2 focus:ring-[#263143]/10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Password"
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleLogin();
                }}
                className="w-full rounded-full border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-800 outline-none transition-all focus:border-[#263143] focus:ring-2 focus:ring-[#263143]/10"
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || submitting}
              className="w-full py-4 px-6 bg-[#263143] rounded-full font-medium text-white hover:bg-[#111827] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating profile...
                </>
              ) : (
                "Enter Prototype"
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Prototype only. Each username can only be used
              once.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}