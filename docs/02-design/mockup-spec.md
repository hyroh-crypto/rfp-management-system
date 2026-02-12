# Mockup Specification - RFP Management System

> HTML/CSS/JS 목업 명세서

**버전**: 1.0.0
**작성일**: 2026-02-11
**완료일**: 2026-02-11

---

## 📋 목차

1. [개요](#1-개요)
2. [디자인 시스템](#2-디자인-시스템)
3. [구현된 페이지](#3-구현된-페이지)
4. [컴포넌트 매핑](#4-컴포넌트-매핑)
5. [Next.js 전환 가이드](#5-nextjs-전환-가이드)

---

## 1. 개요

### 1.1 목적

RFP 관리 시스템의 주요 화면을 HTML/CSS/JS 목업으로 제작하여:
- 기능 및 UI/UX 검증
- 사용자 피드백 수집
- Next.js 전환 준비

### 1.2 적용 트렌드

**2025-2026 UI/UX 트렌드 반영:**
- ✅ **Dark Mode First**: 다크 모드 기본 적용
- ✅ **Glassmorphism**: 유리 질감 효과
- ✅ **Modern Color Palette**: 현대적인 컬러 시스템
- ✅ **Micro-interactions**: 버튼 호버, 카드 애니메이션
- ✅ **Bento Grid**: 모던한 그리드 레이아웃

### 1.3 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Custom Properties (CSS Variables), Glassmorphism
- **JavaScript (ES6+)**: Fetch API, DOM Manipulation
- **폰트**: Google Fonts (Inter)

---

## 2. 디자인 시스템

### 2.1 컬러 팔레트

| Color | Usage | Variable |
|-------|-------|----------|
| **Primary Blue** | 주요 액션, 링크 | `--color-primary-*` |
| **Secondary Purple** | 보조 액션, AI 관련 | `--color-secondary-*` |
| **Accent Green** | 성공, 승인 상태 | `--color-accent-*` |
| **Danger Red** | 오류, 거절 상태 | `--color-danger-*` |
| **Warning Yellow** | 경고, 진행 중 | `--color-warning-*` |
| **Grayscale** | 배경, 텍스트 | `--color-gray-*` |

### 2.2 타이포그래피

```
폰트 패밀리:
- Base: 'Inter', sans-serif
- Heading: 'Inter', sans-serif
- Mono: 'JetBrains Mono', monospace

크기 스케일:
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

Font Weight:
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
```

### 2.3 Spacing System

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### 2.4 Border Radius

```
sm: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px (원형)
```

---

## 3. 구현된 페이지

### 3.1 RFP 목록 페이지 ✅

**파일**: `mockup/pages/rfp-list.html`

**기능:**
- RFP 목록 표시 (카드 그리드)
- 상태별 필터링 (전체, 접수됨, 분석 중, 분석 완료)
- 검색 기능
- 통계 표시 (전체, 분석 중, 분석 완료 개수)
- AI 분석 결과 미리보기

**데이터**: `mockup/data/rfps.json`

**컴포넌트:**
- Header (네비게이션, 로고, 액션 버튼)
- Stat Card (통계 카드)
- RFP Card (목록 아이템)
- Filter Buttons
- Search Input

**스크린샷 위치**: `docs/02-design/screenshots/rfp-list.png` (예정)

### 3.2 구현 예정 페이지 (Phase 4+)

다음 페이지들은 Phase 4 이후 구현 예정:

1. **RFP 상세/분석 페이지** (`rfp-detail.html`)
   - RFP 상세 정보
   - AI 분석 결과 전체 뷰
   - 요구사항 목록
   - 담당자 배정

2. **제안서 편집기** (`proposal-editor.html`)
   - 제안서 섹션 편집
   - Markdown 에디터
   - 실시간 미리보기
   - 팀 구성 편집

3. **UI 프로토타입 갤러리** (`prototype-gallery.html`)
   - 프로토타입 목록
   - 이미지 뷰어
   - Figma 링크
   - 상태 관리

---

## 4. 컴포넌트 매핑

### 4.1 목업 → Next.js 컴포넌트 매핑

| 목업 컴포넌트 | Next.js 컴포넌트 경로 | Props |
|--------------|---------------------|-------|
| **Button** | `components/ui/Button.tsx` | variant, size, disabled, children |
| **Card** | `components/ui/Card.tsx` | children, clickable, elevated |
| **Badge** | `components/ui/Badge.tsx` | variant, size, children |
| **Header** | `components/shared/Header.tsx` | user, navigation |
| **RfpCard** | `features/rfp/components/RfpCard.tsx` | rfp, onSelect |
| **StatCard** | `components/shared/StatCard.tsx` | value, label, variant |
| **SearchInput** | `components/ui/SearchInput.tsx` | placeholder, onChange |

### 4.2 CSS 클래스 → Tailwind/CSS Modules

목업의 CSS 클래스는 Next.js 전환 시 다음 방식으로 전환:

**Option 1: Tailwind CSS**
```tsx
// 목업: <button class="btn btn--primary">
<Button variant="primary">클릭</Button>

// components/ui/Button.tsx
const variants = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-500...',
  secondary: 'bg-white/5 border border-white/10...',
}
```

**Option 2: CSS Modules**
```tsx
// 목업: <div class="rfp-card">
<div className={styles.rfpCard}>

// RfpCard.module.css
.rfpCard {
  background: var(--glass-bg);
  ...
}
```

---

## 5. Next.js 전환 가이드

### 5.1 전환 순서

```
1. 디자인 토큰 전환
   mockup/styles/base/variables.css
   → styles/tokens.css (CSS Variables 유지)
   또는 tailwind.config.ts (Tailwind 변환)

2. Base CSS 전환
   mockup/styles/base/reset.css
   → styles/globals.css

3. 컴포넌트 전환 (우선순위순)
   a. UI 기본 컴포넌트 (Button, Card, Badge)
   b. 레이아웃 컴포넌트 (Header, Sidebar)
   c. 도메인 컴포넌트 (RfpCard, ProposalCard)

4. 페이지 전환
   mockup/pages/rfp-list.html
   → app/(dashboard)/rfps/page.tsx

5. 데이터 레이어 연결
   mockup/data/rfps.json (Mock)
   → API Routes + React Query
```

### 5.2 전환 예시: RfpCard

**목업 (HTML/CSS)**:
```html
<!-- mockup/components/rfp-card.html -->
<div class="card rfp-card">
  <h3 class="rfp-card__title">ERP 시스템 구축</h3>
  <span class="badge badge--analyzing">분석 중</span>
</div>
```

```css
/* mockup/styles/components/card.css */
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}
```

**Next.js (TypeScript)**:
```tsx
// features/rfp/components/RfpCard.tsx
import type { RFP } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RfpCardProps {
  rfp: RFP;
  onSelect?: (id: string) => void;
}

export function RfpCard({ rfp, onSelect }: RfpCardProps) {
  return (
    <Card onClick={() => onSelect?.(rfp.id)}>
      <h3 className="text-lg font-semibold">{rfp.title}</h3>
      <Badge variant={rfp.status}>{rfp.status}</Badge>
    </Card>
  );
}
```

CSS는 **그대로 재사용** 가능! (CSS Modules 또는 Global CSS)

### 5.3 데이터 로딩 패턴 전환

**목업 (JavaScript)**:
```javascript
// mockup/scripts/rfp-list.js
async function loadRfps() {
  const response = await fetch('../data/rfps.json');
  const data = await response.json();
  rfps = data.data;
  renderRfps();
}
```

**Next.js (React Query)**:
```tsx
// features/rfp/hooks/useRfps.ts
import { useQuery } from '@tanstack/react-query';
import { rfpService } from '../services/rfp.service';

export function useRfps(filters?: RfpFilters) {
  return useQuery({
    queryKey: ['rfps', filters],
    queryFn: () => rfpService.getList(filters),
  });
}

// app/(dashboard)/rfps/page.tsx
export default function RfpListPage() {
  const { data: rfps, isLoading } = useRfps();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="card-grid">
      {rfps.map(rfp => (
        <RfpCard key={rfp.id} rfp={rfp} />
      ))}
    </div>
  );
}
```

---

## 6. 검증 체크리스트

### 6.1 UI/UX 검증
- [x] 다크 모드 적용
- [x] Glassmorphism 효과
- [x] 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [x] 마이크로 인터랙션 (호버, 클릭)
- [x] 로딩 상태 표시
- [ ] 빈 상태(Empty State) 디자인
- [ ] 에러 상태 디자인

### 6.2 기능 검증
- [x] 데이터 로딩 (JSON)
- [x] 필터링 (상태별)
- [x] 검색 기능
- [x] 통계 계산
- [ ] 정렬 기능
- [ ] 페이지네이션

### 6.3 Next.js 전환 준비
- [x] 컴포넌트 단위 설계
- [x] CSS Variables 사용
- [x] Props 인터페이스 설계 (JSON 구조)
- [x] 컴포넌트 매핑 문서
- [ ] 스토리북 설정 (선택)

---

## 7. 다음 단계

### Phase 4: API Design/Implementation

목업 검증 완료 후:
1. JSON 구조를 API 스키마로 전환
2. API 엔드포인트 설계
3. Next.js 컴포넌트 구현 시작

---

**이 문서는 Next.js 전환 시 참조하는 가이드입니다.**
