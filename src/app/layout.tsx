import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RFP Management System",
    template: "%s | RFP Management System",
  },
  description: "AI 기반 제안요청서(RFP) 관리 및 제안서 자동 생성 시스템",
  keywords: ["RFP", "제안서", "AI", "자동화", "프로젝트 관리"],
  authors: [{ name: "RFP Team" }],
  creator: "RFP Team",
  publisher: "RFP Management",
  robots: {
    index: false, // 내부 시스템이므로 검색 엔진에서 제외
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "RFP Management System",
    description: "AI 기반 제안요청서 관리 및 제안서 자동 생성 시스템",
    siteName: "RFP Management System",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
