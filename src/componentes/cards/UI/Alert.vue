<script setup lang="ts">
const props = defineProps<{
  variant?: 'default' | 'destructive'
}>()
</script>

<template>
  <div class="alert" :class="props.variant === 'destructive' ? 'alert-erro' : 'alert-padrao'" role="alert">
    <slot />
  </div>
</template>

<style scoped>
.alert {
  width: 100%;
  border-radius: 10px;
  border: 1px solid;
  padding: 12px 16px;
  font-size: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: start;
}

.alert-padrao {
  background-color: #fff;
  border-color: #E5E5E5;
  color: #333;
}

.alert-erro {
  background-color: #fff5f5;
  border-color: #fca5a5;
  color: #dc2626;
}
</style>
