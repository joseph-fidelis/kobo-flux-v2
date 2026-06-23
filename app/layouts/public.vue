<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Shield, Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
const { public: { appName } } = useRuntimeConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield :size="16" class="text-white" />
          </div>
          <span class="text-[16px] font-bold tracking-tight text-foreground group-hover:text-white transition-colors">
            {{ appName }}
          </span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/learn-more" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Features
          </NuxtLink>
          <NuxtLink to="/about" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            About
          </NuxtLink>
          <NuxtLink to="/terms" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Terms
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Privacy
          </NuxtLink>
          <NuxtLink to="/auth/login">
            <Button class="h-9 px-5 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
              Access Portal
            </Button>
          </NuxtLink>
        </nav>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <component :is="mobileMenuOpen ? X : Menu" :size="22" />
        </button>
      </div>

      <!-- Mobile Nav -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4">
        <NuxtLink to="/learn-more" class="text-sm text-muted-foreground hover:text-foreground" @click="mobileMenuOpen = false">Features</NuxtLink>
        <NuxtLink to="/about" class="text-sm text-muted-foreground hover:text-foreground" @click="mobileMenuOpen = false">About</NuxtLink>
        <NuxtLink to="/terms" class="text-sm text-muted-foreground hover:text-foreground" @click="mobileMenuOpen = false">Terms</NuxtLink>
        <NuxtLink to="/privacy" class="text-sm text-muted-foreground hover:text-foreground" @click="mobileMenuOpen = false">Privacy</NuxtLink>
        <NuxtLink to="/auth/login" @click="mobileMenuOpen = false">
          <Button class="w-full h-9 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
            Access Portal
          </Button>
        </NuxtLink>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border bg-background">
      <div class="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-6">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield :size="14" class="text-white" />
          </div>
          <span class="text-[14px] font-bold text-muted-foreground">{{ appName }}</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-6">
          <NuxtLink to="/learn-more" class="text-sm text-muted-foreground hover:text-foreground/70 transition-colors">Features</NuxtLink>
          <NuxtLink to="/about" class="text-sm text-muted-foreground hover:text-foreground/70 transition-colors">About Us</NuxtLink>
          <NuxtLink to="/terms" class="text-sm text-muted-foreground hover:text-foreground/70 transition-colors">Terms and Conditions</NuxtLink>
          <NuxtLink to="/privacy" class="text-sm text-muted-foreground hover:text-foreground/70 transition-colors">Privacy Policy</NuxtLink>
        </div>
        <p class="text-sm text-muted-foreground">© 2026 {{ appName }}. All Rights Reserved.</p>
      </div>
    </footer>

  </div>
</template>
