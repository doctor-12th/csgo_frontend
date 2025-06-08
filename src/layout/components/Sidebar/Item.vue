<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";
import { useRouter } from 'vue-router';

interface Props {
    item: RouteRecordRaw;
    basePath?: string;
}

const props = withDefaults(defineProps<Props>(), {
    basePath: "",
});

const router = useRouter();
const isActive = computed(() => router.currentRoute.value.path === props.basePath + props.item.path);
</script>

<template>
  <el-menu-item 
    :index="basePath + item.path"
    :class="{ 'is-active': isActive }"
  >
    <span class="sidebar-item-icon" v-if="item.meta?.icon">
      <component :is="item.meta.icon" />
    </span>
    <span class="sidebar-item-title">
      {{ item.meta?.title || item.name }}
    </span>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.sidebar-item-icon {
  margin-right: 8px;
}

.sidebar-item-title {
  font-size: 14px;
}
</style>
