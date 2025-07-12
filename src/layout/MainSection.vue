<template>
    <main class="main-section">
        <div class="header">
            <div class="header-row">
                <div class="search-bar-container">
                    <input type="text" class="search-bar" placeholder="Search for product..." v-model="searchQuery"/>
                </div>
                <div class="edit-toggle-container">
                    <button v-if="editMode" class="modal-button add-item-btn" @click="openAddItemModal('item')">Add Item</button>
                    <button v-if="editMode" class="modal-button add-category-btn" @click="openAddItemModal('category')">Add Category</button>
                    <button class="edit-toggle-btn" :class="{active: editMode}" @click="editMode = !editMode">
                        {{ editMode ? 'Exit Edit Mode' : 'Enter Edit Mode' }}
                    </button>
                </div>
            </div>
            <div class="categories-panel">
                <div class="categories"> 
                    <div class="all-categories">
                    <template v-for="category in categories" :key="category.id">
                        <span v-if="!editMode"
                            class="category-tag"
                            :class="{ selected: selectedCategories.includes(category.id) }"
                            @click="toggleCategory(category.id)">
                        {{ category.displayname }}
                        </span>
                        <span v-else class="category-tag edit-mode">
                        <input class="category-name-input" v-model="category.displayname" @change="updateCategoryInline(category)" />
                        <button class="delete-category-btn" @click="deleteCategoryInline(category)">Delete</button>
                        </span>
                    </template>
                    </div>
                </div>
            </div>
        </div>

        <List :items="filteredItems" :categories="categories" @open-quantity-modal="openQuantityModal" :edit-mode="editMode" 
              @update-item="updateItemInline" 
              @delete-item="deleteItemInline" />

        <ItemToCart
            :is-open="isQuantityModalOpen"
            :item="selectedItem"
            :quantity="quantity"
            :edit-mode="editMode"
            @update:quantity="(val: number) => quantity = val"
            @close="closeQuantityModal"
            @add-to-cart="addToCart"
        />

        <ErrorPopup :message="errorMessage" :show="errorShow" @hide="hideError" />
        <AddItem
            v-if="editMode && isAddItemModalOpen && addMode === 'item'"
            :is-open="isAddItemModalOpen"
            :categories="categories"
            @close="closeAddItemModal"
            @add="onAddItem"
            @error="showError"
        />
        <AddCategory
            v-if="editMode && isAddItemModalOpen && addMode === 'category'"
            :is-open="isAddItemModalOpen"
            @close="closeAddItemModal"
            @add="onAddCategory"
            @error="showError"
        />
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import List from '../base/List.vue';
import ItemToCart from '../components/ItemToCart.vue';
import AddItem from '../components/AddItem.vue';
import AddCategory from '../components/AddCategory.vue';
import ErrorPopup from '../components/ErrorPopup.vue';
// import { categories, items } from '../scripts/sampledb';
import { getCategories, getItems, addItem, initDb, addCategory, deleteItem, addCategory as upsertCategory, deleteCategory } from '../scripts/sqlite';

const searchQuery = ref('');
const isModalOpen = ref(false);
const isQuantityModalOpen = ref(false);
const isAddItemModalOpen = ref(false);
const selectedCategories = ref<string[]>([]);
const selectedItem = ref<any>(null);
const quantity = ref(1);

const categories = ref<any[]>([]);
const items = ref<any[]>([]);

const newItem = ref({
    displayname: '',
    price: 0,
    categories: [] as string[],
});

const addMode = ref<'item' | 'category'>('item');

const newCategory = ref({
    displayname: '',
});

const editMode = ref(false);

const errorMessage = ref('');
const errorShow = ref(false);
function showError(msg: string) {
  errorMessage.value = msg;
  errorShow.value = true;
}
function hideError() {
  errorShow.value = false;
}

async function refreshData() {
    categories.value = await getCategories();
    items.value = await getItems();
}

onMounted(async () => {
    await initDb();
    await refreshData();
});

// const openModal = () => {
//     isModalOpen.value = true;
// };

// const closeModal = () => {
//     isModalOpen.value = false;
// };

const openAddItemModal = (mode: 'item' | 'category') => {
    isAddItemModalOpen.value = true;
    addMode.value = mode;
    newItem.value = {
        displayname: '',
        price: 0,
        categories: [],
    };
    newCategory.value = {
        displayname: '',
    };
};

const closeAddItemModal = () => {
    isAddItemModalOpen.value = false;
};

// const submitNew = async () => {
//     if (addMode.value === 'item') {
//         if (!newItem.value.displayname || newItem.value.price <= 0) return;
//         const id = Math.random().toString(36).substr(2, 9);
//         await addItem({
//             id,
//             displayname: newItem.value.displayname,
//             price: newItem.value.price,
//             categories: newItem.value.categories,
//         });
//         await refreshData();
//         closeAddItemModal();
//     } else {
//         if (!newCategory.value.displayname) return;
//         const id = Math.random().toString(36).substr(2, 9);
//         await addCategory({
//             id,
//             displayname: newCategory.value.displayname,
//         });
//         await refreshData();
//         closeAddItemModal();
//     }
// };

