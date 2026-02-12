import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - RFP Management System',
  description: 'Login or sign up to access the RFP Management System',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RFP Management
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              제안요청서 관리 시스템
            </p>
          </div>

          {/* Content */}
          {children}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
