/**
 * Services Index
 *
 * 모든 서비스를 한 곳에서 export
 */

// Client Services (함수 기반)
export * as clientService from './client.service'
export * as rfpService from './rfp.service'
export * as requirementService from './requirement.service'
export * as commentService from './comment.service'
export * as fileService from './file.service'

// Legacy Services (클래스 기반)
export { BaseService } from './base.service'
export type { BaseServiceConfig, ListOptions, FilterOptions } from './base.service'
