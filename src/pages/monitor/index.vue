<script setup lang="ts">
import { getVideoStream } from '@/http/eventSourse'
import type { MachineStatus } from '@/common/apis/monitor/types'


import { sendInstruction } from '@/common/apis/instruction'
import { checkMachineList } from '@/common/apis/monitor'

const loading = ref(false)
const apiData = ref<any>(null)

const machineList = ref<MachineStatus[]>([])
const defaultImage = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4=')

const startMachineStreams = async () => {
  machineList.value.forEach(machine => {
    // console.log('检查机器:', machine.machine_id)
    // console.log(machine["is_active"])
    // console.log(videoStreams.value[machine.machine_id])
    if (machine["is_active"] && !videoStreams.value[machine.machine_id]) {
      console.log('启动视频流:', machine.machine_id)
      testSendInstruction(machine.machine_id)
      
      videoStreams.value[machine.machine_id] = getVideoStream(machine.machine_id)
      
      videoStreams.value[machine.machine_id].onFrame((frameData: string) => {
        // console.log('收到视频帧:', frameData)
        videoFrames.value[machine.machine_id] = `data:image/jpeg;base64,${frameData}`
      })
      
      videoStreams.value[machine.machine_id].onError((error: string) => {
        ElMessage.error(`${machine.machine_id} 视频流错误: ${error}`)
        videoFrames.value[machine.machine_id] = defaultImage.value
      })
    } else if (!machine["is_active"]) {
      videoFrames.value[machine.machine_id] = defaultImage.value
    }
  })
}
const testSendInstruction = async (machine_id:string) => {
  loading.value = true
  try {
    const res = await sendInstruction({
      machine_id: machine_id, // 测试用机器ID
      command: 'start', // 测试指令
      // parameters: ['-verbose'] // 可选参数
    })
    apiData.value = res.data
    ElMessage.success('指令发送成功')
    console.log('指令响应:', res.data)
  } catch (error) {
    ElMessage.error('指令发送失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const videoStreamRef = ref<any>(null)
const videoFrame = ref<string>('')

const testVideoStream = () => {
  loading.value = true
  videoStreamRef.value = getVideoStream('machine123') // 测试用机器ID
  // console.log('视频流对象:', videoStreamRef.value)
  videoStreamRef.value.onFrame((frameData: string) => {
    console.log('收到视频帧:', frameData)
    // console.log('Base64帧数据长度:', frameData.length) 
    videoFrame.value = `data:image/jpeg;base64,${frameData}`
    loading.value = false
  })
  
  videoStreamRef.value.onError((error: string) => {
    ElMessage.error(`视频流错误: ${error}`)
    loading.value = false
  })
}
onMounted(() => {
  getMachineList()
})
// 组件卸载时关闭视频流
onUnmounted(() => {
  if (videoStreamRef.value) {
    videoStreamRef.value.close()
  }
})

const showLargeFrame = ref(false)
const currentFrame = ref('')

const showFullFrame = (frame: string) => {
  currentFrame.value = frame
  showLargeFrame.value = true
}

const videoStreams = ref<Record<string, any>>({})
const videoFrames = ref<Record<string, string>>({})



// 在获取机器列表后启动视频流
const getMachineList = async () => {
  loading.value = true
  try {
    const res = await checkMachineList()
    console.log('机器列表:', res.data)
    machineList.value = res.data
    console.log('机器列表:', machineList.value)
    await startMachineStreams() // 新增
    ElMessage.success('机器列表获取成功')
  } catch (error) {
    ElMessage.error('机器列表获取失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 组件卸载时关闭所有视频流
onUnmounted(() => {
  Object.values(videoStreams.value).forEach(stream => {
    stream.close()
  })
})
</script>

<template>
  <div>
    <!-- 
    <el-button 
      type="primary" 
      :loading="loading" 
      @click="testVideoStream"
      style="margin-left: 10px">
      测试视频流
    </el-button>
    
    
    
    <div v-if="apiData" style="margin-top: 20px">
      <h3>API返回数据：</h3>
      <pre>{{ apiData }}</pre>
    </div>
    

    <div v-if="videoFrame" style="margin-top: 20px">
      <h3>视频帧：</h3>
      <img 
        :src="videoFrame" 
        style="max-width: 200px; cursor: pointer" 
        alt="视频帧"
        @click="showFullFrame(videoFrame)"
      >
    </div>

    
    <el-dialog v-model="showLargeFrame" title="视频帧详情" width="80%">
      <img :src="currentFrame" style="width: 100%" alt="放大视频帧">
    </el-dialog> -->
    <el-button 
      type="primary" 
      :loading="loading" 
      @click="testSendInstruction()"
      style="margin-left: 10px">
      测试发送指令
    </el-button>
    
    <!-- 为每个机器添加视频帧显示 -->

    <div v-for="machine in machineList" :key="machine.machine_id" style="margin-top: 20px">
      <h3>{{ machine.machine_id }} 视频帧：</h3>
      <img 
        v-if="videoFrames[machine.machine_id]"
        :src="videoFrames[machine.machine_id]"
        style="max-width: 200px; cursor: pointer"
        :alt="`${machine.machine_id}视频帧`"
        @click="showFullFrame(videoFrames[machine.machine_id])"
      >
      <div v-else>加载中...</div>
    </div>

    <!-- 原有全屏弹窗保持不变 -->
  </div>
</template>

<style>
pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
