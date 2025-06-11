<script setup lang="ts">
import { getAbnormalAccounts } from '@/common/apis/account'
const abnormalAccounts = ref<any[]>([])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
// 获取异常账号数据(带分页)
const fetchAbnormalAccounts = async () => {
  try {
    loading.value = true
    const res = await getAbnormalAccounts(currentPage.value, pageSize.value)
    abnormalAccounts.value = res.data.data
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取异常账号失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAbnormalAccounts()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchAbnormalAccounts()
}
onMounted(() => {
  fetchAbnormalAccounts()
})
</script>

<template>
  <div class="data-manager-container">
    <el-card style="margin-bottom: 20px">
      <template #header>
        <span>异常账号列表</span>
        <el-button 
          type="primary" 
          @click="fetchAbnormalAccounts"
          :loading="loading"
          style="float: right;"
        >
          刷新
        </el-button>
      </template>
      
      <el-table :data="abnormalAccounts" border style="width: 100%">
        <el-table-column prop="accid" label="账号ID" min-width="120" />
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column prop="state" label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.state === '正常' ? 'success' : 'danger'">
              {{ row.state }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    
      <!-- 添加分页组件 -->
      <!-- Replace the existing el-pagination with this updated version -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @update:current-page="fetchAbnormalAccounts"
        @update:page-size="fetchAbnormalAccounts"
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<style>

</style>
