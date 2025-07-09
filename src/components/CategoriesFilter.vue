<template>
  <Modal :is-open="isOpen" title="Filter by Categories" @close="$emit('close')">
    <div class="category-selection">
      <h4>Select categories to filter items:</h4>
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ 'selected': selectedCategories.includes(category.id) }"
          @click="$emit('toggle-category', category.id)"
        >
          <input 
            type="checkbox" 
            :checked="selectedCategories.includes(category.id)"
            @change="$emit('toggle-category', category.id)"
            @click.stop
          />
          <span>{{ category.displayname }}</span>
          <template v-if="editMode">
            <button class="edit-category-button" @click.stop="$emit('edit-category', category)">Edit</button>
            <button class="delete-category-button" @click.stop="$emit('delete-category', category)">Delete</button>
          </template>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="$emit('clear-all')" class="clear-button">Clear All</button>
        <button @click="$emit('close')" class="apply-button">Apply Filter</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../base/Modal.vue';

defineProps<{
  isOpen: boolean,
  categories: any[],
  selectedCategories: string[],
  editMode: boolean,
}>();

const emit = defineEmits(['toggle-category', 'clear-all', 'close', 'edit-category', 'delete-category']);
</script>

<style scoped>
.category-selection {
    padding: 10px 0;
}
.category-selection h4 {
    margin: 0 0 15px 0;
    color: #333;
}
.category-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}
.category-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.category-item:hover {
    background-color: #f5f5f5;
}
.category-item.selected {
    background-color: #e8f5e8;
    border-color: #4CAF50;
}
.category-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}
.category-item span {
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
.clear-button, .apply-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}
.clear-button {
    background-color: #f44336;
    color: white;
}
.clear-button:hover {
    background-color: #d32f2f;
}
.apply-button {
    background-color: #4CAF50;
    color: white;
}
.apply-button:hover {
    background-color: #45a049;
}
.edit-category-button {
  margin-left: 8px;
  background-color: #FFC107;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}
.edit-category-button:hover {
  background-color: #FF9800;
  color: #fff;
}
.delete-category-button {
  margin-left: 8px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}
.delete-category-button:hover {
  background-color: #d32f2f;
}
</style> 