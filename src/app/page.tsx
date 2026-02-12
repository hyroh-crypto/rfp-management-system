import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          RFP Management System
        </h1>
        <p className="text-gray-300 text-lg">
          AI 기반 제안요청서 관리 시스템
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/rfps">
            <Button size="lg">RFP 목록 보기</Button>
          </Link>
          <Link href="/proposals">
            <Button variant="secondary" size="lg">제안서 관리</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
