
<template>
  <div class="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">

    <!-- Hero -->
    <div class="flex flex-col gap-4 max-w-2xl">
      <h1 class="text-4xl font-black tracking-tight text-foreground leading-tight">
        About the<br>
        <span class="text-blue-500">Tactical Armory System</span>
      </h1>
      <p class="text-lg text-muted-foreground leading-relaxed">
        A purpose-built platform for managing firearms, ammunition, and security operations across all branches of the organization.
      </p>
    </div>

    <!-- Mission -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
          <Shield :size="18" class="text-blue-400" />
        </div>
        <div class="text-[15px] font-semibold text-foreground">Our Mission</div>
        <p class="text-[13.5px] text-muted-foreground leading-relaxed">
          To provide a secure, auditable, and efficient system for tracking all firearms and security equipment — ensuring accountability at every stage of the weapons lifecycle.
        </p>
      </div>
      <div class="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
          <Target :size="18" class="text-emerald-400" />
        </div>
        <div class="text-[15px] font-semibold text-foreground">Our Goal</div>
        <p class="text-[13.5px] text-muted-foreground leading-relaxed">
          Eliminate manual record-keeping errors, prevent unauthorized access to armoury assets, and give management real-time visibility into firearms operations across all 7 branches.
        </p>
      </div>
      <div class="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
          <Users :size="18" class="text-purple-400" />
        </div>
        <div class="text-[15px] font-semibold text-foreground">Who We Serve</div>
        <p class="text-[13.5px] text-muted-foreground leading-relaxed">
          Designed for internal security management teams — from system administrators and armoury keepers to security personnel and branch information security officers.
        </p>
      </div>
    </div>

    <!-- System Overview -->
    <div class="flex flex-col gap-6">
      <h2 class="text-[22px] font-bold text-foreground">System Overview</h2>
      <div class="bg-card border border-border rounded-xl p-7 flex flex-col gap-5">
        <p class="text-[14px] text-muted-foreground leading-relaxed">
          The Tactical Armory System is a comprehensive management platform that covers the full lifecycle of firearm and security operations. It provides role-based access to armoury management, personnel deployment planning, ammunition tracking, incident logging, and compliance reporting.
        </p>
        <p class="text-[14px] text-muted-foreground leading-relaxed">
          Every critical action in the system — from registering a new firearm to issuing it to security personnel — is subject to approval workflows and verification steps, ensuring a complete audit trail.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div class="flex flex-col gap-1">
            <span class="text-[28px] font-bold text-blue-400 leading-none">7</span>
            <span class="text-[12px] text-muted-foreground">Branch Locations</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[28px] font-bold text-purple-400 leading-none">8</span>
            <span class="text-[12px] text-muted-foreground">User Roles</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[28px] font-bold text-emerald-400 leading-none">15</span>
            <span class="text-[12px] text-muted-foreground">Management Screens</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[28px] font-bold text-orange-400 leading-none">OTP</span>
            <span class="text-[12px] text-muted-foreground">Secured Issuance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Branches -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-2">
        <Building2 :size="18" class="text-muted-foreground" />
        <h2 class="text-[18px] font-bold text-foreground">Branch Network</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="(branch, i) in [
            { name: 'Dodoma HQ', type: 'Head Office', note: 'Primary armoury and system administration' },
            { name: 'Dar es Salaam Sub-HQ', type: 'Sub-Headquarters', note: 'Largest operational branch' },
            { name: 'Arusha Branch', type: 'Regional Branch', note: 'Northern zone operations' },
            { name: 'Mbeya Branch', type: 'Regional Branch', note: 'Southern highlands operations' },
            { name: 'Mtwara Branch', type: 'Regional Branch', note: 'Southern coastal operations' },
            { name: 'Mwanza Branch', type: 'Regional Branch', note: 'Lake zone operations' },
            { name: 'Zanzibar Sub-HQ', type: 'Sub-Headquarters', note: 'Island zone operations' },
          ]"
          :key="branch.name"
          class="bg-muted border border-border rounded-lg px-5 py-4 flex items-start gap-3"
        >
          <span class="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[11px] font-bold text-blue-400 shrink-0 mt-0.5">
            {{ i + 1 }}
          </span>
          <div class="flex flex-col gap-0.5">
            <div class="text-[14px] font-semibold text-foreground">{{ branch.name }}</div>
            <div class="text-[12px] text-blue-400 font-medium">{{ branch.type }}</div>
            <div class="text-[12px] text-muted-foreground">{{ branch.note }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="flex flex-col items-center gap-5 py-4 text-center border-t border-border pt-10">
      <p class="text-[15px] text-muted-foreground">Have questions about the system? Contact your branch administrator.</p>
      <NuxtLink to="/auth/login">
        <Button class="h-11 px-6 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer gap-2">
          Access Portal
          <ArrowRight :size="15" />
        </Button>
      </NuxtLink>
    </div>

  </div>
</template>


<script setup lang="ts">
import { Shield, Target, Users, Building2, ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'public' })
</script>
