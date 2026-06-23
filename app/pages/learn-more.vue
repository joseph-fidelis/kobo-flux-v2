<script setup lang="ts">
import {
  Shield, Users, Package, MapPin, ClipboardList,
  Lock, BarChart3, BookOpen, CheckCircle, ArrowRight,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'public' })

const features = [
  {
    icon: Shield,
    color: 'blue',
    title: 'Arms Register',
    description: 'Centralized registry of all firearms with barcode tracking, condition monitoring, and a full BISO → MIS/AMIS approval workflow before any firearm enters service.',
    points: ['Barcode & weapon number tracking', 'Condition & availability status', 'Pending approval workflow', 'Photograph upload support'],
  },
  {
    icon: Package,
    color: 'orange',
    title: 'Ammunition Management',
    description: 'Track ammunition inventory by type, batch, and armoury location. Get automatic low-stock and critical-level alerts across all branches.',
    points: ['Batch/lot number tracking', 'MAIN & SUB armoury separation', 'Low stock & critical alerts', 'Branch-to-branch transfer requests'],
  },
  {
    icon: Lock,
    color: 'emerald',
    title: 'OTP-Gated Firearm Issuance',
    description: 'Every firearm handover is secured with a one-time password verification step, creating an auditable chain of custody from armoury to security personnel.',
    points: ['6-digit OTP verification', 'Deployment-linked issuance', 'Ammo count tracked per issue', 'Full return recording'],
  },
  {
    icon: Users,
    color: 'purple',
    title: 'SP Deployment Management',
    description: 'Plan, schedule, and monitor security personnel duty rosters. Track active deployments in real time and manage shift assignments across all branches.',
    points: ['Shift scheduling & duty types', 'Active / Scheduled / Completed views', 'Branch-level roster management', 'Deployment replacement workflow'],
  },
  {
    icon: MapPin,
    color: 'amber',
    title: 'Location Registry',
    description: 'Define in-office and out-of-office deployment locations. Link locations to branches and use them as assignment targets for handovers and deployments.',
    points: ['In-office & out-of-office types', 'Branch-specific locations', 'Used in handover assignments', 'Server Room, VIP Protection, etc.'],
  },
  {
    icon: ClipboardList,
    color: 'red',
    title: 'Occurrence Book & Inspections',
    description: 'Log security incidents, planned shifts, and equipment issues. Record inspection findings with BISO instructions and inspection status tracking.',
    points: ['Planned shift, emergency, security logs', 'BISO response workflow', 'Scheduled / surprise / quarterly inspections', 'OK / NOT_OK status per inspection'],
  },
  {
    icon: BookOpen,
    color: 'blue',
    title: 'Security Devices Registry',
    description: 'Register and track non-firearm security equipment — metal detectors, CCTV, access control systems — with inspection scheduling and status monitoring.',
    points: ['Device type & purpose tracking', 'Branch & location assignment', 'Inspection due date alerts', 'GOOD / MALFUNCTION / MAINTENANCE status'],
  },
  {
    icon: BarChart3,
    color: 'orange',
    title: 'Reports & Analytics',
    description: 'Generate downloadable PDF reports on firearms, ammunition, handover history, and audit logs. Filter by branch, date range, and report type.',
    points: ['Firearms asset register', 'Ammo consumption & discrepancy', 'Malfunction & maintenance history', 'User activity & audit logs'],
  },
]

const colorMap: Record<string, string> = {
  blue:   'bg-blue-600/15 border-blue-500/20 text-blue-400',
  orange: 'bg-orange-600/15 border-orange-500/20 text-orange-400',
  emerald:'bg-emerald-600/15 border-emerald-500/20 text-emerald-400',
  purple: 'bg-purple-600/15 border-purple-500/20 text-purple-400',
  amber:  'bg-amber-600/15 border-amber-500/20 text-amber-400',
  red:    'bg-red-600/15 border-red-500/20 text-red-400',
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">

    <!-- Page Header -->
    <div class="flex flex-col gap-4 max-w-2xl">
      <h1 class="text-4xl font-black tracking-tight text-foreground leading-tight">
        Everything you need to manage<br>
        <span class="text-blue-500">armoury operations</span>
      </h1>
      <p class="text-lg text-muted-foreground leading-relaxed">
        The Tactical Armory System is a comprehensive platform built for the complete lifecycle of firearms management — from registration to deployment, handover to return.
      </p>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="f in features"
        :key="f.title"
        class="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0" :class="colorMap[f.color]">
            <component :is="f.icon" :size="18" />
          </div>
          <span class="text-[15px] font-semibold text-foreground">{{ f.title }}</span>
        </div>
        <p class="text-[13.5px] text-muted-foreground leading-relaxed">{{ f.description }}</p>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="point in f.points"
            :key="point"
            class="flex items-center gap-2 text-[13px] text-muted-foreground"
          >
            <CheckCircle :size="13" class="text-emerald-500 shrink-0" />
            {{ point }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Roles Section -->
    <div class="bg-card border border-border rounded-xl p-8 flex flex-col gap-6">
      <div>
        <h2 class="text-[20px] font-bold text-foreground mb-2">Role-based access control</h2>
        <p class="text-[14px] text-muted-foreground">Eight distinct roles ensure every user sees and does only what they're authorized for.</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="role in [
          { code: 'SYSTEM_ADMIN', label: 'System Administrator' },
          { code: 'MIS', label: 'Manager Internal Security' },
          { code: 'AMIS', label: 'Asst. Manager Internal Security' },
          { code: 'BISO', label: 'Branch Information Security Officer' },
          { code: 'MAK', label: 'Main Armoury Keeper' },
          { code: 'AK', label: 'Armoury Keeper' },
          { code: 'SP', label: 'Security Personnel' },
          { code: 'AUDITOR', label: 'Auditor' },
        ]" :key="role.code" class="bg-muted border border-border rounded-lg px-4 py-3">
          <div class="text-[11px] font-bold text-blue-400 tracking-wider mb-1">{{ role.code }}</div>
          <div class="text-[12px] text-muted-foreground">{{ role.label }}</div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="flex flex-col items-center gap-5 py-6 text-center">
      <h2 class="text-[22px] font-bold text-foreground">Ready to get started?</h2>
      <p class="text-[14px] text-muted-foreground max-w-md">Access the portal using your assigned credentials. Contact your system administrator if you need access.</p>
      <NuxtLink to="/auth/login">
        <Button class="h-11 px-6 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer gap-2">
          Access Portal
          <ArrowRight :size="15" />
        </Button>
      </NuxtLink>
    </div>

  </div>
</template>
