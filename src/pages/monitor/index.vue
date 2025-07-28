<template>
  <div class="monitor-container">
    <el-button type="primary" @click="fetchVideoFrames">测试获取机器监控视频流</el-button>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(status, index) in machineStatuses" :key="index">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ status.machine_id }}</span>
              <el-tag :type="status.active ? 'success' : 'danger'">
                {{ status.active ? '激活' : '未激活' }}
              </el-tag>
            </div>
          </template>
          <!-- 添加指令选择器 -->
          <el-select v-model="selectedCommand" placeholder="选择指令" :disabled="!status.active">
            <el-option label="开启监控" value="send_monitor" />
            <el-option label="关闭监控" value="stop_monitor" />
            <el-option label="终止打号" value="end" />
            <el-option label="重启打号" value="restart" />
            <el-option label="下播" value="shutdown" />
          </el-select>
          <!-- 添加发送指令按钮 -->
          <el-button type="info" @click="sendCommand({ machine_id: status.machine_id, command: selectedCommand})" :disabled="!status.active || !selectedCommand">
            发送指令
          </el-button>
          <div v-if="status.active">
            <img v-if="currentFrames[index]" :src="currentFrames[index]" alt="监控视频帧" />
            <div v-else class="black-screen">加载中...</div>
          </div>
          <div v-else class="black-screen"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { getMachineScreens, checkMachineList } from '@/common/apis/monitor/index';
import type { VideoStreamRequestParams } from '@/common/apis/monitor/types';
import type { MachineStatus } from '@/common/apis/monitor/types';
import { sendInstruction } from '@/common/apis/instruction/index'
import type { SendInstructionRequest, SendInstructionResponse } from '@/common/apis/instruction/types';
// 存储每个机器选择的指令
const selectedCommand = ref<string>('');
// 存储机器状态列表
const machineStatuses = ref<MachineStatus[]>([]);
// 存储每个机器的当前视频帧的 Base64 数据
const currentFrames = ref<(string | null)[]>([]);
// 存储每个机器的空帧计时器
const emptyFrameTimers = ref<Record<string, NodeJS.Timeout | null>>({});
// 定义空帧超时时间（毫秒）
const EMPTY_FRAME_TIMEOUT = 5000;

// 发送指令到CSGO服务器
const sendCommand = async (data: SendInstructionRequest) => {
  try {
    console.log(data)
    const res = await sendInstruction(data);
    console.log('指令发送成功', res.data);
  } catch (error) {
    console.error('指令发送失败', error);
  }
};

const getMachineStatuses = async () => {
  try {
    const res = await checkMachineList();
    machineStatuses.value = res.data;
  } catch (error) {
    console.error('获取机器状态列表失败:', error);
  }
};

// 点击按钮触发的方法
const fetchVideoFrames = async () => {
  try {
    const activeMachineIds = machineStatuses.value
      .filter(item => item.active)
      .map(item => item.machine_id);

    // 初始化 currentFrames
    currentFrames.value = machineStatuses.value.map(() => null);

    const params: VideoStreamRequestParams = {
      machine_id: activeMachineIds
    };

    // 调用异步生成器获取视频流帧
    for await (const frame of getMachineScreens(params)) {
      const index = machineStatuses.value.findIndex(
        item => item.machine_id === frame.machine_id
      );
      if (index !== -1) {
        // 检查 frameData 是否存在，不存在则用上一帧数据
        if (frame.frameData) {
          // 清除空帧计时器
          if (emptyFrameTimers.value[frame.machine_id]) {
            clearTimeout(emptyFrameTimers.value[frame.machine_id]!);
            emptyFrameTimers.value[frame.machine_id] = null;
          }
          currentFrames.value[index] = `data:image/jpeg;base64,${frame.frameData}`;
        } else {
          if (!emptyFrameTimers.value[frame.machine_id]) {
            // 开始计时
            emptyFrameTimers.value[frame.machine_id] = setTimeout(() => {
              currentFrames.value[index] = null;
              emptyFrameTimers.value[frame.machine_id] = null;
            }, EMPTY_FRAME_TIMEOUT);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('请求出错:', error);
    }
  }
};

onMounted(async () => {
  // 检查机器状态
  await getMachineStatuses();
  // 获取激活的机器监控视频流
  await fetchVideoFrames();
});
</script>

<style scoped>
.monitor-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.black-screen {
  width: 100%;
  height: 200px;
  background-color: black;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
