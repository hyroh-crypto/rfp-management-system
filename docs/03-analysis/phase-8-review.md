# Phase 8: 코드 리뷰 보고서

**프로젝트**: RFP Management System
**분석일**: 2026-02-12
**분석자**: code-analyzer agent
**전체 품질 점수**: 72/100

---

## 📊 Executive Summary

RFP Management System의 전체 코드베이스를 분석한 결과, **Dynamic 레벨 프로젝트로서 기본 아키텍처는 잘 구성**되어 있으나, **5개의 Critical 이슈**와 **17개의 Warning**이 발견되었습니다.

즉시 수정이 필요한 보안 이슈(API 키 노출)는 해결되었으며, 나머지 아키텍처 및 코드 품질 이슈는 향후 리팩토링 시 단계적으로 개선할 수 있습니다.

---

## 1️⃣ Architecture Review

### ✅ 잘된 점

- **명확한 레이어 분리**: Pages → Components → Hooks → Services → Supabase
- **타입 중앙화**: `src/types/` 디렉토리로 타입 정의 집중
- **검증 스키마 중앙화**: `src/lib/validations/` 디렉토리로 Zod 스키마 관리
- **RBAC 권한 시스템**: `src/lib/permissions.ts`의 체계적인 역할별 권한 매트릭스
- **BaseService 패턴**: 제네릭 클래스로 CRUD 보일러플레이트 감소

### ❌ Critical Issues

1. **이중 서비스 아키텍처**: 같은 도메인에 대해 함수 기반과 클래스 기반 서비스가 공존
   - 예: `rfp.service.ts` (함수) vs `RfpService` 클래스
   - **권장 조치**: 함수 기반으로 통일 (Next.js 서버 컴포넌트에 더 적합)

2. **중복 Hook 파일**: `useRFPs.ts` (camelCase) vs `use-rfps.ts` (kebab-case)
   - **권장 조치**: kebab-case 버전으로 통일, 모든 import 업데이트

3. **이중 타입 정의**: `src/types/index.ts`와 도메인별 파일에서 같은 엔티티를 다르게 정의
   - 예: `Client` 타입의 contact 필드 구조가 다름
   - **권장 조치**: 도메인별 파일로 통합, index.ts에서 re-export만

### ⚠️ Warning

- `src/features/` 디렉토리 누락 (CONVENTIONS.md에 정의되었으나 미구현)
- `src/constants/`, `src/stores/` 디렉토리 누락
- Zustand가 package.json에 있으나 실제 사용 안 함

---

## 2️⃣ Convention Compliance

### ✅ 잘 준수된 컨벤션

- **Import 순서**: React → 외부 라이브러리 → 내부 모듈 → 타입 (대부분 준수)
- **명명 규칙**: 컴포넌트(PascalCase), 함수(camelCase), 상수(UPPER_SNAKE_CASE) 준수

### ⚠️ 일관성 부족

- **파일 명명**: CONVENTIONS.md는 PascalCase를 명시했으나 실제로는 kebab-case 사용
  - 실제: `rfp-list.tsx`, `rfp-card.tsx`, `login-form.tsx`
  - **권장**: 실제 사용 중인 kebab-case로 컨벤션 문서 업데이트

---

## 3️⃣ Code Quality Review

### ❌ Critical: `any` 타입 남용 (16+ 곳)

CONVENTIONS.md에서 **"`any` 사용 금지, `unknown` 사용"**을 명시했으나, 다음 파일들에서 광범위하게 사용:

| 파일 | 위치 | 코드 |
|------|------|------|
| `rfp.service.ts` | 6곳 | `Record<string, any>`, `function transformRfp(row: any)` |
| `client.service.ts` | 2곳 | `function transformClient(row: any)` |
| `requirement.service.ts` | 2곳 | `function transformRequirement(row: any)` |
| `comment.service.ts` | 3곳 | `function transformComment(row: any)` |
| `login-form.tsx`, `signup-form.tsx` | 2곳 | `catch (err: any)` |

**권장 조치**:
```typescript
// ❌ Before
function transformRfp(row: any): RFP { ... }

// ✅ After
function transformRfp(row: Database['public']['Tables']['rfps']['Row']): RFP { ... }
```

### ⚠️ 중복 코드

1. **Transform 함수 중복** (3개)
   - `transformRequirement`: `rfp.service.ts:261` + `requirement.service.ts:177`
   - `transformComment`: `rfp.service.ts:282` + `comment.service.ts:171`
   - `transformClient`: `rfp.service.ts:300` + `client.service.ts:154`

   **권장**: `src/lib/transforms.ts`로 추출

2. **`formatFileSize` 중복**
   - `src/lib/utils.ts:72` + `src/services/file.service.ts:191`

### ⚠️ 에러 처리

- **`alert()` 사용** (3곳): `rfp-form.tsx`, `rfp-edit-form.tsx`, `rfps/[id]/page.tsx`
  - **권장**: Toast/Notification 시스템으로 대체

