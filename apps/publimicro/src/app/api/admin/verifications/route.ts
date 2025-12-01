import { createRouteSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { verifyAdminAuth, checkRateLimit, getClientIP } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    // Rate limiting - 100 requests per minute per IP
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 100, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Verify admin authentication
    const authError = await verifyAdminAuth();
    if (authError) return authError;

    const supabase = createRouteSupabaseClient();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    // Build query
    let query = supabase
      .from('user_verifications')
      .select(`
        *,
        user_profiles (
          full_name,
          email,
          phone_number
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by status
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Search by name or CPF
    if (search) {
      query = query.or(`cpf.ilike.%${search}%,user_profiles.full_name.ilike.%${search}%`);
    }

    const { data: verifications, error } = await query;

    if (error) throw error;

    return NextResponse.json({ verifications });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
