<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
import type { SidebarProps } from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  File,
  FormIcon
} from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const props = defineProps<SidebarProps>()

const { public: { appName } } = useRuntimeConfig()

const navGroups = [
  {
    label: "MASTER DATA",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Forms", url: "/forms", icon: FormIcon },
      // { title: "Submissions", url: "/submissions", icon: File },
      { title: "Users", url: "/users", icon: Users },
    ],
  },
]

function isNavActive(url: string) {
  if (url === "/") return route.path === "/"
  return route.path === url || route.path.startsWith(`${url}/`)
}
</script>

<template>
  <Sidebar
    v-bind="props"
    collapsible="icon"
    class="*:data-[sidebar=sidebar]:bg-background *:data-[sidebar=sidebar]:border-r *:data-[sidebar=sidebar]:border-border *:data-[sidebar=sidebar]:w-65 *:data-[sidebar=sidebar]:overflow-x-hidden"
  >
    <!-- Header / Logo -->
    <SidebarHeader class="px-3 pt-4 pb-3">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/" class="flex items-center gap-3 no-underline">
              <div class="w-9 h-9 rounded-[10px] bg-blue-600 flex items-center justify-center shrink-0">
                <span class="text-base font-extrabold text-white">A</span>
              </div>
              <div class="flex flex-col gap-px overflow-hidden group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                <span class="text-[14px] font-bold text-foreground whitespace-nowrap">{{ appName }}</span>
                <!-- <span class="text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">Comprehensive Management Pla...</span> -->
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Nav Groups -->
    <SidebarContent class="px-2 py-1 overflow-x-hidden">
      <template v-for="(group, gi) in navGroups" :key="group.label">

        <SidebarGroup class="py-2 px-0">
          <SidebarGroupLabel
            class="text-[10.5px]! font-bold! tracking-[0.8px]! text-muted-foreground! uppercase! px-2 pb-1.5 group-data-[collapsible=icon]/sidebar-wrapper:hidden"
          >
            {{ group.label }}
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.title">
              <SidebarMenuButton
                  as-child
                  :class="isNavActive(item.url) ? 'bg-[#2B7FFF1A]! text-blue-500' : ''"
                  class="p-0! h-auto! px-3 py-3 hover:bg-card! border-border"
                >
               <NuxtLink
                  :to="item.url"
                  :class="[
                    'flex items-center gap-3 px-4 h-10 min-h-10 w-full rounded-sm no-underline hover:text-foreground',
                    isNavActive(item.url) ? 'text-blue-500' : 'text-muted-foreground'
                  ]"
                >
                  <component
                    :is="item.icon"
                    class="w-4.25 h-4.25 shrink-0 ml-1.25"
                    style="stroke-width: 1.8"
                  />
                  <span class="text-sm font-medium group-data-[collapsible=icon]/sidebar-wrapper:hidden">{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator
          v-if="gi < navGroups.length - 1"
          class="bg-muted! mx-2! group-data-[collapsible=icon]/sidebar-wrapper:hidden"
        />
      </template>
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>