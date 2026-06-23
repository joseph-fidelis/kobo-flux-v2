<!-- /layouts/app.vue -->
<script setup lang="ts">
import AppSidebar from '@/components/app-specific/AppSidebar.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, LogOut, User } from 'lucide-vue-next'
import { useAuth } from '~/composables/auth/useAuth'
import { useUserStore } from '~/stores/user'




const { logout: handleSignOut } = useAuth()
const { currentUser } = useUserStore()

const notifications = [
  {
    id: '1',
    title: 'Firearm Handover Request',
    message: 'SP001 has requested firearm SN-2024-001 for duty assignment.',
    read: false,
    created_at: '2026-03-18 08:32',
  },
  {
    id: '2',
    title: 'Low Ammunition Alert',
    message: '9mm Parabellum stock at Main Armoury is below minimum threshold (45 rounds remaining).',
    read: false,
    created_at: '2026-03-18 07:15',
  },
  {
    id: '3',
    title: 'Firearm Return Confirmed',
    message: 'SP003 has returned pistol SN-2024-007. Condition: Good.',
    read: false,
    created_at: '2026-03-17 22:10',
  },
  {
    id: '4',
    title: 'New User Created',
    message: 'Security personnel account for J. Mwangi (SP006) has been created.',
    read: true,
    created_at: '2026-03-17 14:05',
  },
  {
    id: '5',
    title: 'Maintenance Overdue',
    message: 'Rifle SN-2024-012 is overdue for scheduled maintenance since 2026-03-10.',
    read: true,
    created_at: '2026-03-17 09:00',
  },
]

const unread = notifications.filter(n => !n.read).length

</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset class="bg-background">

      <!-- Header -->
      <header class="flex  shrink-0 items-center justify-between bg-background border-b border-border px-3 py-3">

        <!-- Left: trigger + logo -->
        <div class="flex items-center gap-">
          <SidebarTrigger
            class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-all border-none bg-transparent cursor-pointer"
          />
          <Separator orientation="vertical" class="h-4 bg-muted" />
        </div>

        <!-- Right: notifications + user info + sign out -->
        <div class="flex items-center gap-3">

          <!-- Notification bell -->
          <DropdownMenu @update:open="open => open">
            <DropdownMenuTrigger as-child>
              <button class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-slate-600 transition-all cursor-pointer">
                <Bell :size="15" />
                <span
                  v-if="unread > 0"
                  class="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center leading-none"
                >
                  {{ unread > 99 ? '99+' : unread }}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              class="w-80 bg-card border-border p-0 overflow-hidden"
            >
              <DropdownMenuLabel class="px-4 py-3 text-[13px] font-semibold text-foreground border-b border-border">
                Notifications
              </DropdownMenuLabel>
              <div class="max-h-80 overflow-y-auto">
                <template v-if="notifications.length">
                  <DropdownMenuItem
                    v-for="n in notifications"
                    :key="n.id"
                    class="flex flex-col items-start gap-0.5 px-4 py-3 cursor-default border-b border-border last:border-0 focus:bg-muted"
                    :class="!n.read ? 'bg-blue-600/5' : ''"
                  >
                    <div class="flex items-center gap-2 w-full">
                      <span class="text-[12px] font-semibold text-foreground flex-1">{{ n.title }}</span>
                      <span v-if="!n.read" class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    </div>
                    <span class="text-[12px] text-muted-foreground leading-snug">{{ n.message }}</span>
                    <span class="text-[11px] text-muted-foreground mt-0.5">{{ n.created_at }}</span>
                  </DropdownMenuItem>
                </template>
                <div v-else class="px-4 py-6 text-center text-[13px] text-muted-foreground">
                  No notifications
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- User pill -->
          <div class="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2">
            <div class="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0">
              <User :size="14" class="text-blue-400" />
            </div>
            <div class="flex flex-col gap-px">
              <span class="text-[14px] font-semibold text-foreground mb-2 leading-none">{{ currentUser?.username }}</span>
              <span class="text-[10.5px] text-muted-foreground leading-none">{{ currentUser?.role.name }}</span>
            </div>
          </div>

          <!-- Sign out button -->
          <button
            class="flex items-center gap-2 bg-transparent text-muted-foreground hover:text-foreground hover:border-slate-600 hover:bg-card rounded-xl px-3 py-2 text-[13px] font-medium cursor-pointer transition-all whitespace-nowrap"
            @click="handleSignOut"
          >
            <LogOut :size="14" />
            Sign Out
          </button>
        </div>

      </header>

      <!-- Page content -->
      <div class="flex flex-1 flex-col bg-background">
        <slot />
      </div>

    </SidebarInset>
  </SidebarProvider>
</template>