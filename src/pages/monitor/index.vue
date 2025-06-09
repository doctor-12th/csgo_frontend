<script setup lang="ts">
import { 
  getWeeklyCompletion,
  getOwnerCompletion,
  downloadCompletedAccounts,
  getAbnormalAccounts
} from '@/common/apis/account'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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

const downloadFile = async () => {
  loading.value = true
  try {
    const res = await downloadCompletedAccounts('Alice')
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'completed_accounts.txt')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('文件下载成功')
  } catch (error) {
    ElMessage.error('文件下载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <el-button type="primary" :loading="loading" @click="testApi(getWeeklyCompletion, '本周任务完成度')">
      测试本周任务完成度
    </el-button>
    
    <el-button type="primary" :loading="loading" @click="testApi(getOwnerCompletion, '责任人完成度')" style="margin-left: 10px">
      测试责任人完成度
    </el-button>
    
    <el-button type="primary" :loading="loading" @click="testApi(getAbnormalAccounts, '异常账号')" style="margin-left: 10px">
      测试异常账号
    </el-button>
    
    <el-button type="primary" :loading="loading" @click="downloadFile" style="margin-left: 10px">
      测试下载文件
    </el-button>
    
    <div v-if="apiData" style="margin-top: 20px">
      <h3>API返回数据：</h3>
      <pre>{{ apiData }}</pre>
    </div>
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
