<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['base-btn', colorClass, sizeClass, customClass]"
    @click="$emit('click', $event)"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: { 
    type: String as () => 'button' | 'submit' | 'reset', 
    default: 'button' 
  },
  disabled: { 
    type: Boolean, 
    default: false 
  },
  color: { 
    type: String, 
    default: 'primary' 
  },
  size: { 
    type: String, 
    default: 'medium' 
  }, 
  customClass: { 
    type: String, 
    default: '' 
  },
});

defineEmits(['click']);

const colorClass = computed(() => {
  return `base-btn--${props.color}`;
});
const sizeClass = computed(() => {
  return `base-btn--${props.size}`;
});
</script>

<style scoped>
.base-btn {
  border: none;
  border-radius: 30px;
  padding: 2em 1.2em;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.base-btn--primary {
  background: #A37878;
  color: #fff;
  font-weight: bold;
}
.base-btn--secondary {
  background: #e5e7eb;
  color: #111;
}
.base-btn--danger {
  background: #dc2626;
  color: #fff;
}
.base-btn--small {
  font-size: 0.85rem;
  padding: 0.3em 0.8em;
}
.base-btn--medium {
  font-size: 1rem;
  padding: 0.5em 1.2em;
}
.base-btn--large {
  font-size: 1.2rem;
  padding: 0.7em 1.6em;
}
</style>

