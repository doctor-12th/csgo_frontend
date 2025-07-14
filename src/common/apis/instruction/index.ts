
import { request } from '@/http/axios'
import type {
  SendInstructionRequest,
  SendInstructionResponse
} from './types'

/**
 * 发送指令到CSGO服务器
 * @param data 指令请求参数
 * @returns 服务器响应
 */
export const sendInstruction = (data: SendInstructionRequest) => {
    const formData = new FormData()
    formData.append('machine_id', data.machine_id)
    formData.append('command', data.command)
  
    return request<SendInstructionResponse>({
      url: '/instruction/send_instruction',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
