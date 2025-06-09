<script lang="ts" setup>
import { AppMain,Sidebar } from "./components/index";

</script>

<template>
  <div class="app-wrapper">
    <Sidebar class="sidebar-container"/>
    <div class="mian-container">
      <AppMain class="app-main"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/common/assets/styles/mixins.scss" as *;
$transition-time: 0.35s;

.app-wrapper {
 @extend %clearfix;
  position:relative;
  width: 100%;
}

.sidebar-container {
  background-color: var(--v3-sidebar-menu-bg-color);
  transition: width $transition-time;
  width: var(--v3-sidebar-width);
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  border-right:var(--v3-sidebar-border-right);
}

.mian-container {
  min-height: 100%;
  transition: margin-left $transition-time;
  margin-left: var(--v3-sidebar-width);
  position:relative;
}

.app-main {
  min-height: calc(100vh - var(--v3-navigation-height));
  position: relative;
  overflow: hidden;
}

</style>
