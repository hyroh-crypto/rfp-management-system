import { Header } from '@/components/layout/header'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <AuthGuard redirectTo="/auth/login"> {/* 테스트를 위해 임시 비활성화 */}
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
    // </AuthGuard>
  )
}
