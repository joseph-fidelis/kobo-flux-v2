
<template>
  <div class="max-w-6xl mx-auto px-6">

    <!-- Hero Section -->
    <div class="py-24 flex flex-col gap-8 max-w-3xl">
      <div class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 w-fit">
        <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
        <span class="text-xs text-blue-400 font-semibold tracking-wide">Secure · Official · Monitored</span>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
          Official Firearm<br>
          <span class="text-blue-500">Management</span> Portal
        </h1>
        <p class="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Securely manage, register, and track firearm records across all branches — from armoury management to personnel deployment.
        </p>
      </div>

      <div class="flex items-center gap-4">
        <NuxtLink to="/auth/login">
          <Button class="h-12 px-6 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer gap-2">
            Access Portal
            <ArrowRight :size="16" />
          </Button>
        </NuxtLink>
        <NuxtLink to="/learn-more">
          <Button
            variant="outline"
            class="h-12 px-6 text-base font-bold border-border text-muted-foreground hover:text-foreground hover:border-slate-600 bg-transparent cursor-pointer"
          >
            Learn More
          </Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Feature Highlights -->
    <div class="pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
          <Shield :size="18" class="text-blue-400" />
        </div>
        <div>
          <div class="text-[14px] font-semibold text-foreground mb-1">Arms Register</div>
          <div class="text-[13px] text-muted-foreground leading-relaxed">Centralized registry of all firearms with full approval workflows.</div>
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
          <Users :size="18" class="text-purple-400" />
        </div>
        <div>
          <div class="text-[14px] font-semibold text-foreground mb-1">SP Deployment</div>
          <div class="text-[13px] text-muted-foreground leading-relaxed">Plan and monitor security personnel duty rosters across all branches.</div>
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
          <Lock :size="18" class="text-emerald-400" />
        </div>
        <div>
          <div class="text-[14px] font-semibold text-foreground mb-1">OTP-Gated Issuance</div>
          <div class="text-[13px] text-muted-foreground leading-relaxed">Firearm handover secured with one-time password verification.</div>
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div class="w-9 h-9 rounded-lg bg-orange-600/15 border border-orange-500/20 flex items-center justify-center">
          <BarChart3 :size="18" class="text-orange-400" />
        </div>
        <div>
          <div class="text-[14px] font-semibold text-foreground mb-1">Reports & Analytics</div>
          <div class="text-[13px] text-muted-foreground leading-relaxed">Generate comprehensive reports on inventory, activity, and audit logs.</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Shield, Lock, BarChart3, Users, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'public' })
</script>
