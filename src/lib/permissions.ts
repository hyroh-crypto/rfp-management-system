/**
 * Permission Definitions
 *
 * 역할 기반 접근 제어 (RBAC) 권한 정의
 */

// ============================================
// Permission Enum
// ============================================

/**
 * 시스템 권한 목록
 */
export enum Permission {
  // RFP 권한
  VIEW_RFPS = 'view_rfps',
  CREATE_RFP = 'create_rfp',
  EDIT_RFP = 'edit_rfp',
  DELETE_RFP = 'delete_rfp',
  ANALYZE_RFP = 'analyze_rfp',

  // Proposal 권한
  VIEW_PROPOSALS = 'view_proposals',
  CREATE_PROPOSAL = 'create_proposal',
  EDIT_PROPOSAL = 'edit_proposal',
  DELETE_PROPOSAL = 'delete_proposal',
  SUBMIT_PROPOSAL = 'submit_proposal',
  APPROVE_PROPOSAL = 'approve_proposal',

  // Client 권한
  VIEW_CLIENTS = 'view_clients',
  CREATE_CLIENT = 'create_client',
  EDIT_CLIENT = 'edit_client',
  DELETE_CLIENT = 'delete_client',

  // Prototype 권한
  VIEW_PROTOTYPES = 'view_prototypes',
  CREATE_PROTOTYPE = 'create_prototype',
  EDIT_PROTOTYPE = 'edit_prototype',
  DELETE_PROTOTYPE = 'delete_prototype',

  // User 권한
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  CHANGE_USER_ROLE = 'change_user_role',
}

// ============================================
// Role Permissions Matrix
// ============================================

/**
 * 역할별 권한 매트릭스
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  /**
   * Admin - 모든 권한
   */
  admin: Object.values(Permission),

  /**
   * Manager - RFP, Proposal, Client 관리
   */
  manager: [
    // RFP
    Permission.VIEW_RFPS,
    Permission.CREATE_RFP,
    Permission.EDIT_RFP,
    Permission.DELETE_RFP,
    Permission.ANALYZE_RFP,
    // Proposal
    Permission.VIEW_PROPOSALS,
    Permission.CREATE_PROPOSAL,
    Permission.EDIT_PROPOSAL,
    Permission.DELETE_PROPOSAL,
    Permission.SUBMIT_PROPOSAL,
    Permission.APPROVE_PROPOSAL,
    // Client
    Permission.VIEW_CLIENTS,
    Permission.CREATE_CLIENT,
    Permission.EDIT_CLIENT,
    // Prototype
    Permission.VIEW_PROTOTYPES,
    Permission.CREATE_PROTOTYPE,
    Permission.EDIT_PROTOTYPE,
    // User
    Permission.VIEW_USERS,
  ],

  /**
   * Writer - 제안서 작성
   */
  writer: [
    Permission.VIEW_RFPS,
    Permission.VIEW_PROPOSALS,
    Permission.CREATE_PROPOSAL,
    Permission.EDIT_PROPOSAL,
    Permission.VIEW_CLIENTS,
    Permission.VIEW_PROTOTYPES,
    Permission.CREATE_PROTOTYPE,
    Permission.EDIT_PROTOTYPE,
  ],

  /**
   * Reviewer - 제안서 검토 및 승인
   */
  reviewer: [
    Permission.VIEW_RFPS,
    Permission.VIEW_PROPOSALS,
    Permission.APPROVE_PROPOSAL,
    Permission.VIEW_CLIENTS,
    Permission.VIEW_PROTOTYPES,
  ],
}

// ============================================
// Permission Check Functions
// ============================================

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * 사용자가 여러 권한 중 하나라도 가지고 있는지 확인
 */
export function hasAnyPermission(
  userRole: string,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

/**
 * 사용자가 모든 권한을 가지고 있는지 확인
 */
export function hasAllPermissions(
  userRole: string,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

/**
 * 역할별 권한 목록 조회
 */
export function getRolePermissions(userRole: string): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

// ============================================
// Permission Labels (Korean)
// ============================================

/**
 * 권한 라벨 (한글)
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.VIEW_RFPS]: 'RFP 조회',
  [Permission.CREATE_RFP]: 'RFP 생성',
  [Permission.EDIT_RFP]: 'RFP 수정',
  [Permission.DELETE_RFP]: 'RFP 삭제',
  [Permission.ANALYZE_RFP]: 'RFP 분석',

  [Permission.VIEW_PROPOSALS]: '제안서 조회',
  [Permission.CREATE_PROPOSAL]: '제안서 생성',
  [Permission.EDIT_PROPOSAL]: '제안서 수정',
  [Permission.DELETE_PROPOSAL]: '제안서 삭제',
  [Permission.SUBMIT_PROPOSAL]: '제안서 제출',
  [Permission.APPROVE_PROPOSAL]: '제안서 승인',

  [Permission.VIEW_CLIENTS]: '고객사 조회',
  [Permission.CREATE_CLIENT]: '고객사 생성',
  [Permission.EDIT_CLIENT]: '고객사 수정',
  [Permission.DELETE_CLIENT]: '고객사 삭제',

  [Permission.VIEW_PROTOTYPES]: '프로토타입 조회',
  [Permission.CREATE_PROTOTYPE]: '프로토타입 생성',
  [Permission.EDIT_PROTOTYPE]: '프로토타입 수정',
  [Permission.DELETE_PROTOTYPE]: '프로토타입 삭제',

  [Permission.VIEW_USERS]: '사용자 조회',
  [Permission.CREATE_USER]: '사용자 생성',
  [Permission.EDIT_USER]: '사용자 수정',
  [Permission.DELETE_USER]: '사용자 삭제',
  [Permission.CHANGE_USER_ROLE]: '사용자 역할 변경',
}

// ============================================
// Role Labels (Korean)
// ============================================

/**
 * 역할 라벨 (한글)
 */
export const ROLE_LABELS: Record<string, string> = {
  admin: '관리자',
  manager: '매니저',
  writer: '작성자',
  reviewer: '검토자',
}
