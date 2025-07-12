<template>
  <transition name="fade">
    <div v-if="show" class="error-popup">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
const props = defineProps<{ message: string, show: boolean }>();
const emit = defineEmits(['hide']);
let timer: number | undefined;

watch(() => props.show, (val) => {
  if (val) {
    clearTimeout(timer);
    timer = window.setTimeout(() => emit('hide'), 2500);
  }
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped>
.error-popup {
  position: fixed;
  top: 30px;
  right: 30px;
  background: #f44336;
  color: #fff;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 9999;
  min-width: 220px;
  text-align: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 