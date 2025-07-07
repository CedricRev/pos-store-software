<template>
    <main class="main-section">
        <div class="header">
            <div class="search-bar-container">
                <input type="text" class="search-bar" placeholder="Search for product..." v-model="searchQuery"/>
            </div>
        <div class="categories-panel">
            <div class="categories"> 
                <h3>Selected Categories:</h3>
                <div v-if="selectedCategoryNames.length > 0" class="selected-categories">
                    <span v-for="categoryName in selectedCategoryNames" :key="categoryName" class="category-tag">
                        {{ categoryName }}
                    </span>
                </div>
                <div v-else class="no-categories">
                    <p>Open the button to filter by categories</p>
                </div>
            </div>
            <button class="modal-button" @click="openModal">Filter Categories</button>
        </div>
        </div>

        <List :items="filteredItems" @open-quantity-modal="openQuantityModal" />
        
        <Modal :is-open="isModalOpen" title="Filter by Categories" @close="closeModal">
            <div class="category-selection">
                <h4>Select categories to filter items:</h4>
                <div class="category-list">
                    <div 
                        v-for="category in categories" 
                        :key="category.id"
                        class="category-item"
                        :class="{ 'selected': selectedCategories.includes(category.id) }"
                        @click="toggleCategory(category.id)"
                    >
                        <input 
                            type="checkbox" 
                            :checked="selectedCategories.includes(category.id)"
                            @change="toggleCategory(category.id)"
                        />
                        <span>{{ category.displayname }}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button @click="selectedCategories = []" class="clear-button">Clear All</button>
                    <button @click="closeModal" class="apply-button">Apply Filter</button>
                </div>
            </div>
        </Modal>

        <Modal :is-open="isQuantityModalOpen" title="Add Item to Cart" @close="closeQuantityModal">
            <div class="quantity-selection" v-if="selectedItem">
                <div class="item-info">
                    <img :src="selectedItem.thumbnail" alt="product" class="modal-product-img" />
                    <div class="item-details">
                        <h4>{{ selectedItem.displayname }}</h4>
                        <p class="price">₱{{ selectedItem.price }}</p>
                    </div>
                </div>
                <div class="quantity-controls">
                    <label for="quantity">Quantity:</label>
                    <div class="quantity-input">
                        <button @click="quantity > 1 ? quantity-- : null" class="qty-btn">-</button>
                        <input 
                            type="number" 
                            id="quantity"
                            v-model="quantity" 
                            min="1" 
                            class="quantity-field"
                        />
                        <button @click="quantity++" class="qty-btn">+</button>
                    </div>
                </div>
                <div class="total-preview">
                    <p>Total: ₱{{ (selectedItem.price * quantity).toFixed(2) }}</p>
                </div>
                <div class="modal-actions">
                    <button @click="closeQuantityModal" class="cancel-button">Cancel</button>
                    <button @click="addToCart" class="add-button">Add Item</button>
                </div>
            </div>
        </Modal>
    </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import List from '../base/List.vue';
import Modal from '../base/Modal.vue';
import { categories, items } from '../scripts/sampledb';

const searchQuery = ref('');
const isModalOpen = ref(false);
const isQuantityModalOpen = ref(false);
const selectedCategories = ref<string[]>([]);
const selectedItem = ref<any>(null);
const quantity = ref(1);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

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
        // Emit event to parent component to handle cart updates
        // This will be handled by the parent App.vue
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
    let filtered = items;
    
    // First filter by selected categories
    if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(item => 
            item.categories.some(catId => selectedCategories.value.includes(catId))
        );
    }
    
    // Then filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.displayname.toLowerCase().includes(query)
        );
    }
    
    return filtered;
});

const selectedCategoryNames = computed(() => {
    return selectedCategories.value.map(id => 
        categories.find(cat => cat.id === id)?.displayname
    ).filter(Boolean);
});
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

.search-bar-container {
    width: 100%;
    box-sizing: border-box;
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

.categories h3 {
    margin: 0 0 10px 0;
    font-size: 1rem;
    color: #333;
}

.selected-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-tag {
    background-color: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    display: inline-block;
}

.no-categories {
    color: #666;
    font-style: italic;
}

.no-categories p {
    margin: 0;
    font-size: 0.9rem;
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

</style>