<script setup lang="ts">
import { getVideoStream } from '@/http/eventSourse'



import { sendInstruction } from '@/common/apis/instruction'
import { checkMachineList } from '@/common/apis/monitor'

const loading = ref(false)
const apiData = ref<any>(null)

const testApi = async (apiFunc: Function, apiName: string) => {
  loading.value = true
  try {
    const res = await apiFunc()
    apiData.value = res.data
    ElMessage.success(`${apiName} API调用成功`)
    console.log(`${apiName} 数据:`, res.data)
  } catch (error) {
    ElMessage.error(`${apiName} API调用失败`)
    console.error(error)
  } finally {
    loading.value = false
  }
}



const testSendInstruction = async () => {
  loading.value = true
  try {
    const res = await sendInstruction({
      machine_id: 'MID-0N6TFR28', // 测试用机器ID
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

const testMachineList = async () => {
  loading.value = true
  try {
    const res = await checkMachineList()
    apiData.value = res.data
    ElMessage.success('机器列表获取成功')
    console.log('机器列表:', res.data)
  } catch (error) {
    ElMessage.error('机器列表获取失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <el-button 
      type="primary" 
      :loading="loading" 
      @click="testSendInstruction"
      style="margin-left: 10px">
      测试发送指令
    </el-button>
    <el-button 
      type="primary" 
      :loading="loading" 
      @click="testVideoStream"
      style="margin-left: 10px">
      测试视频流
    </el-button>
    
    <el-button 
      type="primary" 
      :loading="loading" 
      @click="testMachineList"
      style="margin-left: 10px"
    >
      测试机器列表
    </el-button>
    
    <div v-if="apiData" style="margin-top: 20px">
      <h3>API返回数据：</h3>
      <pre>{{ apiData }}</pre>
    </div>
    
    <!-- 修改视频帧显示部分 -->
    <div v-if="videoFrame" style="margin-top: 20px">
      <h3>视频帧：</h3>
      <img 
        :src="videoFrame" 
        style="max-width: 200px; cursor: pointer" 
        alt="视频帧"
        @click="showFullFrame(videoFrame)"
      >
    </div>

    <!-- 添加全屏显示弹窗 -->
    <el-dialog v-model="showLargeFrame" title="视频帧详情" width="80%">
      <img :src="currentFrame" style="width: 100%" alt="放大视频帧">
    </el-dialog>
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
