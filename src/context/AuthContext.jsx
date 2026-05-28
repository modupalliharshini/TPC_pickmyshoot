import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUserRole, setCurrentUserRole] = useState(
    localStorage.getItem('currentUserRole')
  );
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  // Support dynamic database login
  const login = async (emailOrRole, password = '') => {
    let email = emailOrRole;
    let pass = password;
    
    // Support legacy role-only login signatures
    if (emailOrRole === 'user') {
      email = 'customer@pickmyshoot.com';
      pass = 'password123';
    } else if (emailOrRole === 'photographer') {
      email = 'photographer@pickmyshoot.com';
      pass = 'password123';
    }

    try {
      // Execute official Supabase Auth sign-in!
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      if (authError) {
        console.error("Supabase Auth login error:", authError);
        return { success: false, message: authError.message };
      }

      const user = authData.user;

      // Query dynamic user details from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.warn("Public profile row not found. Creating fallback row...");
        // Fallback row creation
        const fallbackRole = user.user_metadata?.role || 'user';
        const fallbackName = user.user_metadata?.name || email.split('@')[0];
        
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({ id: user.id, email: user.email, role: fallbackRole, name: fallbackName })
          .select()
          .single();
          
        const activeProfile = newProfile || { id: user.id, email: user.email, role: fallbackRole, name: fallbackName };
        
        localStorage.setItem('currentUserRole', activeProfile.role);
        localStorage.setItem('currentUser', JSON.stringify(activeProfile));
        setCurrentUserRole(activeProfile.role);
        setCurrentUser(activeProfile);
        return { success: true, user: activeProfile };
      }

      // Store in memory & localStorage
      localStorage.setItem('currentUserRole', profile.role);
      localStorage.setItem('currentUser', JSON.stringify(profile));
      setCurrentUserRole(profile.role);
      setCurrentUser(profile);
      return { success: true, user: profile };
    } catch (err) {
      console.error("Supabase login connection error:", err);
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  // Support dynamic signup
  const signUp = async (name, email, password, role) => {
    try {
      // Execute official Supabase Auth sign-up!
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (authError) {
        console.error("Supabase Auth sign-up error:", authError);
        return { success: false, message: authError.message };
      }

      const user = authData.user;
      if (!user) {
        return { success: false, message: 'Registration initiated! Please check your email inbox to confirm your account.' };
      }

      // Check if email confirmation is turned on on their project (user might be in unconfirmed state)
      const isConfirmed = user.email_confirmed_at || authData.session;

      // Sync public profile row to profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: email,
          role: role,
          name: name
        }])
        .select()
        .single();

      if (profileError) {
        console.error("Profile sync error:", profileError);
      }

      // If they registered as a photographer, initialize a default customizable profile!
      if (role === 'photographer') {
        const cleanName = name.trim();
        const photoId = email.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const { error: profileError } = await supabase
          .from('photographers')
          .insert([{
            id: photoId,
            name: cleanName,
            rating: 5.0,
            reviews: 0,
            experience: 1,
            price: 15000,
            location: "Jubilee Hills",
            city: "Hyderabad",
            categories: ["Wedding Photography", "Candid Photography"],
            image: "/assets/wedding_hero.png",
            gallery: ["/assets/wedding_hero.png", "/assets/prewedding_shoot.png"],
            avatar_color: "#2196f3",
            avatar_text: cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3),
            verified: true,
            best_seller: false,
            is_studio: false,
            booked_dates: [],
            about: "Professional photography capturing clean, timeless moments and authentic highlights.",
            bullets: ["1+ Year Experience", "Creative Angles", "High-Resolution Files"],
            packages: {
              essential: { price: 15000, hours: 4, photographers: 1 },
              premium: { price: 28000, hours: 8, photographers: 2, popular: true },
              luxury: { price: 45000, hours: 12, photographers: 2 }
            },
            languages: ["English", "Hindi"],
            travel_outside_city: true,
            age: 25,
            charge_per_hour: 1500
          }]);

        if (profileError) {
          console.error("Failed to seed initial photographer details:", profileError);
        }
      }

      if (!isConfirmed) {
        return { 
          success: true, 
          message: 'Registration successful! An activation link has been sent to your email. Please click the link to confirm your account and log in!' 
        };
      }

      // Auto login after successful signup (if immediately confirmed / verification turned off)
      const activeProfile = profile || { id: user.id, email, role, name };
      localStorage.setItem('currentUserRole', activeProfile.role);
      localStorage.setItem('currentUser', JSON.stringify(activeProfile));
      setCurrentUserRole(activeProfile.role);
      setCurrentUser(activeProfile);
      return { success: true, user: activeProfile };
    } catch (err) {
      console.error("SignUp connection error:", err);
      return { success: false, message: 'Connection error during registration.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUser');
    setCurrentUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, currentUser, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
