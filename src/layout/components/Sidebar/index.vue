<script lang="ts" setup>

import { getCssVar } from "@/common/utils/css"
import { usePermissionStore } from "@/pinia/stores/permission"

import Item from "./Item.vue"

const v3SidebarMenuBgColor = getCssVar("--v3-sidebar-menu-bg-color")
const v3SidebarMenuTextColor = getCssVar("--v3-sidebar-menu-text-color")
const v3SidebarMenuActiveTextColor = getCssVar("--v3-sidebar-menu-active-text-color")


const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => route.meta.activeMenu || route.path)
// 获取所有的路由

const noHiddenRoutes = computed(() => {
  return permissionStore.routes.filter(route => !route.meta?.hidden)
})

const backgroundColor = computed(() => (v3SidebarMenuBgColor))
const textColor = computed(() => (v3SidebarMenuTextColor))
const activeTextColor = computed(() => (v3SidebarMenuActiveTextColor))
const sidebarMenuItemHeight = computed(() => "var(--v3-sidebar-menu-item-height)")
const sidebarMenuHoverBgColor = computed(() => "var(--v3-sidebar-menu-hover-bg-color)")
const tipLineWidth = computed(() => "2px")
</script>

<template>
  <div>
   
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        
        :background-color="backgroundColor"
        :text-color="textColor"
        :active-text-color="activeTextColor"
        :collapse-transition="false"
        :mode="'vertical'"
      >
        <Item
          v-for="noHiddenRoute in noHiddenRoutes"
          :key="noHiddenRoute.path"
          :item="noHiddenRoute"
          :base-path="noHiddenRoute.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
%tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - var(--v3-header-height));
  }
}

.el-scrollbar {
  height: 100%;
  :deep(.scrollbar-wrapper) {
    // 限制水平宽度
    overflow-x: hidden;
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
  }
}

.el-menu {
  user-select: none;
  border: none;
  width: 100%;
}

.el-menu--horizontal {
  height: v-bind(sidebarMenuItemHeight);
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
  height: v-bind(sidebarMenuItemHeight);
  line-height: v-bind(sidebarMenuItemHeight);
  &.is-active,
  &:hover {
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}

:deep(.el-sub-menu) {
  &.is-active {
    > .el-sub-menu__title {
      color: v-bind(activeTextColor);
    }
  }
}

:deep(.el-menu-item.is-active) {
  @extend %tip-line;
}

.el-menu--collapse {
  :deep(.el-sub-menu.is-active) {
    .el-sub-menu__title {
      @extend %tip-line;
      background-color: v-bind(sidebarMenuHoverBgColor);
    }
  }
}
</style>
