import { request } from '@/http/axios'
import type {  VideoStreamRequestParams, VideoStreamFrame } from './types'
import type { MachineListResponse } from './types'

/**
 * 获取机器监控视频流
 * @param params 请求参数，包含machine_id数组
 * @returns 一个异步生成器，用于逐个生成视频流帧
 */
export const getMachineScreens = async function* (params: VideoStreamRequestParams) {
  const queryParams = new URLSearchParams()
  params.machine_id.forEach(id => queryParams.append('machine_id', id))
  const response = await fetch(`http://127.0.0.1:6677/monitor/monitor?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream'
    }
  })

  if (!response.ok) {
    throw new Error(`请求失败，状态码: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  if (!reader) return

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      // 假设响应数据格式为 "data: {"machine_id": "xxx", "frameData": "xxx"}\n\n"
      const eventRegex = /data: ({.*})\n\n/g
      let match
      while ((match = eventRegex.exec(buffer)) !== null) {
        try {
          const eventData = JSON.parse(match[1]);
          const frame: VideoStreamFrame = {
            frameData: eventData.frameData,
            machine_id: eventData.machine_id
          };
          yield frame;
        } catch (parseError) {
          console.error('解析事件数据出错:', parseError);
        }
        buffer = buffer.slice(eventRegex.lastIndex);
      }
    }
  } finally {
    reader.releaseLock();
  }
}


/**
 * 检查当前机器列表状态
 * @returns 包含机器状态列表的响应数据
 */
export const checkMachineList = () => {
  return request<MachineListResponse>({
    url: 'monitor/check_machine',
    method: 'GET'
  })
}


