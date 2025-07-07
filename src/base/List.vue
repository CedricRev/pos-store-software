<template>
  <div class="list">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="list-row"
    >
      <img :src="item.thumbnail" alt="product" class="product-img" />
      <div class="item-details">
        <span class="product-name">{{ item.displayname }}</span>
        <span class="product-price">₱{{ item.price }}</span>
      </div>
      <button class="add-item-button" @click="openQuantityModal(item)">
        Add Item
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: {
    type: Array as () => Array<{ id: string; displayname: string; thumbnail: string; price: number; categories: string[] }>,
    default: () => [],
  }
});

const emit = defineEmits(['open-quantity-modal']);

function openQuantityModal(item: { id: string; displayname: string; thumbnail: string; price: number; categories: string[] }) {
  emit('open-quantity-modal', item);
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
  gap: 15px;
}
.product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #CABDBD;
  flex-shrink: 0;
}
.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.product-name {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
}
.product-price {
  font-size: 0.9em;
  color: #275829;
  font-weight: 600;
}
.add-item-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.add-item-button:hover {
  background-color: #45a049;
}
</style>
