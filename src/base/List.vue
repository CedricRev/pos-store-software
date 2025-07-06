<template>
  <div class="list">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="list-row"
    >
      <img :src="item.image" alt="product" class="product-img" />
      <span class="product-name">{{ item.name }}</span>
      <input
        type="checkbox"
        class="barcode-checkbox"
        :checked="item.hasBarcode"
        @change="onBarcodeToggle(idx, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// const props = defineProps({
//   items: {
//     type: Array as () => Array<{ name: string; image: string; hasBarcode: boolean }>,
//     default: () => [],
//   }
// });

const emit = defineEmits(['barcode-toggle']);

function onBarcodeToggle(idx: number, event: Event) {
  emit('barcode-toggle', { idx, checked: (event.target as HTMLInputElement).checked });
}
</script>

<style scoped>
.list {
  width: auto;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0.5em 0;
  min-height: 0;
  flex: 1;
  margin: 0 20px;
}
.list-row {
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  border-bottom: 1px solid #eee;
}
.product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1em;
  background: #eee;
}
.product-name {
  flex: 1;
  font-size: 1.1em;
  color: #333;
}
.barcode-checkbox {
  width: 20px;
  height: 20px;
}
</style>
