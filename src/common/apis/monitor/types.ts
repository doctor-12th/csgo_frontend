// 单个机器屏幕信息
export interface MachineScreen {
  machine_id: string
  video_url: string
  timestamp: number
}

// 请求参数类型
export interface MonitorRequestParams {
  machine_id: string[]
}

// 响应数据类型
export interface MonitorResponse {
  code: number
  msg: string
  data: {screens: MachineScreen[]
    count: number
}
}

// 单个机器状态信息
export interface MachineStatus {
  machine_id: string
  is_active: boolean
}

// 检查机器列表的响应类型
export type MachineListResponse = ApiResponseData<MachineStatus[]>





