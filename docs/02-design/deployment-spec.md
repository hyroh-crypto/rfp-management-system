# Deployment Specification

**프로젝트**: RFP Management System
**레벨**: Dynamic
**플랫폼**: Vercel (권장)
**작성일**: 2026-02-12

---

## 📋 배포 개요

RFP Management System은 Next.js 15 기반 풀스택 웹 애플리케이션으로, Vercel을 통한 배포를 권장합니다.

### 기술 스택
- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel
- **Domain**: 사용자 설정 필요

---

## 🔐 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 예시 | 환경 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key | `eyJ...` | All |
| `GEMINI_API_KEY` | Google Gemini API 키 (선택) | `AIza...` | Production |

### 선택 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 애플리케이션 URL | `http://localhost:3002` |
| `NEXT_PUBLIC_APP_NAME` | 앱 이름 | `RFP Management System` |

---

## 🚀 Vercel 배포 가이드

### 준비사항

1. **Vercel 계정 생성**
   - https://vercel.com 가입
   - GitHub 연동

2. **Supabase 프로젝트 설정**
   - Supabase 대시보드에서 프로젝트 생성
   - URL과 Anon Key 확인

### 배포 단계

#### 1. Git Repository 연결

```bash
# 1. Git 초기화 (아직 안 한 경우)
git init
git add .
git commit -m "Initial commit"

# 2. GitHub Repository 생성 후 연결
git remote add origin https://github.com/your-username/rfp-management.git
git push -u origin main
```

#### 2. Vercel 프로젝트 생성

1. Vercel Dashboard → **New Project**
2. GitHub Repository 선택: `rfp-management`
3. Framework Preset: **Next.js** (자동 감지)
4. Root Directory: `./` (기본값)

#### 3. 환경 변수 설정

**Project Settings → Environment Variables**에서 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://tqkwnbcydlheutkbzeah.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJ... (your anon key)
Environments: ✓ Production ✓ Preview ✓ Development
✓ Sensitive (체크)

GEMINI_API_KEY (선택)
Value: AIza... (your API key)
Environments: ✓ Production
✓ Sensitive (체크)
```

#### 4. 빌드 설정

**Build & Development Settings**:
- Build Command: `npm run build` (기본값)
- Output Directory: `.next` (기본값)
- Install Command: `npm install` (기본값)

#### 5. 배포 실행

**Deploy** 버튼 클릭 → 자동 빌드 및 배포

---

## 📝 배포 전 체크리스트

### 코드 준비

- [x] Production 빌드 성공 (`npm run build`)
- [x] TypeScript 타입 에러 없음
- [x] ESLint 경고 확인
- [x] `.env` 파일 Git 제외 (.gitignore)
- [x] Security Headers 설정 (next.config.ts)

### Supabase 설정

- [ ] 테이블 생성 완료 (RLS 정책 포함)
- [ ] Authentication 활성화
- [ ] Storage 버킷 생성 (rfp-files)
- [ ] API Keys 확인 (URL, Anon Key)

### 환경 변수

- [ ] `.env.example` 파일 최신 상태 유지
- [ ] Vercel에 모든 필수 환경 변수 등록
- [ ] Production/Staging 환경 분리 (선택)

### 보안

- [x] API 키 .env.local로 이동
- [x] Supabase RLS 정책 설정
- [x] CORS 설정 확인
- [x] Rate Limiting 고려 (향후)

---

## 🔄 CI/CD 설정 (선택)

### GitHub Actions (자동 배포)

Vercel은 Git push 시 자동으로 배포하므로 별도 CI/CD 불필요. 단, 추가 검증이 필요한 경우:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

---

## 🌐 도메인 설정

### Vercel 기본 도메인

- `https://rfp-management.vercel.app` (자동 생성)

### 커스텀 도메인 (선택)

1. Vercel Dashboard → **Settings → Domains**
2. **Add Domain**: `your-domain.com`
3. DNS 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 📊 모니터링 및 로깅

### Vercel Analytics

- **Settings → Analytics** 활성화
- Web Vitals 자동 수집
- 트래픽 분석

### Error Tracking (선택)

- Sentry 연동
- Supabase Logs 활용

---

## 🔧 배포 후 설정

### Supabase RLS 정책 업데이트

Production 환경에서 RLS 정책 강화:

```sql
-- 예: RFP는 인증된 사용자만 조회 가능
ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON rfps
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 성능 최적화

- [ ] 이미지 최적화 (`next/image` 사용)
- [ ] 폰트 최적화 (`next/font` 사용)
- [ ] Code Splitting 확인
- [ ] Bundle Analyzer 실행

```bash
# Bundle 분석
npm run build
npx @next/bundle-analyzer
```

---

## 🚨 롤백 계획

### Vercel 롤백

1. Vercel Dashboard → **Deployments**
2. 이전 성공한 배포 선택
3. **Promote to Production** 클릭

### 긴급 롤백 (CLI)

```bash
vercel rollback
```

---

## 📈 배포 후 검증

### Health Check

```bash
# Production URL 확인
curl https://rfp-management.vercel.app/api/health

# 주요 페이지 확인
curl https://rfp-management.vercel.app/
curl https://rfp-management.vercel.app/clients
curl https://rfp-management.vercel.app/rfps
```

### 기능 검증 체크리스트

- [ ] 로그인/로그아웃
- [ ] 고객사 목록 조회
- [ ] RFP 목록 조회
- [ ] RFP 상세 페이지
- [ ] RFP 생성/수정/삭제
- [ ] 요구사항 관리
- [ ] 댓글 기능

---

## 📚 참고 자료

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Supabase Production Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)

---

**작성자**: bkit Phase 9
**최종 수정**: 2026-02-12
