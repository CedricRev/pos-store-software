<template>
  <Modal :isOpen="isOpen" :title="`Add Category to: ${item?.displayname || ''}`" @close="$emit('close')">
    <div v-if="item">
      <div class="item-info">
        <strong>Item:</strong> {{ item.displayname }}<br />
        <strong>Current Categories:</strong>
        <span v-if="selectedCategories.length === 0">None</span>
        <span v-for="catId in selectedCategories" :key="catId" class="category-tag">
          {{ getCategoryName(catId) }}
        </span>
      </div>
      <div class="available-categories">
        <h4>Add a Category:</h4>
        <div v-if="availableCategories.length === 0">No more categories to add.</div>
        <button
          v-for="cat in availableCategories"
          :key="cat.id"
          class="category-add-btn"
          @click="$emit('select-category', cat.id)"
        >
          {{ cat.displayname }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../base/Modal.vue';
import { computed } from 'vue';

interface Category {
  id: string;
  displayname: string;
}
interface Item {
  id: string;
  displayname: string;
  categories: string[];
}

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  item: { type: Object as () => Item, default: null },
  categories: { type: Array as () => Category[], default: () => [] },
  selectedCategories: { type: Array as () => string[], default: () => [] }
});

const emit = defineEmits(['select-category', 'close']);

const availableCategories = computed(() => {
  return (props.categories || []).filter((cat: Category) => !(props.selectedCategories || []).includes(cat.id));
});

function getCategoryName(catId: string) {
  const cat = (props.categories || []).find((c: Category) => c.id === catId);
  return cat ? cat.displayname : catId;
}
</script>

<style scoped>
.item-info {
  margin-bottom: 1em;
}
.category-tag {
  background-color: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 4px;
  display: inline-block;
}
.available-categories {
  margin-top: 1em;
}
.category-add-btn {
  background: #2196F3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  margin: 4px 4px 0 0;
  font-size: 0.95em;
  cursor: pointer;
  transition: background 0.2s;
}
.category-add-btn:hover {
  background: #1976D2;
}
</style> 