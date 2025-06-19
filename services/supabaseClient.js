import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

console.log('🔧 Initializing Supabase client...');

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create the Supabase client with appropriate storage configuration
const createSupabaseClient = () => {
  const options = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  };

  // Only add storage configuration in browser environment
  if (isBrowser) {
    options.auth.storageKey = 'supabase.auth.token';
    options.auth.storage = {
      getItem: (key) => {
        console.log('📦 Getting auth item:', key);
        const value = localStorage.getItem(key);
        console.log('📦 Auth item value:', value ? 'exists' : 'not found');
        return value;
      },
      setItem: (key, value) => {
        console.log('📦 Setting auth item:', key);
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        console.log('📦 Removing auth item:', key);
        localStorage.removeItem(key);
      },
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
};

export const supabase = createSupabaseClient();

// Only run the connection test in browser environment
if (isBrowser) {
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('❌ Error testing Supabase connection:', error);
    } else {
      console.log('✅ Supabase connection successful');
      if (session) {
        console.log('👤 Active session found:', session.user.email);
      } else {
        console.log('ℹ️ No active session');
      }
    }
  });
}