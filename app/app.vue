<template>
    <div>
    <NuxtLayout>
        <!-- <NuxtLoadingIndicator /> -->
        <NuxtPage />
    </NuxtLayout>
    <Toaster
      position="top-right"
      :toastOptions="{
        classes: {
          error: '!bg-red-600 !border-red-500 !text-white [&_[data-description]]:!text-red-100',
          success: '!bg-green-600 !border-green-500 !text-white [&_[data-description]]:!text-green-100',
          
        }
      }"
    />
    </div>
</template>
<script setup lang="ts">
import { Toaster } from "vue-sonner";
import 'vue-sonner/style.css';
</script>