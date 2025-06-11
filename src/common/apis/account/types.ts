// 本周任务完成度
export interface WeeklyCompletion {
  completion_rate: number
  completed_count: number
  total_count: number
}

// 责任人完成度信息
export interface OwnerCompletion {
  owner: string
  total: number
  completed: number
  completion_rate: number
}

// 异常账号信息
export interface AbnormalAccount {
  accid: string
  username: string
  state: string
}

// API响应类型
export type WeeklyCompletionResponse = ApiResponseData<WeeklyCompletion>
export type OwnerCompletionListResponse = ApiResponseData<OwnerCompletion[]>

// 分页响应数据结构
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

// 更新异常账号响应类型
export type AbnormalAccountsResponse = ApiResponseData<PaginatedResponse<AbnormalAccount>>