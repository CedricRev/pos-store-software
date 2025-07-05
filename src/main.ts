import { createApp } from "vue";
import App from "./App.vue";
import { loadDatabase } from "./scripts/sqlite";

createApp(App).mount("#app");

async function setup() {
    await loadDatabase()
}

window.addEventListener("DOMContentLoaded", () => {
    setup()
});