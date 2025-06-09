import { request } from '@/http/axios'
import type { MonitorRequestParams, MonitorResponse } from './types'
import type { MachineListResponse } from './types'

/**
 * 获取机器监控视频流
 * @param params 请求参数，包含machine_id数组
 * @returns 包含视频流信息的响应数据
 */
export const getMachineScreens = (params: MonitorRequestParams) => {
  return request<MonitorResponse>({
    url: '/monitor',
    method: 'GET',
    params,
    paramsSerializer: {
      indexes: null // 保持数组格式为machine_id=1&machine_id=2
    }
  })
}

/**
 * 获取单个机器的监控视频流
 * @param machineId 机器ID
 * @returns 包含视频流信息的响应数据
 */
export const getSingleMachineScreen = (machineId: string) => {
  return request<MonitorResponse>({
    url: '/monitor',
    method: 'GET',
    params: {
      machine_id: [machineId] // 包装成数组形式
    }
  })
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

/**
 * 检查单个机器状态
 * @param machineId 要检查的机器ID
 * @returns 包含机器状态的响应数据
 */
export const checkMachineStatus = (machineId: string) => {
  return request<MachineListResponse>({
    url: '/check_machine',
    method: 'GET',
    params: { machine_id: machineId }
  })
}
