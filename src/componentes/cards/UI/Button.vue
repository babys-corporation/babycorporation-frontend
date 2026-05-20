<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'default',
  size: 'default',
  type: 'button'
})

// monta as classes com base nas props
const classes = computed(() => {
  return ['btn', `btn-${props.variant}`, `btn-${props.size}`]
})
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="classes">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* variantes */
.btn-default {
  background-color: #F6339A;
  color: #fff;
}
.btn-default:hover {
  background-color: #e0288a;
}

.btn-destructive {
  background-color: #ef4444;
  color: #fff;
}
.btn-destructive:hover {
  background-color: #dc2626;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #E5E5E5;
  color: #333;
}
.btn-outline:hover {
  background-color: #f5f5f5;
}

.btn-secondary {
  background-color: #f0e6f6;
  color: #AD46FF;
}
.btn-secondary:hover {
  background-color: #e4d0f5;
}

.btn-ghost {
  background-color: transparent;
  color: #333;
}
.btn-ghost:hover {
  background-color: #f5f5f5;
}

.btn-link {
  background-color: transparent;
  color: #F6339A;
  text-decoration: underline;
  padding: 0;
}

/* tamanhos */
.btn-default,
.btn-sm,
.btn-lg,
.btn-icon {
  gap: 8px;
}

.btn-default {
  height: 36px;
  padding: 0 16px;
}

.btn-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
}

.btn-lg {
  height: 40px;
  padding: 0 24px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
}
</style>
