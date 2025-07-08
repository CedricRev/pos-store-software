<script setup lang="ts">
import MainSection from "./layout/MainSection.vue";
import SidebarSection from "./layout/SidebarSection.vue";
import { onMounted } from "vue";
import { enable } from "@tauri-apps/plugin-autostart";

onMounted(async () => {
  try {
    await enable();
  } catch (e) {
    console.error('Failed to enable autostart:', e);
  }
})
</script>

<template>
  <div class="container">
    <MainSection />
    <SidebarSection />
  </div>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: clamp(13px, 1vw, 18px);
  line-height: 24px;
  font-weight: 400;

  color: #000;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  height: 100vh;
  width: 100vw;
}

</style>