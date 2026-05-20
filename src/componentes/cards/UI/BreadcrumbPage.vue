<script setup lang="ts">
// página atual do breadcrumb (não é um link)
</script>

<template>
  <span class="breadcrumb-pagina" role="link" aria-disabled="true" aria-current="page">
    <slot />
  </span>
</template>

<style scoped>
.breadcrumb-pagina {
  color: #333;
  font-weight: 500;
}
</style>
