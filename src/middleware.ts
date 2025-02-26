import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request});
 

  const url = request.nextUrl;
  console.log('Token:', token,url.pathname);

  // Define paths that bypass authentication
  const bypassAuthPaths = ['/sign-in','/forgot-password','/reset-password','/sign-up'];
  const disbaledPaths=['sing']
  const isDisabledPath = disbaledPaths.some((path) => url.pathname.startsWith(path));
  

  // Redirect to dashboard if authenticated and accessing restricted pages
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/forgot-password') ||
      url.pathname.startsWith('/reset-password') ||
      
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to sign-in
  if (!token) {
    
    const isBypassPath = bypassAuthPaths.some((path) => url.pathname.startsWith(path) || url.pathname.startsWith('/loaderio'));
    console.log("isBypassPath",isBypassPath)

    if (!isBypassPath || isDisabledPath) {
      console.log('Redirecting to /sign-in');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}
