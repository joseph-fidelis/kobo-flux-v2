<template>
  <div class="p-6 min-h-screen bg-background text-foreground font-sans">

    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground -tracking-[0.3px] mb-1">Roles</h1>
        <p class="text-sm text-muted-foreground">Define access roles and assign permissions for the system</p>
      </div>
      <button
        @click="openAdd"
        class="flex items-center gap-1.5 bg-blue-600 text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        <Plus :size="14" />
        Add Role
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-5">
      <div class="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-xs text-muted-foreground font-medium">Total Roles</span>
          <span class="text-[28px] font-bold text-foreground leading-none">{{ roleList.length }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-950/40 text-blue-500 border border-blue-500/25">
          <Shield :size="22" />
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-xs text-muted-foreground font-medium">System Roles</span>
          <span class="text-[28px] font-bold text-foreground leading-none">{{ systemCount }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-950/40 text-purple-400 border border-purple-500/25">
          <Lock :size="22" />
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-xs text-muted-foreground font-medium">Custom Roles</span>
          <span class="text-[28px] font-bold text-foreground leading-none">{{ customCount }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-950/40 text-emerald-500 border border-emerald-500/25">
          <UserCog :size="22" />
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-card border border-border rounded-xl px-4 py-3 flex gap-3 items-center mb-5">
      <div class="relative flex-1">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="Search roles by name, abbreviation, or description..."
          class="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-[13px] text-foreground placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>

    <!-- Roles List -->
    <div class="bg-card border border-border rounded-xl">
      <div class="px-6 py-4 border-b border-border">
        <h3 class="text-[14px] font-semibold text-foreground">
          All Roles <span class="text-muted-foreground font-normal">({{ roleList.length }})</span>
        </h3>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="p-3 flex flex-col gap-2">
        <div v-for="i in 6" :key="i" class="h-16 bg-muted border border-border rounded-xl animate-pulse" />
      </div>

      <div v-else class="p-3 flex flex-col gap-2">
        <div
          v-for="role in roleList"
          :key="role.id"
          class="flex items-center gap-4 px-5 py-4 bg-muted border border-border rounded-xl hover:border-slate-600/50 transition-colors"
        >
          <!-- Abbreviation badge -->
          <div class="shrink-0 w-24">
            <span
              class="inline-flex items-center px-2.5 py-1 uppercase rounded-md text-[10.5px] font-bold tracking-wide border"
              :style="{
                background:  getRoleStyle(role.abbreviation).background,
                color:       getRoleStyle(role.abbreviation).color,
                borderColor: getRoleStyle(role.abbreviation).borderColor,
              }"
            >
              {{ role.abbreviation }}
            </span>
          </div>

          <!-- Name + Description -->
          <div class="flex flex-col ml-4 gap-0.5 min-w-0" style="flex: 1.5">
            <span class="text-[14px] font-semibold text-foreground">{{ role.name }}</span>
            <span class="text-[12px] text-muted-foreground truncate">{{ role.description }}</span>
          </div>

          <!-- Permissions count -->
          <div class="flex flex-col gap-0.5" style="flex: 0.5">
            <span class="text-[11px] text-muted-foreground font-medium">Permissions</span>
            <span class="text-[13px] font-semibold text-foreground">{{ role.permissions?.length ?? 0 }}</span>
          </div>

          <!-- Type badge -->
          <div class="flex flex-col gap-0.5" style="flex: 0.6">
            <span class="text-[11px] text-muted-foreground font-medium">Type</span>
            <span
              class="inline-flex self-start items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold tracking-wide mt-0.5"
              :class="role.is_system
                ? 'bg-purple-950/60 text-purple-400 border border-purple-700/50'
                : 'bg-muted text-muted-foreground border border-slate-700/60'"
            >
              {{ role.is_system ? 'SYSTEM' : 'CUSTOM' }}
            </span>
          </div>

          <!-- Permission slug previews -->
          <div class="flex items-center gap-1 flex-wrap" style="flex: 1.8">
            <span
              v-for="perm in role.permissions?.slice(0, 4)"
              :key="perm.id"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-background text-muted-foreground border border-border"
            >
              {{ perm.slug }}
            </span>
            <span v-if="(role.permissions?.length ?? 0) > 4" class="text-[10px] text-muted-foreground">
              +{{ (role.permissions?.length ?? 0) - 4 }} more
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 ml-auto shrink-0">
            <Button
              @click="openEdit(role)"
              title="Edit permissions & details"
              
              class="flex items-center justify-center p-1.5 rounded-md bg-transparent border-none text-muted-foreground hover:text-foreground/70 hover:bg-accent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <PenSquare :size="15" />
            </button>
            <button :disabled="role.is_system"
              @click="promptDelete(role)"
              title="Delete"
              
              class="flex items-center justify-center p-1.5 rounded-md bg-transparent border-none text-muted-foreground hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 :size="15" />
            </button>
          </div>
        </div>

        <div v-if="!isLoading && roleList.length === 0" class="py-12 text-center text-muted-foreground text-sm">
          No roles found.
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <RoleModal
      :is-open="showModal"
      :initial="currentRole"
      @update:is-open="showModal = $event"
      @confirm="handleConfirm"
    />

    <!-- Delete Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="bg-card border border-border text-foreground max-w-sm rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle class="text-[17px] font-bold text-foreground">Delete Role</DialogTitle>
          <DialogDescription class="text-[13px] text-muted-foreground">
            Are you sure you want to delete the role
            <span class="font-semibold text-foreground/70">{{ currentRole?.name }}</span>?
            This will remove all user assignments for this role. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-3 pt-2">
          <button
            @click="showDeleteDialog = false"
            class="flex-1 px-4 py-2.5 rounded-lg bg-transparent text-muted-foreground text-[13px] font-semibold cursor-pointer border border-border hover:border-slate-600 hover:text-foreground transition-colors"
          >Cancel</button>
          <button
            @click="deleteRole"
            :disabled="isLoading"
            class="flex-1 px-4 py-2.5 rounded-lg bg-red-700 text-white text-[13px] font-semibold cursor-pointer border-none hover:bg-red-800 transition-colors disabled:opacity-60"
          >Delete</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-layout' })

import { computed, onMounted } from 'vue'
import { Plus, Search, Shield, Lock, UserCog, PenSquare, Trash2 } from 'lucide-vue-next'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import RoleModal from '@/components/app-specific/dialogs/roles/RoleModal.vue'
import { useRole } from '~/composables/role/useRole'
import { getRoleStyle } from '~/lib/utils'

const {
  roleList, isLoading,
  searchQuery, currentRole, showModal, showDeleteDialog,
  fetchRoles, openAdd, openEdit, promptDelete, handleConfirm, deleteRole,
} = useRole()

onMounted(() => fetchRoles())

const systemCount = computed(() => roleList.value.filter(r => r.is_system).length)
const customCount = computed(() => roleList.value.filter(r => !r.is_system).length)


</script>
