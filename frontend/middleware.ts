import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rolePaths, type Role } from './src/constants/roles';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

const protectedRoutes: { pattern: RegExp; roles: Role[] }[] = [
  { pattern: /^\/admin(\/|$)/, roles: ['admin'] },
  { pattern: /^\/employee(\/|$)/, roles: ['employee'] },
  { pattern: /^\/client(\/|$)/, roles: ['client'] },
];

const loginPath = '/login';

async function verifyToken(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as { user: { role: Role } };
  } catch (error) {
    console.error('Token verification failed', error);
    return null;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('auth_token');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const matchedRoute = protectedRoutes.find(({ pattern }) => pattern.test(pathname));

  // Handle login redirection when already authenticated
  if (!matchedRoute) {
    if (pathname === loginPath && token) {
      const verified = await verifyToken(token);
      if (verified?.user.role) {
        return NextResponse.redirect(new URL(rolePaths[verified.user.role], request.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return redirectToLogin(request);
  }

  const verified = await verifyToken(token);

  if (!verified?.user) {
    return redirectToLogin(request);
  }

  if (!matchedRoute.roles.includes(verified.user.role)) {
    const destination = rolePaths[verified.user.role];
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*', '/client/:path*', '/login'],
};

