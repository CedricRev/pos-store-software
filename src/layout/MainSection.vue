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
        <!-- <div class="filter"> 
            <h1>filter</h1>
        </div> -->
        </div>

        <List />
    </main>
</template>

<script setup>
import { ref } from 'vue';
import List from '../base/List.vue';
const searchQuery = ref('');
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


.filter {
    width: 100%;
    background-color: aqua;
}

</style>