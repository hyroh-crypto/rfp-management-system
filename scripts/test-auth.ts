/**
 * Auth Service Test Script
 *
 * authService 기능 테스트
 */

import { authService } from '../src/services/auth.service'
import type { SignupData, LoginData } from '../src/types/auth'

// 테스트 데이터
const TEST_USER: SignupData = {
  email: 'test@example.com',
  password: 'Test1234!@#$',
  passwordConfirm: 'Test1234!@#$',
  name: '테스트 사용자',
  termsAccepted: true,
}

const TEST_LOGIN: LoginData = {
  email: 'test@example.com',
  password: 'Test1234!@#$',
  rememberMe: false,
}

async function testAuthService() {
  console.log('🧪 Auth Service Test Starting...\n')

  try {
    // Test 1: 회원가입
    console.log('📝 Test 1: Signup')
    console.log('Input:', { email: TEST_USER.email, name: TEST_USER.name })

    const signupResult = await authService.signup(TEST_USER)

    if (signupResult.error) {
      console.log('❌ Signup Failed:', signupResult.error.message)

      // 이미 존재하는 사용자인 경우 로그인 테스트로 바로 진행
      if (signupResult.error.code === 'EMAIL_ALREADY_EXISTS') {
        console.log('ℹ️  User already exists, skipping to login test\n')
      } else {
        throw new Error(signupResult.error.message)
      }
    } else {
      console.log('✅ Signup Success:', {
        id: signupResult.data?.id,
        email: signupResult.data?.email,
        name: signupResult.data?.name,
        role: signupResult.data?.role,
        emailVerified: signupResult.data?.emailVerified,
      })
      console.log(
        '⚠️  Please check your email to verify before login\n'
      )
    }

    // Test 2: 로그인
    console.log('🔐 Test 2: Login')
    console.log('Input:', { email: TEST_LOGIN.email })

    const loginResult = await authService.login(TEST_LOGIN)

    if (loginResult.error) {
      console.log('❌ Login Failed:', loginResult.error.message)

      if (loginResult.error.code === 'EMAIL_NOT_VERIFIED') {
        console.log('⚠️  Email verification required\n')
      } else {
        throw new Error(loginResult.error.message)
      }
    } else {
      console.log('✅ Login Success:', {
        id: loginResult.data?.id,
        email: loginResult.data?.email,
        name: loginResult.data?.name,
        role: loginResult.data?.role,
      })
      console.log('')
    }

    // Test 3: 현재 사용자 조회
    console.log('👤 Test 3: Get Current User')

    const currentUser = await authService.getCurrentUser()

    if (!currentUser) {
      console.log('⚠️  No authenticated user found\n')
    } else {
      console.log('✅ Current User:', {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
        emailVerified: currentUser.emailVerified,
      })
      console.log('')
    }

    // Test 4: 세션 조회
    console.log('🎫 Test 4: Get Session')

    const session = await authService.getSession()

    if (!session) {
      console.log('⚠️  No active session found\n')
    } else {
      console.log('✅ Session:', {
        userId: session.user.id,
        expiresAt: new Date(session.expiresAt * 1000).toISOString(),
        hasAccessToken: !!session.accessToken,
        hasRefreshToken: !!session.refreshToken,
      })
      console.log('')
    }

    // Test 5: 로그아웃
    if (currentUser) {
      console.log('🚪 Test 5: Logout')

      await authService.logout()

      console.log('✅ Logout Success\n')

      // 로그아웃 후 사용자 확인
      const userAfterLogout = await authService.getCurrentUser()
      if (!userAfterLogout) {
        console.log('✅ User successfully logged out\n')
      } else {
        console.log('❌ User still authenticated after logout\n')
      }
    }

    console.log('✅ All tests completed!\n')
  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run tests
testAuthService()
