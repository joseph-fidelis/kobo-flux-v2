<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="flex flex-col items-center text-center max-w-md w-full">

      <!-- Icon -->
      <div class="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-900/40 flex items-center justify-center mb-6">
        <ShieldOff :size="38" class="text-red-500" />
      </div>

      <!-- Code -->
      <span class="text-[11px] font-bold tracking-widest uppercase text-red-500/70 mb-3">Error 403</span>

      <!-- Heading -->
      <h1 class="text-[28px] font-black text-foreground -tracking-[0.5px] mb-3 leading-tight">
        Access Denied
      </h1>

      <!-- Description -->
      <p class="text-[14px] text-muted-foreground leading-relaxed mb-8">
        You do not have the required permissions to view this page.
        Contact your system administrator if you believe this is a mistake.
      </p>

      <!-- Divider -->
      <div class="w-full border-t border-border mb-8" />

      <!-- Role info -->
      <div class="w-full bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 mb-8 text-left">
        <div class="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
          <Lock :size="16" class="text-muted-foreground" />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[12px] font-semibold text-muted-foreground">Your current role</span>
          <span class="text-[13px] font-bold text-foreground">{{ userRole }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 w-full">
        <button
          @click="$router.back()"
          class="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-transparent text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:border-slate-600 transition-colors cursor-pointer">
          <ArrowLeft :size="14" />
          Go Back
        </button>
        <NuxtLink to="/admin/dashboard" class="flex-1">
          <button class="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 border-none text-[13px] font-semibold text-white transition-colors cursor-pointer">
            <LayoutDashboard :size="14" />
            Dashboard
          </button>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-layout' })

import { ShieldOff, Lock, ArrowLeft, LayoutDashboard } from 'lucide-vue-next'

// Replace with actual user store once wired up
const userRole = 'SP — Security Personnel'
</script>