const openQuantityModal = (item: any) => {
    selectedItem.value = item;
    quantity.value = 1;
    isQuantityModalOpen.value = true;
};

const closeQuantityModal = () => {
    isQuantityModalOpen.value = false;
    selectedItem.value = null;
    quantity.value = 1;
};

const addToCart = () => {
    if (selectedItem.value && quantity.value > 0) {
        window.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: {
                item: selectedItem.value,
                quantity: quantity.value
            }
        }));
        closeQuantityModal();
    }
};

const toggleCategory = (categoryId: string) => {
    const index = selectedCategories.value.indexOf(categoryId);
    if (index > -1) {
        selectedCategories.value.splice(index, 1);
    } else {
        selectedCategories.value.push(categoryId);
    }
};

const filteredItems = computed(() => {
    let filtered = items.value;
    if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(item => 
            item.categories.some((catId: string) => selectedCategories.value.includes(catId))
        );
    }
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.displayname.toLowerCase().includes(query)
        );
    }
    return filtered;
});

// const selectedCategoryNames = computed(() => {
//     return selectedCategories.value.map(id => 
//         categories.value.find((cat: any) => cat.id === id)?.displayname
//     ).filter(Boolean);
// });

async function updateItemInline(item: any) {
    // If you have an updateItem function, use it. Otherwise, use addItem as an upsert.
    await addItem(item);
    await refreshData();
}

async function deleteItemInline(item: any) {
    if (typeof deleteItem === 'function') {
        await deleteItem(item.id);
        await refreshData();
    }
}

async function updateCategoryInline(category: any) {
    // Use upsertCategory (addCategory) as update if no updateCategory exists
    await upsertCategory(category);
    await refreshData();
}
async function deleteCategoryInline(category: any) {
    if (typeof deleteCategory === 'function') {
        await deleteCategory(category.id);
        await refreshData();
    }
}

function onAddItem(item: { displayname: string; price: number; categories: string[]; barcode?: string }) {
    const id = Math.random().toString(36).substr(2, 9);
    addItem({ id, ...item }).then(refreshData);
    closeAddItemModal();
}
function onAddCategory(category: { displayname: string }) {
    const id = Math.random().toString(36).substr(2, 9);
    addCategory({ id, ...category }).then(refreshData);
    closeAddItemModal();
}
</script>

<style scoped>
.main-section {
    width: 100%;
    height: 100%;
    background-color: #AEB6AA;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.header {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 0 15px 0;
    background-color: #BFBFBF;
    padding: 20px;
}

.header-row {
    display: flex;
    align-items: center;
    gap: 20px;
}
.search-bar-container {
    flex: 1;
    min-width: 200px;
    /* max-width: 400px; */
}
.search-bar {
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
    background-color: #797878;
    border: none;
}
.search-bar::placeholder {
    color: #fff;
    opacity: 0.6;
}

.search-bar:focus {
    outline: none;
}


.categories-panel {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
}

.categories {
    flex: 1;
    background-color: aqua;
}

.modal-button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.modal-button:hover {
    background-color: #45a049;
}

.categories {
    flex: 1;
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #ddd;
}


.category-tag {
    background-color: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    display: inline-block;
}

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

.quantity-selection {
    padding: 10px 0;
}

.item-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.modal-product-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    background: #eee;
}

.item-info h4 {
    margin: 0 0 5px 0;
    color: #333;
}

.price {
    margin: 0;
    color: #4CAF50;
    font-weight: 600;
    font-size: 1.1rem;
}

.quantity-controls {
    margin-bottom: 20px;
}

.quantity-controls label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #333;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}

.qty-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    transition: background-color 0.2s;
}

.qty-btn:hover {
    background-color: #f0f0f0;
}

.quantity-field {
    width: 80px;
    height: 40px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

.total-preview {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #e8f5e8;
    border-radius: 8px;
    border: 1px solid #4CAF50;
}

.total-preview p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2e7d32;
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

.add-item-btn {
    background-color: #2196F3;
    margin-left: 10px;
}
.add-item-btn:hover {
    background-color: #1976D2;
}
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
.add-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}
.add-toggle button {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: 6px;
    background: #eee;
    color: #333;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}
.add-toggle button.active {
    background: #4CAF50;
    color: #fff;
}
.edit-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}
.edit-toggle-btn {
    padding: 8px 16px;
    background-color: #FFC107;
    color: #333;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}
.edit-toggle-btn.active {
    background-color: #FF9800;
    color: #fff;
}
.all-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
}
.category-tag.selected {
    background-color: #1976D2;
    color: #fff;
}
.category-tag.edit-mode {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #FFC107;
    color: #333;
}
.category-name-input {
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 6px;
    width: 100px;
}
.delete-category-btn {
    background-color: #f44336;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;
}
.delete-category-btn:hover {
    background-color: #d32f2f;
}
.add-category-btn {
    background-color: #2196F3;
}
.add-category-btn:hover {
    background-color: #1976D2;
}
</style>