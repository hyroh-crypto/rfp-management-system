# RFP Management System

AI 기반 제안요청서 관리 및 제안서 자동 생성 시스템

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 생성하고 필수 값을 입력하세요.

```bash
cp .env.example .env.local
```

### 3. bkend.ai 프로젝트 생성

1. [bkend.ai 콘솔](https://console.bkend.ai)에 접속
2. 새 프로젝트 생성
3. Project ID를 `.env.local`에 설정

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 📂 프로젝트 구조

```
rfp-management/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── features/            # 기능별 모듈
│   ├── hooks/               # Custom Hooks
│   ├── lib/                 # 유틸리티 및 설정
│   ├── services/            # API 서비스 레이어
│   ├── stores/              # 상태 관리 (Zustand)
│   └── types/               # TypeScript 타입
├── docs/                    # PDCA 문서
│   ├── 01-plan/            # 계획 문서
│   ├── 02-design/          # 설계 문서
│   ├── 03-analysis/        # 분석 문서
│   └── 04-report/          # 보고서
├── mockup/                  # HTML/CSS 목업
└── public/                  # 정적 파일
```

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query, Zustand
- **Backend**: bkend.ai BaaS
- **Database**: MongoDB (bkend.ai managed)
- **Authentication**: JWT (bkend.ai)

## 📖 문서

- [용어 정의](docs/01-plan/glossary.md)
- [데이터 스키마](docs/01-plan/schema.md)
- [코딩 컨벤션](CONVENTIONS.md)
- [API 명세](docs/02-design/api-spec.md)
- [목업 명세](docs/02-design/mockup-spec.md)

## 🎯 주요 기능

### 1. RFP 관리
- 제안요청서 접수 및 상태 관리
- AI 기반 요구사항 자동 분석
- 위험도 평가 및 예상 공수 산정

### 2. 제안서 작성
- AI 기반 제안서 자동 생성
- 섹션별 편집 및 버전 관리
- 팀 구성 및 일정 계획

### 3. UI 프로토타입
- 와이어프레임 생성
- Figma 프로토타입 통합
- 상태별 버전 관리

## 🔐 인증

bkend.ai JWT 인증 사용:
- Access Token: 1시간
- Refresh Token: 7일

## 📝 개발 가이드

### 컴포넌트 작성

```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  // ...
}
```

### API 호출 패턴

```typescript
// 1. Service 정의
// src/services/rfp.service.ts
export const rfpService = {
  getList: () => bkend.data.list('rfps'),
  getById: (id: string) => bkend.data.get('rfps', id),
};

// 2. Hook 사용
// src/hooks/useRfps.ts
export function useRfps() {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: rfpService.getList,
  });
}

// 3. 컴포넌트에서 사용
export function RfpList() {
  const { data: rfps } = useRfps();
  // ...
}
```

## 🧪 테스트

Zero Script QA 방법론 사용:
- 로그 기반 검증
- Docker 로그 모니터링
- 실시간 동작 확인

## 🚀 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정:
- `NEXT_PUBLIC_BKEND_PROJECT_ID`
- `NEXT_PUBLIC_BKEND_ENV` (production)

## 📄 라이선스

MIT License

## 👥 기여

이슈 및 PR은 언제나 환영입니다!

---

**개발 레벨**: Dynamic (풀스택 웹앱)
**현재 단계**: Phase 4 - API Design/Implementation
**Last Updated**: 2026-02-11
