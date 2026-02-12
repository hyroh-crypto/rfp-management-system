# Phase 1: Schema & Terminology - 완료

> 제안요청서 관리 시스템의 용어 및 스키마 정의

## 📋 Phase 1 개요

**목표**: 프로젝트에서 사용할 언어를 통일하고 데이터 구조를 명확히 정의

**완료일**: 2026-02-11

## 📁 산출물

| 문서 | 설명 | 상태 |
|------|------|------|
| [glossary.md](./glossary.md) | 용어집 (비즈니스 용어 ↔ 글로벌 표준 매핑) | ✅ 완료 |
| [schema.md](./schema.md) | 데이터 스키마 및 엔티티 관계 정의 | ✅ 완료 |
| [domain-model.md](./domain-model.md) | 도메인 모델 및 비즈니스 프로세스 | ✅ 완료 |

## 🎯 핵심 엔티티 (Core Entities)

이 시스템에서 다루는 8개의 핵심 엔티티:

1. **Client** - 고객사
2. **RFP** - 제안요청서
3. **Requirement** - 요구사항
4. **Proposal** - 제안서
5. **ProposalSection** - 제안서 섹션
6. **UIPrototype** - UI 프로토타입
7. **User** - 사용자
8. **Comment** - 코멘트

## 🔄 핵심 관계

```
Client --1:N--> RFP --1:1--> Proposal
                 |              |
                 |              +--1:N--> ProposalSection
                 |              +--1:N--> UIPrototype
                 |              +--1:N--> Comment
                 |
                 +--1:N--> Requirement
```

## 📊 비즈니스 프로세스

```
접수 → 분석 → 작성 → 검토 → 승인 → 제출 → 결과
```

## 🤖 AI 자동화 포인트

1. **RFP 분석**: AI가 자동으로 요약, 요구사항 추출, 위험도 평가
2. **제안서 생성**: 섹션별 자동 콘텐츠 생성
3. **UI 프로토타입**: 요구사항 기반 화면 자동 설계
4. **일정/견적**: 복잡도 기반 자동 산출

## ✅ Phase 1 체크리스트

- [x] 비즈니스 용어 정의
- [x] 글로벌 표준 매핑
- [x] 엔티티 식별 (8개)
- [x] 엔티티 간 관계 정의
- [x] 상세 스키마 설계
- [x] 비즈니스 프로세스 정의
- [x] 권한 매트릭스 정의
- [x] AI 자동화 포인트 식별

## 🎯 다음 단계: Phase 2

Phase 1이 완료되었습니다!

**다음**: [Phase 2 - Coding Convention](../02-design/README.md)

Phase 2에서는:
- 코드 작성 규칙 정의
- 네이밍 컨벤션
- 파일/폴더 구조
- Git 브랜치 전략
- 코드 리뷰 가이드

등을 정의합니다.

## 📚 참고 문서

- [bkit Development Pipeline](../../.claude/docs/development-pipeline.md)
- [PDCA Methodology](../../.claude/docs/pdca-methodology.md)

---

**프로젝트**: 제안요청서 관리 시스템
**Phase**: 1 - Schema & Terminology
**버전**: 1.0.0
**작성일**: 2026-02-11