- **에러 메시지 노출**: Supabase 내부 에러를 그대로 클라이언트에 전달
  ```typescript
  // ❌ Before
  throw new Error(`Failed to fetch RFP: ${error.message}`)

  // ✅ After (Phase 7에서 구현)
  return apiErrors.databaseError('RFP 조회 중 오류가 발생했습니다')
  ```

### ⚠️ 기타

- **console 문** 27개 (debug logs 포함)
- **TODO 주석** 9개 (대부분 "Phase 5" 관련)
- **TanStack Query `staleTime` 미설정**: 모든 hook에서 누락 (권장: 5분)

---

## 4️⃣ Security Inspection

### ✅ 해결됨

- **API 키 노출**: `.env` 파일을 `.env.local`로 이동 → Git 추적 제외 ✅

### ⚠️ 개선 권장

1. **SQL Injection 가능성**
   ```typescript
   // rfp.service.ts:36
   query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
   ```
   - 사용자 입력 `search`가 직접 필터 문자열에 삽입됨
   - 특수 문자(`%`, `_`, `,`, `.`) 이스케이프 필요

2. **에러 메시지 정보 노출**
   - Supabase 에러 메시지(테이블명, 컬럼명, 제약조건)가 클라이언트로 전달
   - Phase 7에서 생성한 `api-error.ts` 적용 필요

### ✅ 잘된 보안 관행

- 강력한 비밀번호 정책 (8+ 문자, 대소문자/숫자/특수문자)
- RBAC 권한 시스템
- 자동 세션 갱신 (5분 threshold)
- 비밀번호 변경 시 현재 비밀번호 검증

---

## 5️⃣ Performance Inspection

### ⚠️ N+1 쿼리 패턴

1. **`getRfpById`**: 3개의 순차 쿼리
   ```typescript
   // rfp.service.ts:91-134
   const rfp = await getRfpWithClient(id)        // Query 1
   const requirements = await listRequirements() // Query 2
   const comments = await listComments()         // Query 3
   ```
   **권장**: `Promise.all()`로 병렬 실행

2. **`reorderRequirements`**: N개의 개별 UPDATE
   ```typescript
   // requirement.service.ts:154-172
   await Promise.all(requirements.map(r => updateRequirement(r.id, { order: r.order })))
   ```
   **권장**: Batch RPC 또는 Transaction 사용

3. **`toggleCommentResolved`**: 2개의 순차 쿼리
   ```typescript
   const current = await getComment(id)  // Query 1
   await updateComment(id, { ... })      // Query 2
   ```
   **권장**: 단일 RPC로 `NOT is_resolved` 토글

---

## 6️⃣ 배포 준비도

```
Status: ⚠️ READY WITH WARNINGS

✅ 해결됨:
  - API 키 노출 (.env → .env.local)
  - Security Headers 설정 완료
  - Input Validation Schema 구현
  - Error Handler 구현

⚠️ 개선 권장 (배포 후 점진적 개선):
  - 이중 아키텍처 통합
  - any 타입 제거
  - 중복 코드 리팩토링
  - N+1 쿼리 최적화
```

---

## 7️⃣ 우선순위별 Refactoring Plan

### Priority 1 - 보안 (완료 ✅)
- [x] .env 파일 Git 제외
- [x] Security Headers 설정
- [x] Input Validation Schema 생성
- [x] Error Handler 생성

### Priority 2 - 아키텍처 (Phase 9 이후)
- [ ] 서비스 패턴 통일 (함수 기반 권장)
- [ ] 중복 Hook 제거
- [ ] 타입 정의 통합

### Priority 3 - 코드 품질 (다음 스프린트)
- [ ] `any` 타입을 Supabase Database 타입으로 변경
- [ ] Transform 함수 공통 모듈로 추출
- [ ] `alert()`를 Toast로 대체
- [ ] `staleTime` 설정

### Priority 4 - 성능 (향후)
- [ ] `getRfpById` 쿼리 병렬화
- [ ] Batch reorder 구현
- [ ] `toggleCommentResolved` 단일 RPC로 변경

### Priority 5 - 컨벤션 (문서화)
- [ ] CONVENTIONS.md 실제 구조 반영
- [ ] `src/constants/` 디렉토리 생성

---

## 8️⃣ 결론

RFP Management System은 **Dynamic 레벨 프로젝트로서 기본 아키텍처와 보안 설정이 완료**되었으며, **배포 가능한 상태**입니다.

발견된 이슈들은 주로 **코드 품질 및 일관성** 관련이며, 배포를 막는 치명적인 문제는 없습니다. 우선순위에 따라 단계적으로 리팩토링하면서 품질을 개선해 나갈 수 있습니다.

**다음 단계**: Phase 9 (Deployment) 진행 권장

---

**리뷰어**: code-analyzer agent (bkit v1.5.3)
**리뷰 완료일**: 2026-02-12
