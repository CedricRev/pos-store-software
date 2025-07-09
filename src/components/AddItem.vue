<template>
  <Modal :is-open="isOpen" title="Add Item" @close="$emit('close')">
    <div class="add-item-form">
      <label>Name: <input v-model="item.displayname" type="text" /></label>
      <label>Price: <input v-model.number="item.price" type="number" min="0" /></label>
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
import { ref, watch } from 'vue';
import Modal from '../base/Modal.vue';

const props = defineProps<{ isOpen: boolean, categories: Array<{ id: string, displayname: string }> }>();
const emit = defineEmits(['close', 'add', 'error']);

const item = ref({
  displayname: '',
  price: 0,
  categories: [] as string[],
});

watch(() => props.isOpen, (open) => {
  if (open) {
    item.value = { displayname: '', price: 0, categories: [] };
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