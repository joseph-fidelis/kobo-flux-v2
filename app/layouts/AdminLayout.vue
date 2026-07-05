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

        
          <DropdownMenu @update:open="open => open">
          
            <DropdownMenuContent
              align="end"
              class="w-80 bg-card border-border p-0 overflow-hidden"
            >
              <DropdownMenuLabel class="px-4 py-3 text-[13px] font-semibold text-foreground border-b border-border">
                User
              </DropdownMenuLabel>
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </header>

      <!-- Page content -->
      <div class="flex flex-1 flex-col bg-background">
        <slot />
      </div>

    </SidebarInset>
  </SidebarProvider>
</template>