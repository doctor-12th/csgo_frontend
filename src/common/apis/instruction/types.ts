// 发送指令的请求参数
export interface SendInstructionRequest {
    machine_id: string  // 改为单个字符串
    command: string   // 改为单个字符串
    parameters?: string // 可选参数改为单个字符串
}

// 服务器响应数据
export interface InstructionResponse {
  success: boolean
  response: string
}

// API响应类型
export type SendInstructionResponse = ApiResponseData<InstructionResponse>