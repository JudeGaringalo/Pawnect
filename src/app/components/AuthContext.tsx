import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createClient,
  Session,
  User,
  SupabaseClient,
} from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1f2265c5`;

export const supabase: SupabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
  role: "user" | "admin" | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getAuthHeader: () => Record<string, string>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getAuthHeader: () => ({
    Authorization: `Bearer ${publicAnonKey}`,
  }),
  refreshProfile: async () => {},
  isAdmin: false,
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (accessToken: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const { data } = await res.json();
        setProfile(data ?? null);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.log("Error fetching profile:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.access_token) {
        fetchProfile(session.access_token);
      }

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.access_token) {
        fetchProfile(session.access_token);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/feed`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const getAuthHeader = (): Record<string, string> => {
    const token = session?.access_token ?? publicAnonKey;
    return { Authorization: `Bearer ${token}` };
  };

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        getAuthHeader,
        refreshProfile,
        isAdmin: profile?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}