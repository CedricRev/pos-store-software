<template>
  <Modal :is-open="isOpen" title="Add Item to Cart" @close="$emit('close')">
    <div class="quantity-selection" v-if="item">
      <div class="item-info">
        <div class="item-details">
          <h4>{{ item.displayname }}</h4>
          <p class="price">₱{{ priceFormatter.format(item.price) }}</p>
        </div>
        <template v-if="editMode">
          <button class="edit-item-button" @click="$emit('edit-item', item)">Edit</button>
          <button class="delete-item-button" @click="$emit('delete-item', item)">Delete</button>
        </template>
      </div>
      <div class="quantity-controls">
        <label for="quantity">Quantity:</label>
        <div class="quantity-input">
          <button @click="decrement" class="qty-btn">-</button>
          <input 
            type="number" 
            id="quantity"
            :value="quantity"
            @input="onInput($event)"
            min="1" 
            class="quantity-field"
          />
          <button @click="increment" class="qty-btn">+</button>
        </div>
      </div>
      <div class="total-preview">
        <p>Total: ₱{{ priceFormatter.format(item.price * quantity) }}</p>
      </div>
      <div class="modal-actions">
        <button @click="$emit('close')" class="cancel-button">Cancel</button>
        <button @click="emitAddToCart" class="add-button">Add Item</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../base/Modal.vue';

const props = defineProps<{
  isOpen: boolean,
  item: any,
  quantity: number,
  editMode: boolean,
}>();

const emit = defineEmits(['close', 'add-to-cart', 'update:quantity', 'edit-item', 'delete-item']);

const priceFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function decrement() {
  if (props.quantity > 1) emit('update:quantity', props.quantity - 1);
}
function increment() {
  emit('update:quantity', props.quantity + 1);
}
function onInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  if (!isNaN(val) && val > 0) emit('update:quantity', val);
}
function emitAddToCart() {
  emit('add-to-cart');
}
</script>

<style scoped>
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
</style> 