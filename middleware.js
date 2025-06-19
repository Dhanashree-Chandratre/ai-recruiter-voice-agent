import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { storeUser } from './lib/userStorage';

export async function middleware(req) {
  console.log('🚀 Middleware started for:', req.nextUrl.pathname);

  try {
    // Create Supabase client with cookie handling
    const res = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => {
            const cookie = req.cookies.get(name);
            console.log('🍪 Getting cookie:', name, cookie?.value ? 'exists' : 'not found');
            return cookie?.value;
          },
          set: (name, value, options) => {
            console.log('🍪 Setting cookie:', name);
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove: (name, options) => {
            console.log('🍪 Removing cookie:', name);
            res.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check for session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return res;
    }

    if (session?.user) {
      console.log('👤 Session found for user:', session.user.email);
      
      try {
        // Store/update user in database
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          picture: session.user.user_metadata?.avatar_url || session.user.picture
        };

        console.log('📝 Attempting to store user:', userData);
        await storeUser(userData);
        console.log('✅ User storage successful');
      } catch (storageError) {
        console.error('❌ Error storing user:', storageError);
        // Continue with the request even if storage fails
      }
    } else {
      console.log('ℹ️ No active session');
    }

    return res;
  } catch (error) {
    console.error('❌ Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 