<script setup lang="ts">
</script>

<template>
    <section class="app-main">
        <div class="app-scrollbar">
            <router-view v-slot="{ Component,route }">
                <transition name="el-fade-in" mode="out-in">
                    <keep-alive>
                        <component :is="Component" :key="route.path" class="app-container-grow"/>
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </section>
</template>

<style lang="scss" scoped>
// Replace the old import
// @import "@/common/assets/styles/mixins.scss";

// With the new @use syntax
@use "@/common/assets/styles/mixins.scss" as *;

.app-main {
   width:100%;
   display: flex;
}
.app-scrollbar {
   flex-grow:1;
   overflow: auto;
   @extend %scrollbar;
   .app-container-grow {
      flex-grow:1;
   }
}

</style>
