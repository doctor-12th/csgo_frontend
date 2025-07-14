// 单个机器屏幕信息
export interface MachineScreen {
  machine_id: string
  video_url: string
  timestamp: number
}

// 请求参数类型，适配视频流接口
export interface VideoStreamRequestParams {
  machine_id: string[] // 对应后端接收的 machine_id 参数列表
}

// 响应数据类型，由于返回的是事件流，这里简单表示每个帧的数据类型
export interface VideoStreamFrame {
  frameData: string // 假设帧数据是字符串形式，比如 Base64
  machine_id: string // Add the machine_id property
}

// 请求参数类型
export interface MonitorRequestParams {
  machine_id: string[]
}

// 响应数据类型
export interface MonitorResponse {
  code: number
  msg: string
  data: {
    screens: MachineScreen[]
    count: number
  }
}

// 单个机器状态信息
export interface MachineStatus {
  machine_id: string
  active: boolean
}

// 检查机器列表的响应类型
export type MachineListResponse = ApiResponseData<MachineStatus[]>





