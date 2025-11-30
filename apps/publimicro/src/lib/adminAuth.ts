import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Verify admin authentication and authorization
 * Returns null if authorized, or NextResponse with error if not
 */
export async function verifyAdminAuth(): Promise<{ authorized: true; userId: string } | { authorized: false; response: NextResponse }> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        authorized: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return {
        authorized: false,
        response: NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      };
    }

    return {
      authorized: true,
      userId: session.user.id
    };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    };
  }
}

/**
 * Rate limiting helper - tracks requests per IP/user
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
