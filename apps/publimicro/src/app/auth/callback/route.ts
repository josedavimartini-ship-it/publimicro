import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirect = requestUrl.searchParams.get('redirect') || '/';

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        // Redirect to login with error message
        return NextResponse.redirect(
          new URL(`/entrar?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      // Create profile if it doesn't exist
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
              phone: data.user.user_metadata?.phone || null,
              avatar_url: data.user.user_metadata?.avatar_url || null,
              updated_at: new Date().toISOString(),
            },
          ], { onConflict: 'id' });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(redirect, requestUrl.origin));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/entrar?error=authentication_failed', request.url)
    );
  }
}
