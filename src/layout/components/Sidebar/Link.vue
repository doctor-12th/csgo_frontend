<script setup lang="ts">
interface Pros{
    to:string
}
const props = defineProps<Pros>();
</script>

<template>
  <router-link :to="props.to">
    <slot/>
  </router-link>
</template>
