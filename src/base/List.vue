<template>
  <div class="list">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="list-row"
    >
      <div class="item-details-horizontal">
        <template v-if="editMode">
          <input
            class="product-name-input name-flex"
            type="text"
            v-model="item.displayname"
            @change="$emit('update-item', { ...item })"
          />
          <input
            class="product-price-input price-flex"
            type="number"
            min="0"
            v-model.number="item.price"
            @change="$emit('update-item', { ...item })"
          />
        </template>
        <template v-else>
          <span class="product-name name-flex">{{ item.displayname }}</span>
          <span class="product-price price-flex">₱{{ item.price }}</span>
        </template>
        <div class="item-categories categories-flex">
          <span v-for="catId in item.categories" :key="catId" class="category-tag">
            {{ getCategoryName(catId) }}
          </span>
        </div>
        <div v-if="item.barcode" class="barcode-display barcode-flex">
          <div class="barcode-container">
            <svg :id="`barcode-${item.id}`" class="barcode-svg"></svg>
            <div class="barcode-text">{{ item.barcode }}</div>
          </div>
        </div>
      </div>
      <div class="item-actions">
        <button class="add-item-button" @click="openQuantityModal(item)" v-if="!editMode">
          Add Item
        </button>
        <template v-if="editMode">
          <button class="delete-item-button" @click="$emit('delete-item', item)">Delete</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import JsBarcode from 'jsbarcode';

const props = defineProps({
  items: {
    type: Array as () => Array<{ id: string; displayname: string; price: number; categories: string[]; barcode?: string }>,
    default: () => [],
  },
  categories: {
    type: Array as () => Array<{ id: string; displayname: string }>,
    default: () => [],
  },
  editMode: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['open-quantity-modal', 'edit-item', 'delete-item', 'update-item']);

function openQuantityModal(item: { id: string; displayname: string; price: number; categories: string[]; barcode?: string }) {
  emit('open-quantity-modal', item);
}

function getCategoryName(catId: string) {
  const cat = props.categories.find((c: any) => c.id === catId);
  return cat ? cat.displayname : catId;
}

function generateBarcode(elementId: string, barcode: string) {
  try {
    const element = document.getElementById(elementId);
    if (element && element instanceof SVGElement) {
      JsBarcode(element, barcode, {
        format: "CODE128",
        width: 1.5,
        height: 30,
        displayValue: false,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 2
      });
    }
  } catch (error) {
    console.error('Error generating barcode:', error);
  }
}

async function generateAllBarcodes() {
  await nextTick();
  props.items.forEach(item => {
    if (item.barcode) {
      generateBarcode(`barcode-${item.id}`, item.barcode);
    }
  });
}

onMounted(async () => {
  await generateAllBarcodes();
});

// Watch for changes in items to regenerate barcodes
watch(() => props.items, async () => {
  await generateAllBarcodes();
}, { deep: true });
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
  align-items: stretch;
  padding: 0.2em 0.5em;
  border-bottom: 1px solid #eee;
  gap: 8px;
}
.product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #CABDBD;
  flex-shrink: 0;
}
.item-details-horizontal {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0;
}
.name-flex {
  flex: 2;
  min-width: 120px;
  margin-right: 10px;
}
.price-flex {
  flex: 1;
  min-width: 80px;
  margin-right: 10px;
}
.categories-flex {
  flex: 2;
  min-width: 120px;
  display: flex;
  gap: 6px;
}
.barcode-flex {
  flex: 1;
  min-width: 150px;
  margin-right: 10px;
}
.item-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 8px;
}
.item-categories {
  display: flex;
  gap: 6px;
}
.category-tag {
  background-color: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: inline-block;
}
.barcode-display {
  display: flex;
  align-items: center;
}
.barcode-container {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.barcode-svg {
  width: 100%;
  height: 35px;
}
.barcode-text {
  font-size: 0.6rem;
  font-family: monospace;
  color: #666;
  text-align: center;
}
.item-details {
  display: none;
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
.edit-item-button {
  margin-left: 8px;
  background-color: #FFC107;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.edit-item-button:hover {
  background-color: #FF9800;
  color: #fff;
}
.delete-item-button {
  margin-left: 8px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.delete-item-button:hover {
  background-color: #d32f2f;
}
.product-name-input {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 4px;
}
.product-price-input {
  font-size: 0.9em;
  color: #275829;
  font-weight: 600;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}
</style>
