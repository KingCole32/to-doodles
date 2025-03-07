import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { StoreEnum } from './types/Store';

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const path = request.nextUrl.pathname;

  if (path == "/") cookieStore.set(StoreEnum.refreshUrl, "/" + request.nextUrl.search)

  if (!cookieStore.has(StoreEnum.user) && path != "/login" && path != "/signup")
    return NextResponse.redirect(new URL('/login', request.url))
  else return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Ignore paths to non-page assests
     */
    '/((?!api|_next|.*\\..*).*)',
  ],
}