class VideoStreamClient {
  private eventSource: EventSource | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private machineId: string
  private url: string

  constructor(machineId: string) {
    this.machineId = machineId
    this.url = `http://127.0.0.1:6677/monitor/monitor?machine_id=${machineId}`
    this.connect()
  }

  private connect() {
    this.eventSource = new EventSource(this.url)

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0
    }

    this.eventSource.onerror = () => {
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        this.handleReconnect()
      }
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.reconnectDelay)
    }
  }

  onFrame(callback: (frameData: string) => void) {
    this.eventSource?.addEventListener('message', (event) => {
      callback(event.data)
    })
  }

  onError(callback: (error: string) => void) {
    this.eventSource?.addEventListener('error', () => {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        callback('视频流连接失败，已达最大重试次数')
      } else {
        callback('视频流连接错误，正在尝试重连...')
      }
    })
  }

  close() {
    this.eventSource?.close()
    this.eventSource = null
  }
}

export function getVideoStream(machineId: string) {
  return new VideoStreamClient(machineId)
}
