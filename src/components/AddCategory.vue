<template>
  <Modal :is-open="isOpen" title="Add Category" @close="$emit('close')">
    <div class="add-item-form">
      <label>Name: <input v-model="category.displayname" type="text" /></label>
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

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'add', 'error']);

const category = ref({
  displayname: '',
});

watch(() => props.isOpen, (open) => {
  if (open) {
    category.value = { displayname: '' };
  }
});

function submit() {
  if (!category.value.displayname) {
    emit('error', 'Category name is required.');
    return;
  }
  emit('add', { ...category.value });
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