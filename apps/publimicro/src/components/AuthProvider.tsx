"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { OnboardingModal } from "./OnboardingModal";

export interface UserProfile {
  id: string;
  
  // Personal Information
  full_name: string | null;
  cpf: string | null;
  phone: string | null;
  birth_date: string | null;
  
  // Address Information
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  
  // Profile Status
  avatar_url: string | null;
  profile_completed: boolean;
  verified: boolean;
  
  // Terms
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  
  // Permissions
  can_schedule_visits: boolean;
  can_place_bids: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const supabase = createClientComponentClient();

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Profile doesn't exist yet - this is normal for new users
        if (error.code === 'PGRST116') {
          console.log("Profile not found, will be created on signup");
          return null;
        }
        console.error("Error loading profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error("Error loading profile:", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await loadProfile(user.id);
      setProfile(profileData);
      
      // Show onboarding if profile not completed
      if (profileData && !profileData.profile_completed) {
        setShowOnboarding(true);
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id).then((profileData) => {
          setProfile(profileData);
          
          // Show onboarding if profile not completed
          if (profileData && !profileData.profile_completed) {
            setShowOnboarding(true);
          }
          
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await loadProfile(session.user.id);
        setProfile(profileData);
        
        // Show onboarding if profile not completed
        if (profileData && !profileData.profile_completed) {
          setShowOnboarding(true);
        }
      } else {
        setProfile(null);
        setShowOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refreshProfile();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
      
      {/* Onboarding Modal - Only show if user is logged in and profile not completed */}
      {user && showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          userId={user.id}
        />
      )}
    </AuthContext.Provider>
  );
}
