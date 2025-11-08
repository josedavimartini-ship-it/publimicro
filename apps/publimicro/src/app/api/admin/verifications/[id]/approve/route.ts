import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication and admin role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { notes } = await request.json();

    // Update verification status
    const { data: verification, error } = await supabase
      .from('user_verifications')
      .update({
        status: 'approved',
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes || null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // Update user profile verification status
    await supabase
      .from('user_profiles')
      .update({
        verification_status: 'approved',
        verified_at: new Date().toISOString(),
      })
      .eq('user_id', verification.user_id);

    // TODO: Send email notification to user
    // await sendVerificationApprovedEmail(verification.user_id);

    return NextResponse.json({ 
      success: true,
      verification 
    });
  } catch (error) {
    console.error('Error approving verification:', error);
    return NextResponse.json(
      { error: 'Failed to approve verification' },
      { status: 500 }
    );
  }
}
