<script setup lang="ts">
const props = defineProps<{
  href?: string
}>()
</script>

<template>
  <a class="breadcrumb-link" :href="props.href">
    <slot />
  </a>
</template>

<style scoped>
.breadcrumb-link {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #F6339A;
}
</style>
