/**
 * API Error Handler
 *
 * 안전한 에러 메시지 처리 (민감한 정보 노출 방지)
 */

// ============================================
// Error Codes
// ============================================

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // Rate Limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
}

// ============================================
// API Error Class
// ============================================

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /**
   * 클라이언트에게 전송할 안전한 에러 응답 생성
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        // details는 개발 환경에서만 포함
        ...(process.env.NODE_ENV === 'development' && this.details ? { details: this.details } : {}),
      },
    }
  }

  /**
   * Response 객체로 변환
   */
  toResponse() {
    return Response.json(this.toJSON(), { status: this.statusCode })
  }
}

// ============================================
// Error Factory Functions
// ============================================

export const apiErrors = {
  unauthorized: (message = '인증이 필요합니다') =>
    new ApiError(ErrorCode.UNAUTHORIZED, message, 401),

  forbidden: (message = '권한이 없습니다') => new ApiError(ErrorCode.FORBIDDEN, message, 403),

  notFound: (resource = '리소스', message?: string) =>
    new ApiError(ErrorCode.NOT_FOUND, message || `${resource}를 찾을 수 없습니다`, 404),

  validationError: (details?: unknown) =>
    new ApiError(ErrorCode.VALIDATION_ERROR, '입력 값이 올바르지 않습니다', 400, details),

  invalidInput: (message = '올바르지 않은 입력입니다') =>
    new ApiError(ErrorCode.INVALID_INPUT, message, 400),

  alreadyExists: (resource = '리소스', message?: string) =>
    new ApiError(ErrorCode.ALREADY_EXISTS, message || `${resource}가 이미 존재합니다`, 409),

  tooManyRequests: (message = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요') =>
    new ApiError(ErrorCode.TOO_MANY_REQUESTS, message, 429),

  internalError: (message = '서버 오류가 발생했습니다') =>
    new ApiError(ErrorCode.INTERNAL_ERROR, message, 500),

  databaseError: (message = '데이터베이스 오류가 발생했습니다') =>
    new ApiError(ErrorCode.DATABASE_ERROR, message, 500),

  externalServiceError: (service: string) =>
    new ApiError(ErrorCode.EXTERNAL_SERVICE_ERROR, `${service} 서비스 오류가 발생했습니다`, 502),
}

// ============================================
// Error Handler Middleware
// ============================================

/**
 * 에러를 안전한 ApiError로 변환
 */
export function handleError(error: unknown): ApiError {
  // 이미 ApiError인 경우
  if (error instanceof ApiError) {
    return error
  }

  // Validation Error (Zod)
  if (error && typeof error === 'object' && 'issues' in error) {
    return apiErrors.validationError(error)
  }

  // 일반 Error
  if (error instanceof Error) {
    // 민감한 정보를 로그에만 기록
    console.error('Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    // 클라이언트에는 일반적인 메시지만 전송
    return apiErrors.internalError()
  }

  // 알 수 없는 에러
  console.error('Unknown error:', error)
  return apiErrors.internalError()
}

// ============================================
// Try-Catch Wrapper
// ============================================

/**
 * API Route Handler를 감싸는 try-catch wrapper
 *
 * @example
 * ```ts
 * export const POST = withErrorHandler(async (req: Request) => {
 *   const body = await req.json()
 *   const result = CreateClientSchema.parse(body)
 *   // ...
 *   return Response.json({ data })
 * })
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      const apiError = handleError(error)
      return apiError.toResponse()
    }
  }) as T
}
