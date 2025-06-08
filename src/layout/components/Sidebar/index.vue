<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Item from './Item.vue';

const router = useRouter();
const routes = ref(router.getRoutes().filter(route => !route.meta?.hidden));
const activeMenu = ref(router.currentRoute.value.path);
</script>

<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-container"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    router
    unique-opened
  >
    <Item
      v-for="route in routes"
      :key="route.path"
      :item="route"
    />
  </el-menu>
</template>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  width: 210px;
  border-right: none;
  
  :deep(.el-menu-item) {
    &:hover {
      background-color: #263445 !important;
    }
    
    &.is-active {
      background-color: #001528 !important;
    }
  }
}
</style>
