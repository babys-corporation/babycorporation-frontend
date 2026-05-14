<script setup lang="ts">
import { Baby } from 'lucide-vue-next';
</script>

<template>
    <header>
      <Baby :size="35" color="#F6339A" stroke-width="1.5" />
      <h1>BabyCorporation</h1>
    </header>
</template>

<style>
header {
  display: flex;
  align-items: center;
}

header h1 {
  font-size: 1.2rem;
  color: #000000;
}
</style>