import { createApp } from "vue";
import App from "./App.vue";
import { enable } from '@tauri-apps/plugin-autostart';
// import { loadDatabase } from "./scripts/sqlite";

await enable();

createApp(App).mount("#app");

// async function setup() {
//     await loadDatabase()
// }

// window.addEventListener("DOMContentLoaded", () => {
//     setup()
// });