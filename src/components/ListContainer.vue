<template>
    <div class="price-list">
        <div class="list-container">
            <h1>List Container</h1>
        </div>
        <div class="total-order">
            <h1>Total Order:</h1>
            <h1>₱150.00</h1>
        </div>
        
    </div>
    <Button color="primary" size="large" @click="doSomething"> PLACE ORDER </Button>
</template>

<script setup>
import Button from '../base/Button.vue';
</script>

<style scoped>
.price-list{
    width: 100%;
    height: 100%;
    background-color: #CABDBD;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.list-container {
    width: 100%;
    height: 100%;
    padding: 10px;
}

.total-order {
    width: 100%;
    background-color: #645C5C;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    min-height: 20px;
    color: white;
    align-items: center;
    justify-content: space-between;
    display: flex;
}
</style>