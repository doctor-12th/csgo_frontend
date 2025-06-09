<script lang="ts" setup>
import type { RouteRecordRaw } from "vue-router"
// import { isExternal } from "@@/utils/validate"
import path from "path-browserify"
import Link from "./Link.vue"

interface Props {
  item: RouteRecordRaw
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ""
})

/** 是否始终显示根菜单 */
// const alwaysShowRootMenu = computed(() => props.item.meta?.alwaysShow)

/** 显示的子菜单 */
const showingChildren = computed(() => props.item.children?.filter(child => !child.meta?.hidden) ?? [])

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => showingChildren.value.length)

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
    const number = showingChildNumber.value;
    switch (true) {
        case number === 1:
            return showingChildren.value[0] || null;
        default:
            return {
                ...props.item, 
                path: "",
                meta: props.item.meta || null
            };
    }
})

/** 解析路径 */
function resolvePath(routePath: string) {  
    return path.resolve(props.basePath, routePath)
}
</script>

<template>
    <Link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
      <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
        <SvgIcon 
            v-if="theOnlyOneChild.meta?.icon" 
            :name="theOnlyOneChild.meta.svgIcon as 'search' | 'fullscreen-exit' | 'fullscreen' | 'keyboard-down' | 'keyboard-enter' | 'keyboard-esc' | 'keyboard-up' | 'manager' | undefined" 
            class="svg-icon" 
        />
        <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
        <template v-if="theOnlyOneChild.meta.title" #title>
          <span class="title">{{ theOnlyOneChild.meta.title }}</span>
        </template>
      </el-menu-item>
    </Link>
 
</template>

<style lang="scss" scoped>
@use "../../../common/assets/styles/mixins.scss" as *;


.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 18px;
}

.title {
  @extend %ellipsis;
}
</style>
