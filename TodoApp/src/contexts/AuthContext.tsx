import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";
import { Profile } from "../types/database";

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  loading: true,
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processSession = async (session: Session | null) => {
      setLoading(true);
      if (session) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (existingProfile) {
          setProfile(existingProfile);
        } else {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: session.user.id,
              full_name:
                session.user.user_metadata?.full_name || "Novo Usuário",
            })
            .select()
            .single();
          if (insertError)
            console.error(
              "Erro ao tentar criar o perfil que faltava:",
              insertError.message
            );
          else setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setSession(session);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        processSession(session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Erro ao fazer signOut:", error);
      setSession(null);
      setProfile(null);
    }
  };

  const value = {
    session,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
