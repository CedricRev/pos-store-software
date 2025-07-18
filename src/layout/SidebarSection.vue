<template>
    <aside class="sidebar-section">
        <h1>RGJ Caravan RTW</h1>
        <!-- <Logo /> -->
        <ListContainer />
    </aside>
</template>

<script setup>
// import Logo from "../components/Logo.vue";
import ListContainer from "../components/ListContainer.vue";
</script>

<style scoped>
.sidebar-section {
    width: 30%;
    max-width: 350px;
    min-width: 250px;
    background-color: #D9D9D9;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
}
</style>