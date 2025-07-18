<template>
    <div class="price-list">
        <div class="list-container">
            <h3>Cart Items</h3>
            <div v-if="cartItems.length === 0" class="empty-cart">
                <p>No items in cart</p>
                <p>Add items from the main section</p>
            </div>
            <div v-else class="cart-items">
                <div 
                    v-for="(cartItem, index) in cartItems" 
                    :key="index"
                    class="cart-item"
                >
                    <div class="item-info">
                        <div class="item-details">
                            <span class="item-name">{{ cartItem.item.displayname }}</span>
                            <span class="item-price">₱{{ cartItem.item.price }} x {{ cartItem.quantity }}</span>
                        </div>
                    </div>
                    <div class="item-total">
                        ₱{{ (cartItem.item.price * cartItem.quantity).toFixed(2) }}
                    </div>
                    <button @click="removeFromCart(index)" class="remove-btn">×</button>
                </div>
            </div>
        </div>
        <div class="total-order">
            <h3>Total Order:</h3>
            <h3>₱{{ totalPrice.toFixed(2) }}</h3>
        </div>
    </div>
    <Button color="primary" size="large" @click="placeOrder" :disabled="cartItems.length === 0">
        PLACE ORDER
    </Button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Button from '../base/Button.vue';

interface CartItem {
    item: {
        id: string;
        displayname: string;
        price: number;
        categories: string[];
    };
    quantity: number;
}

const cartItems = ref<CartItem[]>([]);

const totalPrice = computed(() => {
    return cartItems.value.reduce((total, cartItem) => {
        return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
});

const addToCart = (event: CustomEvent) => {
    const { item, quantity } = event.detail;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.value.findIndex(cartItem => cartItem.item.id === item.id);
    
    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cartItems.value[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cartItems.value.push({ item, quantity });
    }
};

const removeFromCart = (index: number) => {
    cartItems.value.splice(index, 1);
};

const placeOrder = () => {
    if (cartItems.value.length > 0) {
        alert(`Order placed! Total: ₱${totalPrice.value.toFixed(2)}`);
        cartItems.value = [];
    }
};

onMounted(() => {
    window.addEventListener('add-to-cart', addToCart as EventListener);
});

onUnmounted(() => {
    window.removeEventListener('add-to-cart', addToCart as EventListener);
});
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
    display: flex;
    flex-direction: column;
    height: 100%;
}

.list-container h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.2rem;
}

.empty-cart {
    text-align: center;
    color: #666;
    padding: 20px;
}

.empty-cart p {
    margin: 5px 0;
    font-size: 0.9rem;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1 1 auto;
    min-height: 0;
    max-height: 300px;
    overflow-y: auto;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #ddd;
    position: relative;
}

.item-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.cart-item-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
    background: #eee;
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.item-name {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
}

.item-price {
    color: #666;
    font-size: 0.8rem;
}

.item-total {
    font-weight: 600;
    color: #4CAF50;
    font-size: 0.9rem;
}

.remove-btn {
    background: none;
    border: none;
    color: #f44336;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.remove-btn:hover {
    background-color: #ffebee;
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