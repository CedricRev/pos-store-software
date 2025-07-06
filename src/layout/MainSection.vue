<template>
    <main class="main-section">
        <div class="header">
            <div class="search-bar-container">
                <input
                    type="text"
                    class="search-bar"
                    placeholder="Search for product..."
                    v-model="searchQuery"
                />
            </div>
        <div class="filter-container">
            <div class="filter"> 
                <h1>filter</h1>
            </div>
            <button class="modal-button" @click="openModal">Open Modal</button>
        </div>
        </div>

        <List />
        
        <Modal :is-open="isModalOpen" title="Sample Modal" @close="closeModal">
            <div>
                <p>This is a sample modal content. You can customize this content as needed.</p>
                <p>The modal is created as a reusable base component that can be used throughout the application.</p>
            </div>
        </Modal>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import List from '../base/List.vue';
import Modal from '../base/Modal.vue';

const searchQuery = ref('');
const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
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


.filter-container {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
}

.filter {
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

</style>