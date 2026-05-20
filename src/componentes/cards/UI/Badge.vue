<script setup lang="ts">
const props = defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}>()
</script>

<template>
  <span class="badge" :class="`badge-${props.variant ?? 'default'}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  width: fit-content;
}

.badge-default {
  background-color: #F6339A;
  color: #fff;
}

.badge-secondary {
  background-color: #f0e6f6;
  color: #AD46FF;
}

.badge-destructive {
  background-color: #fca5a5;
  color: #7f1d1d;
}

.badge-outline {
  border-color: #E5E5E5;
  background-color: transparent;
  color: #333;
}
</style>
