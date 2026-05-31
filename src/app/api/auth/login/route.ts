import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin_secret_token';

    if (!password) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    if (password === expectedPassword) {
      const cookieStore = cookies();
      
      // Seal an auth state session token into cookie
      cookieStore.set('admin_session', 'session_active_token_v1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // Session active for 24 hours
      });

      return NextResponse.json({ success: true, message: 'Session initialized successfully' });
    }

    return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
