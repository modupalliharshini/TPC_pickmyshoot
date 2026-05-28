import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

  return {
    from(tableName) {
      return queryBuilder(tableName);
    }
  };
};

export const supabase = useMock 
  ? makeMockSupabase() 
  : createClient(supabaseUrl, supabaseAnonKey);
