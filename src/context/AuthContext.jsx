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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { success: false, message: 'Account not found. Please register to create a new account!' };
      }

      if (data.password !== pass) {
        return { success: false, message: 'Invalid credentials. Please check your password.' };
      }

      // Store in memory & localStorage
      localStorage.setItem('currentUserRole', data.role);
      localStorage.setItem('currentUser', JSON.stringify(data));
      setCurrentUserRole(data.role);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (err) {
      console.error("Supabase login connection error:", err);
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  // Support dynamic signup
  const signUp = async (name, email, password, role) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return { success: false, message: 'An account with this email already exists!' };
      }

      // Create new user profile in Supabase Postgres
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ name, email, password, role }])
        .select()
        .single();

      if (error) {
        console.error("SignUp insert error:", error);
        return { success: false, message: 'Failed to create account: ' + error.message };
      }

      // If they registered as a photographer, initialize a default customizable profile!
      if (role === 'photographer') {
        const cleanName = name.trim();
        const photoId = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        
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

      // Auto login after successful signup
      localStorage.setItem('currentUserRole', data.role);
      localStorage.setItem('currentUser', JSON.stringify(data));
      setCurrentUserRole(data.role);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (err) {
      console.error("SignUp connection error:", err);
      return { success: false, message: 'Connection error during registration.' };
    }
  };

  const logout = () => {
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
