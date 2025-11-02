import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        // Redirect to home with error message
        return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
      }
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
    }
  }

  // Redirect to the requested page or home after successful authentication
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}