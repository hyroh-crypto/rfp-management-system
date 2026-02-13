/**
 * Next.js Middleware
 *
 * 라우트 보호 및 역할 기반 접근 제어 (RBAC)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ============================================
// Route Configuration
// ============================================

/**
 * 인증이 필요한 경로
 */
const protectedRoutes = ['/rfps', '/proposals', '/clients', '/prototypes', '/settings']

/**
 * 인증된 사용자는 접근할 수 없는 경로 (로그인/회원가입 등)
 */
const authRoutes = ['/login', '/signup']

/**
 * 공개 경로 (인증 불필요)
 */
const publicRoutes = ['/auth/reset-password', '/auth/update-password', '/auth/callback']

/**
 * 역할별 접근 가능 경로
 */
const roleBasedRoutes: Record<string, string[]> = {
  admin: ['*'], // 모든 경로 접근 가능
  manager: ['/rfps', '/proposals', '/clients', '/prototypes', '/settings'],
  writer: ['/rfps', '/proposals', '/clients'],
  reviewer: ['/rfps', '/proposals'],
}

// ============================================
// Helper Functions
// ============================================

/**
 * 경로가 보호된 경로인지 확인
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

/**
 * 경로가 인증 경로인지 확인
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route))
}

/**
 * 경로가 공개 경로인지 확인
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route))
}

/**
 * 사용자 역할이 경로에 접근 가능한지 확인
 */
function hasRouteAccess(pathname: string, userRole: string): boolean {
  const allowedRoutes = roleBasedRoutes[userRole] || []

  // Admin은 모든 경로 접근 가능
  if (allowedRoutes.includes('*')) {
    return true
  }

  // 허용된 경로 확인
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

// ============================================
// Middleware
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일 및 API 경로는 스킵
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Supabase 클라이언트 생성
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Authorization 헤더에서 토큰 추출
  const token = request.cookies.get('sb-access-token')?.value

  let session = null

  if (token) {
    // 토큰으로 사용자 정보 조회
    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    session = user ? { user } : null
  }

  const res = NextResponse.next()

  // 1. 공개 경로는 그대로 통과
  if (isPublicRoute(pathname)) {
    return res
  }

  // 2. 인증 경로 처리 (로그인/회원가입)
  if (isAuthRoute(pathname)) {
    // 이미 로그인한 경우 대시보드로 리다이렉트
    if (session) {
      return NextResponse.redirect(new URL('/rfps', request.url))
    }
    return res
  }

  // 3. 보호된 경로 처리
  if (isProtectedRoute(pathname)) {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 사용자 프로필 조회 (역할 확인)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      // 프로필이 없는 경우 로그아웃
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 역할 기반 접근 제어
    if (!hasRouteAccess(pathname, profile.role)) {
      // 권한이 없는 경우 403 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/403', request.url))
    }

    return res
  }

  // 4. 루트 경로 처리
  if (pathname === '/') {
    // 로그인한 경우 대시보드로, 아니면 로그인 페이지로
    const redirectUrl = session ? '/rfps' : '/login'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return res
}

// ============================================
// Middleware Config
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
