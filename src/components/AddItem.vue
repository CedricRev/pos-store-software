<template>
  <Modal :is-open="isOpen" title="Add Item" @close="$emit('close')">
    <div class="add-item-form">
      <label>Name: <input v-model="item.displayname" type="text" /></label>
      <label>Price: <input v-model.number="item.price" type="number" min="0" /></label>
      <label class="barcode-section">
        <div class="barcode-toggle">
          <input type="checkbox" v-model="generateBarcode" id="generate-barcode" />
          <label for="generate-barcode">Generate Barcode</label>
        </div>
        <div v-if="generateBarcode" class="barcode-preview">
          <span class="barcode-label">Generated Barcode:</span>
          <div class="barcode-display">
            <svg ref="barcodePreview" class="barcode-svg"></svg>
            <span class="barcode-value">{{ item.barcode || 'Generating...' }}</span>
          </div>
        </div>
      </label>
      <label>Categories:
        <div class="category-list">
          <div v-for="category in categories" :key="category.id">
            <input type="checkbox" :value="category.id" v-model="item.categories" />
            <span>{{ category.displayname }}</span>
          </div>
        </div>
      </label>
      <div class="modal-actions">
        <button @click="$emit('close')" class="cancel-button">Cancel</button>
        <button @click="submit" class="add-button">Add</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import Modal from '../base/Modal.vue';
import { generateUniqueBarcode } from '../scripts/sqlite';
import JsBarcode from 'jsbarcode';

const props = defineProps<{ isOpen: boolean, categories: Array<{ id: string, displayname: string }> }>();
const emit = defineEmits(['close', 'add', 'error']);

const item = ref({
  displayname: '',
  price: 0,
  categories: [] as string[],
  barcode: '',
});

const generateBarcode = ref(false);
const barcodePreview = ref<SVGElement>();

function generateBarcodePreview(barcode: string) {
  if (barcodePreview.value) {
    try {
      JsBarcode(barcodePreview.value, barcode, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: false,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 2
      });
    } catch (error) {
      console.error('Error generating barcode preview:', error);
    }
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    item.value = { displayname: '', price: 0, categories: [], barcode: '' };
    generateBarcode.value = false;
  }
});

watch(generateBarcode, async (shouldGenerate) => {
  if (shouldGenerate && !item.value.barcode) {
    try {
      console.log('Generating barcode...');
      item.value.barcode = await generateUniqueBarcode();
      console.log('Barcode generated:', item.value.barcode);
    } catch (error) {
      console.error('Barcode generation error:', error);
      emit('error', `Failed to generate barcode: ${error instanceof Error ? error.message : 'Unknown error'}`);
      generateBarcode.value = false;
    }
  } else if (!shouldGenerate) {
    item.value.barcode = '';
  }
});

watch(() => item.value.barcode, async (newBarcode) => {
  if (newBarcode && generateBarcode.value) {
    await nextTick();
    generateBarcodePreview(newBarcode);
  }
});

function submit() {
  if (!item.value.displayname) {
    emit('error', 'Item name is required.');
    return;
  }
  if (item.value.price <= 0) {
    emit('error', 'Item price must be greater than 0.');
    return;
  }
  if (!item.value.categories || item.value.categories.length === 0) {
    emit('error', 'At least one category is required.');
    return;
  }
  emit('add', { ...item.value });
}
</script>

<style scoped>
.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.add-item-form label {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #333;
}
.barcode-section {
  margin-bottom: 10px;
}
.barcode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.barcode-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
.barcode-preview {
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.barcode-label {
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}
.barcode-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.barcode-svg {
  width: 100%;
  height: 45px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 2px;
}
.barcode-value {
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.cancel-button {
  background-color: #f44336;
  color: white;
}
.cancel-button:hover {
  background-color: #d32f2f;
}
.add-button {
  background-color: #4CAF50;
  color: white;
}
.add-button:hover {
  background-color: #45a049;
}
</style> 