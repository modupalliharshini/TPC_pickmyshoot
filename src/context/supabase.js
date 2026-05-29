import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xvvxdkrgazqqawuhttzw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dnhka3JnYXpxcWF3dWh0dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Mzc0NzcsImV4cCI6MjA5NTUxMzQ3N30.Xo4P4Q0ix64KoG8v_lumPPJEynnOdj0qGNyIRMDrN4Q';

// Check if URL is valid
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const useMock = !supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl) || supabaseUrl === 'YOUR_SUPABASE_URL';

if (useMock) {
  console.warn("⚠️ Supabase credentials missing or invalid! Falling back to Local Simulation Mode.");
}

// Helper to get local data
const getLocalData = (key, defaultVal) => {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  }
  return defaultVal;
};

const setLocalData = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Initial local profiles
const defaultProfiles = [
  {
    id: 'customer-user-id',
    name: 'Customer User',
    email: 'customer@pickmyshoot.com',
    password: 'password123',
    role: 'user'
  },
  {
    id: 'the-wedding-story',
    name: 'The Wedding Story',
    email: 'photographer@pickmyshoot.com',
    password: 'password123',
    role: 'photographer'
  }
];

// Fallback Mock Supabase client
const makeMockSupabase = () => {
  const queryBuilder = (tableName, state = {}) => {
    return {
      select(fields = '*') {
        if (!state.type) state.type = 'select';
        state.fields = fields;
        return this;
      },
      insert(rows) {
        state.type = 'insert';
        state.rows = rows;
        return this;
      },
      update(values) {
        state.type = 'update';
        state.values = values;
        return this;
      },
      delete() {
        state.type = 'delete';
        return this;
      },
      eq(field, value) {
        state.filters = state.filters || [];
        state.filters.push({ field, value, operator: 'eq' });
        return this;
      },
      order(field, { ascending } = {}) {
        return this;
      },
      limit(n) {
        return this;
      },
      single() {
        state.single = true;
        return this;
      },
      maybeSingle() {
        state.maybeSingle = true;
        return this;
      },
      // Make it a thenable (Promise-like) so it can be awaited
      async then(onFulfilled, onRejected) {
        try {
          const result = await executeQuery(tableName, state);
          return onFulfilled(result);
        } catch (e) {
          if (onRejected) return onRejected(e);
          throw e;
        }
      }
    };
  };

  const executeQuery = async (table, state) => {
    // Get current lists from localStorage
    let profiles = getLocalData('pickmyshoot_profiles', defaultProfiles);
    let photographers = getLocalData('pickmyshoot_photographers', []);
    let leads = getLocalData('pickmyshoot_leads', []);
    let reviews = getLocalData('pickmyshoot_reviews', []);

    let data = [];
    let error = null;

    if (state.type === 'select') {
      if (table === 'profiles') data = profiles;
      else if (table === 'photographers') data = photographers;
      else if (table === 'leads') data = leads;
      else if (table === 'reviews') data = reviews;

      // Apply filters (simple eq)
      if (state.filters) {
        for (const filter of state.filters) {
          if (filter.operator === 'eq') {
            data = data.filter(item => item[filter.field] === filter.value);
          }
        }
      }

      if (state.single) {
        data = data.length > 0 ? data[0] : null;
        if (!data) error = { message: 'Item not found' };
      } else if (state.maybeSingle) {
        data = data.length > 0 ? data[0] : null;
      }
    } 
    else if (state.type === 'insert') {
      const newItems = state.rows.map(row => ({
        id: row.id || `local-id-${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date().toISOString(),
        ...row
      }));

      if (table === 'profiles') {
        profiles = [...profiles, ...newItems];
        setLocalData('pickmyshoot_profiles', profiles);
      } else if (table === 'photographers') {
        photographers = [...photographers, ...newItems];
        setLocalData('pickmyshoot_photographers', photographers);
      } else if (table === 'leads') {
        leads = [...leads, ...newItems];
        setLocalData('pickmyshoot_leads', leads);
      } else if (table === 'reviews') {
        reviews = [...reviews, ...newItems];
        setLocalData('pickmyshoot_reviews', reviews);
      }

      data = state.single || state.maybeSingle ? newItems[0] : newItems;
    } 
    else if (state.type === 'update') {
      let updatedData = [];
      const applyUpdate = (list) => {
        return list.map(item => {
          let matches = true;
          if (state.filters) {
            for (const filter of state.filters) {
              if (filter.operator === 'eq' && item[filter.field] !== filter.value) {
                matches = false;
              }
            }
          }
          if (matches) {
            const updated = { ...item, ...state.values };
            updatedData.push(updated);
            return updated;
          }
          return item;
        });
      };

      if (table === 'profiles') {
        profiles = applyUpdate(profiles);
        setLocalData('pickmyshoot_profiles', profiles);
      } else if (table === 'photographers') {
        photographers = applyUpdate(photographers);
        setLocalData('pickmyshoot_photographers', photographers);
      } else if (table === 'leads') {
        leads = applyUpdate(leads);
        setLocalData('pickmyshoot_leads', leads);
      }

      data = updatedData;
    } 
    else if (state.type === 'delete') {
      let deletedItems = [];
      const filterDelete = (list) => {
        return list.filter(item => {
          let matches = true;
          if (state.filters) {
            for (const filter of state.filters) {
              if (filter.operator === 'eq' && item[filter.field] !== filter.value) {
                matches = false;
              }
            }
          }
          if (matches) {
            deletedItems.push(item);
            return false;
          }
          return true;
        });
      };

      if (table === 'leads') {
        leads = filterDelete(leads);
        setLocalData('pickmyshoot_leads', leads);
      }

      data = deletedItems;
    }

    return { data, error };
  };

  const auth = {
    async signInWithPassword({ email, password }) {
      // Fetch latest profiles
      let profiles = getLocalData('pickmyshoot_profiles', defaultProfiles);
      
      // Support legacy role-only login signatures mapping (mirroring AuthContext)
      let targetEmail = email;
      let targetPass = password;
      if (email === 'user') {
        targetEmail = 'customer@pickmyshoot.com';
        targetPass = 'password123';
      } else if (email === 'photographer') {
        targetEmail = 'photographer@pickmyshoot.com';
        targetPass = 'password123';
      }

      const userProfile = profiles.find(
        u => u.email.toLowerCase() === targetEmail.toLowerCase() && u.password === targetPass
      );

      if (userProfile) {
        return {
          data: {
            user: {
              id: userProfile.id,
              email: userProfile.email,
              user_metadata: {
                name: userProfile.name,
                role: userProfile.role
              }
            },
            session: { access_token: 'mock-session-token' }
          },
          error: null
        };
      } else {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid credentials. Note: Default login email is customer@pickmyshoot.com or photographer@pickmyshoot.com with password123.' }
        };
      }
    },

    async signUp({ email, password, options = {} }) {
      let profiles = getLocalData('pickmyshoot_profiles', defaultProfiles);
      if (profiles.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          data: { user: null, session: null },
          error: { message: 'User with this email already exists' }
        };
      }

      const role = options.data?.role || 'user';
      const name = options.data?.name || email.split('@')[0];
      const newUserId = `mock-user-${Math.floor(Math.random() * 1000000)}`;

      // Save to mock database
      const newProfile = {
        id: newUserId,
        name,
        email,
        password,
        role
      };
      profiles.push(newProfile);
      setLocalData('pickmyshoot_profiles', profiles);

      return {
        data: {
          user: {
            id: newUserId,
            email,
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              name,
              role
            }
          },
          session: { access_token: 'mock-session-token' }
        },
        error: null
      };
    },

    async signOut() {
      return { error: null };
    }
  };

  return {
    from(tableName) {
      return queryBuilder(tableName);
    },
    auth
  };
};

export const supabase = useMock 
  ? makeMockSupabase() 
  : createClient(supabaseUrl, supabaseAnonKey);
