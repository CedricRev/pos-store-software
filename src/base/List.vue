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
          <span class="product-price price-flex">₱{{ priceFormatter.format(item.price) }}</span>
        </template>
        <div class="item-categories categories-flex">
          <template v-if="editMode">
            <span v-for="catId in visibleTags(item.categories)" :key="catId" class="category-tag editable">
              {{ getCategoryName(catId) }}
              <button class="remove-cat-btn" @click="removeCategory(item, catId)">×</button>
            </span>
            <span v-if="hasMoreTags(item.categories)" class="category-tag more">...</span>
            <button class="add-cat-btn" @click="openAddCategoryModal(item)" v-if="categories.length > item.categories.length">+</button>
          </template>
          <template v-else>
            <span v-for="catId in visibleTags(item.categories)" :key="catId" class="category-tag">
              {{ getCategoryName(catId) }}
            </span>
            <span v-if="hasMoreTags(item.categories)" class="category-tag more">...</span>
          </template>
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
          <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>
        <template v-if="editMode">
          <button class="delete-item-button" @click="$emit('delete-item', item)">Delete</button>
        </template>
      </div>
    </div>
    <AddCategoryModal
      :isOpen="addCategoryModalOpen"
      :item="addCategoryItem"
      :categories="categories"
      :selectedCategories="addCategoryItem?.categories || []"
      @close="closeAddCategoryModal"
      @select-category="handleSelectCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch, ref } from 'vue';
import JsBarcode from 'jsbarcode';
import AddCategoryModal from '../components/AddCategoryModal.vue';

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

// Track which item is currently showing the add category dropdown
const addingCategoryFor = ref<string | null>(null);

function removeCategory(item: any, catId: string) {
  item.categories = item.categories.filter((id: string) => id !== catId);
  emit('update-item', { ...item });
}

function addCategory(item: any, catId: string) {
  if (!item.categories.includes(catId)) {
    item.categories.push(catId);
    emit('update-item', { ...item });
  }
  addingCategoryFor.value = null;
}

const addCategoryModalOpen = ref(false);
const addCategoryItem = ref<any>(null);

function openAddCategoryModal(item: any) {
  addCategoryItem.value = item;
  addCategoryModalOpen.value = true;
}
function closeAddCategoryModal() {
  addCategoryModalOpen.value = false;
  addCategoryItem.value = null;
}
function handleSelectCategory(catId: string) {
  if (addCategoryItem.value && !addCategoryItem.value.categories.includes(catId)) {
    addCategoryItem.value.categories.push(catId);
    emit('update-item', { ...addCategoryItem.value });
  }
  closeAddCategoryModal();
}

const MAX_TAGS_DISPLAY = 1;

function visibleTags(categories: string[]) {
  return categories.slice(0, MAX_TAGS_DISPLAY);
}
function hasMoreTags(categories: string[]) {
  return categories.length > MAX_TAGS_DISPLAY;
}

const priceFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  gap: 1.5vw;
  min-height: 3.5em;
}
.name-flex {
  flex: 2;
  min-width: 8em;
  margin-right: 1em;
  text-align: left;
}
.price-flex {
  flex: 1;
  min-width: 5em;
  margin-right: 1em;
  text-align: left;
}
.categories-flex {
  flex: 2;
  min-width: 8em;
  display: flex;
  gap: 0.5em;
}
.barcode-flex {
  flex: 1;
  min-width: 10em;
  margin-right: 1em;
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
.category-tag,
.category-tag.editable {
  background-color: #4CAF50;
  color: white;
  padding: 0.3em 1.2em;
  border-radius: 1.5em;
  font-size: clamp(1rem, 1.3vw, 1.3rem);
  margin-right: 0.5em;
  display: inline-block;
  font-weight: 500;
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
  font-size: clamp(1.2rem, 2vw, 2.2rem);
  color: #333;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
}
.product-price {
  font-size: clamp(1.1rem, 1.7vw, 1.8rem);
  color: #275829;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
.category-select, .category-add-select {
  min-width: 8em;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  border: 1px solid #ccc;
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  background: #fff;
}
.category-tag.editable {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #4CAF50;
  color: white;
  padding: 2px 8px 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 4px;
}
.remove-cat-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  margin-left: 0.2em;
  cursor: pointer;
  padding: 0 0.2em;
}
.add-cat-btn {
  background: #2196F3;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: clamp(2em, 2.5vw, 2.5em);
  height: clamp(2em, 2.5vw, 2.5em);
  font-size: clamp(1.3rem, 2vw, 2rem);
  cursor: pointer;
  margin-left: 0.5em;
  margin-right: 0.5em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.add-cat-btn:hover {
  background: #1976D2;
}
.category-add-select {
  min-width: 120px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #2196F3;
  font-size: 0.9rem;
  background: #fff;
  margin-left: 4px;
}
.category-tag.more {
  background: #bbb;
  color: #fff;
  font-weight: bold;
  pointer-events: none;
}

.cart-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
