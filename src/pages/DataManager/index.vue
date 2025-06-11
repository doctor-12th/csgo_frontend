<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  getOwnerCompletion,
  downloadCompletedAccounts
} from '@/common/apis/account'
import { getWeeklyCompletion } from '@/common/apis/account'


interface OwnerData {
  owner: string
  total: number
  completed: number
  completion_rate: number
}

const loading = ref(false)
const tableData = ref<OwnerData[]>([])
const downloadLoading = ref(false)

// 获取责任人数据
const fetchOwnerData = async () => {
  try {
    loading.value = true
    const res = await getOwnerCompletion()
    console.log("manage",res.data)
    tableData.value = res.data
  } catch (error) {
    ElMessage.error('获取责任人数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}


// 下载责任人数据
const handleDownload = async (owner: string) => {
  try {
    downloadLoading.value = true
    const res = await downloadCompletedAccounts(owner)
    const url = window.URL.createObjectURL(new Blob([res as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${owner}_completed_accounts.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
    console.error(error)
  } finally {
    downloadLoading.value = false
  }
}

const weeklyData = ref({
  completion_rate: 0,
  completed_count: 0,
  total_count: 0
})

// 获取本周完成度数据
const fetchWeeklyData = async () => {
  try {
    const res = await getWeeklyCompletion()
    weeklyData.value = res.data
  } catch (error) {
    ElMessage.error('获取本周完成度失败')
    console.error(error)
  }
}

// 初始化加载数据
onMounted(() => {
  fetchOwnerData()
  fetchWeeklyData() // 新增
  
})
</script>

<template>
  <div class="data-manager-container">
    <!-- 新增本周完成度卡片 -->
    <el-card style="margin-bottom: 20px">
      <template #header>
        <span>本周任务完成度</span>
      </template>
      <div style="text-align: center">
        <el-progress
          type="dashboard"
          :percentage="weeklyData.completion_rate"
          :color="weeklyData.completion_rate >= 90 ? '#67C23A' : '#E6A23C'"
          :width="120"
        />
        <div style="margin-top: 10px">
          <span>已完成: {{ weeklyData.completed_count }}/{{ weeklyData.total_count }}</span>
        </div>
      </div>
    </el-card>
    
    <el-card>
      <template #header>
        <span>责任人数据管理</span>
        <el-button 
          type="primary" 
          @click="fetchOwnerData"
          :loading="loading"
          style="float: right;"
        >
          刷新数据
        </el-button>
      </template>

      <el-table 
        :data="tableData" 
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="owner" label="责任人" min-width="180" />
        <el-table-column prop="total" label="总账号数" min-width="120" />
        <el-table-column prop="completed" label="已完成数" min-width="120" />
        <el-table-column label="完成率" min-width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.completion_rate" 
              :status="row.completion_rate >= 90 ? 'success' : 'warning'"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" align="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="handleDownload(row.owner)"
              :loading="downloadLoading"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.data-manager-container {
  padding: 20px;
}
</style>
