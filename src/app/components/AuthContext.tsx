import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createClient,
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
  username?: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
  role: "user" | "admin" | null;
  is_admin?: boolean;
  created_at: string;
}

interface MockUser {
  id: string;
  username: string;
  email: string | null;
  user_metadata: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

interface AuthContextType {
  user: MockUser | null;
  session: null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (
    username: string,
    password: string,
  ) => Promise<{ error?: string }>;
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
  signInWithUsername: async () => ({}),
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
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mockToken, setMockToken] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const setSessionFromProfile = (
    token: string,
    profileData: Profile,
  ) => {
    setMockToken(token);
    setProfile(profileData);

    setUser({
      id: profileData.id,
      username:
        profileData.username || profileData.full_name || "user",
      email: profileData.email,
      user_metadata: {
        full_name:
          profileData.full_name ||
          profileData.username ||
          "Pawnect User",
        avatar_url: profileData.avatar_url,
      },
    });
  };

  const loadStoredSession = () => {
    try {
      const storedToken = localStorage.getItem(
        "pawnect_mock_token",
      );
      const storedProfile = localStorage.getItem(
        "pawnect_mock_profile",
      );

      if (storedToken && storedProfile) {
        const parsedProfile = JSON.parse(
          storedProfile,
        ) as Profile;
        setSessionFromProfile(storedToken, parsedProfile);
      }
    } catch (err) {
      console.log("Failed to load mock session:", err);
      localStorage.removeItem("pawnect_mock_token");
      localStorage.removeItem("pawnect_mock_profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredSession();
  }, []);

  const signInWithUsername = async (
    username: string,
    password: string,
  ) => {
    try {
      const res = await fetch(`${SERVER_URL}/mock-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          error: json.error || "Login failed",
        };
      }

      const token = json.data.token;
      const profileData = json.data.profile as Profile;

      localStorage.setItem("pawnect_mock_token", token);
      localStorage.setItem(
        "pawnect_mock_profile",
        JSON.stringify(profileData),
      );

      setSessionFromProfile(token, profileData);

      return {};
    } catch (err: any) {
      return {
        error: err.message || "Login failed",
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("pawnect_mock_token");
    localStorage.removeItem("pawnect_mock_profile");

    setMockToken(null);
    setUser(null);
    setProfile(null);
  };

  const getAuthHeader = (): Record<string, string> => {
    return {
      Authorization: `Bearer ${mockToken || publicAnonKey}`,
    };
  };

  const refreshProfile = async () => {
    loadStoredSession();
  };

  const isAdmin =
    profile?.role === "admin" || profile?.is_admin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        profile,
        loading,
        signInWithUsername,
        signOut,
        getAuthHeader,
        refreshProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}