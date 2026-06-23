<template>
  <div>
    <!-- Filter & Search -->
    <div class="bg-card border border-border rounded-xl p-5 mb-5">
      <h3 class="text-[13.5px] font-bold text-foreground mb-4">Filter & Search</h3>
      <div class="flex items-center gap-3 flex-wrap">

        <div class="relative flex-1 max-w-[320px]">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            :value="searchQuery"
            @input="onSearch"
            type="text"
            placeholder="Search by model, weapon #..."
            class="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <Select :model-value="armoryFilter" @update:model-value="onArmoryFilter">
          <SelectTrigger class="bg-muted border border-border rounded-lg text-[13px] text-foreground/70 h-10 focus:ring-0 w-50">
            <SelectValue placeholder="Armory Location" />
          </SelectTrigger>
          <SelectContent class="bg-muted border border-border rounded-lg">
            <SelectItem value=" " class="text-[13px] text-muted-foreground focus:bg-accent cursor-pointer">All Armory</SelectItem>
            <SelectItem v-for="loc in armoryOptions" :key="loc.id" :value="loc.id" class="text-[13px] text-foreground focus:bg-accent cursor-pointer">
              {{ loc.name }} <span v-if="loc.branch" class="text-muted-foreground"> · {{ loc.branch.name }}</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select :model-value="conditionFilter" @update:model-value="onConditionFilter">
          <SelectTrigger class="bg-muted border border-border rounded-lg text-[13px] text-foreground/70 h-10 focus:ring-0 w-50">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent class="bg-muted border border-border rounded-lg">
            <SelectItem value=" " class="text-[13px] text-muted-foreground focus:bg-accent cursor-pointer">All Conditions</SelectItem>
            <SelectItem v-for="f in conditionOptions" :key="f.value" :value="f.value" class="text-[13px] text-foreground focus:bg-accent cursor-pointer">
              {{ f.name }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select :model-value="availabilityFilter" @update:model-value="onAvailabilityFilter">
          <SelectTrigger class="bg-muted border border-border rounded-lg text-[13px] text-foreground/70 h-10 focus:ring-0 w-50">
            <SelectValue placeholder="All Availability" />
          </SelectTrigger>
          <SelectContent class="bg-muted border border-border rounded-lg">
            <SelectItem value=" " class="text-[13px] text-muted-foreground focus:bg-accent cursor-pointer">All Availability</SelectItem>
            <SelectItem v-for="f in availabilityOptions" :key="f.value" :value="f.value" class="text-[13px] text-foreground focus:bg-accent cursor-pointer">
              {{ f.name }}
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>

    <!-- Table -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Barcode</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Make & Model</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Weapon #</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">C.A.R. #</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Availability</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="9" class="px-5 py-14 text-center text-muted-foreground text-sm">Loading...</td>
          </tr>
          <template v-else>
            <tr
              v-for="item in items"
              :key="item.id"
              class="border-b border-border hover:bg-muted transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-[13px] font-mono text-foreground/70">{{ item.barcode }}</span>
                  <Lock v-if="item.is_locked" :size="11" class="text-red-500" />
                </div>
              </td>
              <td class="px-5 py-3.5 text-[13px] text-muted-foreground uppercase">{{ item.type }}</td>
              <td class="px-5 py-3.5 text-[14px] font-semibold text-foreground">{{ item.model }}</td>
              <td class="px-5 py-3.5 text-[13px] font-mono text-foreground/70">{{ item.weapon_no }}</td>
              <td class="px-5 py-3.5 text-[13px] font-mono text-foreground/70">{{ item.car_no }}</td>
              <td class="px-5 py-3.5">
                <div class="flex flex-col gap-0.5">
                  <span class="text-[13px] text-foreground">{{ item.armory_location?.branch?.name ?? '—' }}</span>
                  <span class="text-[11.5px] text-muted-foreground uppercase tracking-wide">{{ item.armory_location?.name ?? '—' }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase" :class="assetConditionClass(item.condition)">
                  {{ item.condition }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase" :class="assetAvailabilityClass(item.availability)">
                  {{ item.availability }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-1">
                  <button title="Preview" @click="emit('open-preview', item)" class="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-950/30 border-none bg-transparent cursor-pointer transition-all">
                    <Eye :size="14" />
                  </button>
                  <button title="Edit" @click="emit('open-edit', item)" class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent border-none bg-transparent cursor-pointer transition-all">
                    <Edit2 :size="14" />
                  </button>
                  <button title="Record Inspection" class="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-950/30 border-none bg-transparent cursor-pointer transition-all">
                    <History :size="14" />
                  </button>
                  <button
                    :title="item.is_locked ? 'Unlock' : 'Lock'"
                    @click="emit('toggle-lock', item)"
                    class="p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-all"
                    :class="item.is_locked ? 'text-red-500 hover:bg-red-950/30' : 'text-emerald-500 hover:bg-emerald-950/30'"
                  >
                    <Lock v-if="item.is_locked" :size="14" />
                    <LockOpen v-else :size="14" />
                  </button>
                  <button title="Dispose" @click="emit('open-disposal', item)" class="p-1.5 rounded-lg text-orange-500 hover:text-orange-400 hover:bg-orange-950/30 border-none bg-transparent cursor-pointer transition-all">
                    <AlertCircle :size="14" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="9" class="px-5 py-14 text-center text-muted-foreground text-sm">No firearms found.</td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-5 py-4 border-t border-border">
        <span class="text-[12px] text-muted-foreground">
          Page {{ currentPage }} of {{ totalPages }} · {{ total }} total
        </span>
        <Pagination
          :page="currentPage"
          :total="total"
          :items-per-page="pageSize"
          :sibling-count="1"
          show-edges
          class="mx-0 w-auto justify-end"
          @update:page="emit('page-change', $event)"
        >
          <PaginationContent v-slot="{ items: pageItems }">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="(pageItem, idx) in pageItems" :key="pageItem.type === 'page' ? pageItem.value : `ellipsis-${idx}`">
              <PaginationItem v-if="pageItem.type === 'page'" :value="pageItem.value" :is-active="pageItem.value === currentPage">
                {{ pageItem.value }}
              </PaginationItem>
              <PaginationEllipsis v-else />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, Edit2, History, Lock, LockOpen, AlertCircle, Search } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrev,
} from '@/components/ui/pagination'
import { assetAvailabilityClass, assetConditionClass } from '~/lib/helpers/background_colors'
import type { FirearmResponse }        from '~/lib/models/Firearm'
import type { BranchResponse }         from '~/lib/models/Branch'
import type { EnumResponse }           from '~/lib/models/util'
import type { ArmoryLocationResponse } from '~/lib/models/ArmoryLocation'

defineProps<{
  items:               FirearmResponse[]
  total:               number
  totalPages:          number
  currentPage:         number
  pageSize:            number
  isLoading:           boolean
  searchQuery:         string
  armoryFilter:        string
  conditionFilter:     string
  availabilityFilter:  string
  // branchOptions:       BranchResponse[]
  armoryOptions:       ArmoryLocationResponse[]
  conditionOptions:    EnumResponse[]
  availabilityOptions: EnumResponse[]
}>()

const emit = defineEmits<{
  'open-preview':              [item: FirearmResponse]
  'open-edit':                 [item: FirearmResponse]
  'open-disposal':             [item: FirearmResponse]
  'toggle-lock':               [item: FirearmResponse]
  'page-change':               [page: number]
  'update:searchQuery':        [val: string]
  'update:branchFilter':       [val: string]
  'update:armoryFilter':       [val: string]
  'update:conditionFilter':    [val: string]
  'update:availabilityFilter': [val: string]
}>()


function onSearch(e: Event) {
  emit('update:searchQuery', (e.target as HTMLInputElement).value)
}

function onArmoryFilter(val: any) {
  emit('update:armoryFilter', String(val ?? ''))
}

function onConditionFilter(val: any) {
  emit('update:conditionFilter', String(val ?? ''))
}

function onAvailabilityFilter(val: any) {
  emit('update:availabilityFilter', String(val ?? ''))
}
</script>