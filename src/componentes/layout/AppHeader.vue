<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppHeader',
});

</script>

<template>
    <header>
      <img src="/baby.png" alt="baby">
      <h1>BabyCorporation</h1>
    </header>
</template>

<style>
header {
  display: flex;
  align-items: center;
  color: FFFFFF;
}

header h1 {
  font-size: 1.2rem;
}

header img {
  width: 10%;
  height: 10%;
}
</style>