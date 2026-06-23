<template>
  <div>
    <!-- Filter -->
    <div class="bg-card border border-border rounded-xl p-5 mb-5">
      <h3 class="text-[13.5px] font-bold text-foreground mb-4">Filter & Search</h3>
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-[320px]">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search armory locations..."
            class="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <Select :model-value="branchFilter" @update:model-value="(val: any) => $emit('update:branchFilter', String(val ?? ''))">
          <SelectTrigger class="bg-muted border border-border rounded-lg text-[13px] text-foreground/70 h-10 focus:ring-0 w-50">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent class="bg-muted border border-border rounded-lg">
            <SelectItem value=" " class="text-[13px] text-muted-foreground focus:bg-accent cursor-pointer">All Branches</SelectItem>
            <SelectItem v-for="b in branchOptions" :key="b.id" :value="b.id" class="text-[13px] text-foreground focus:bg-accent cursor-pointer">
              {{ b.name }}
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
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">#</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Armory Name</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Branch</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Created</th>
            <th class="text-left px-5 py-3.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in items"
            :key="item.id"
            class="border-b border-border hover:bg-muted transition-colors"
          >
            <td class="px-5 py-3.5 text-[13px] text-muted-foreground">
              {{ (currentPage - 1) * pageSize + idx + 1 }}
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-600/20 flex items-center justify-center shrink-0">
                  <Warehouse :size="13" class="text-blue-400" />
                </div>
                <span class="text-[14px] font-semibold text-foreground">{{ item.name }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[13px] text-foreground">{{ item.branch?.name ?? '—' }}</td>
            <td class="px-5 py-3.5 text-[13px] text-muted-foreground">{{ formatDate(item.created_at) }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-1">
                <button title="Edit" @click="$emit('open-edit', item)" class="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-950/30 border-none bg-transparent cursor-pointer transition-all">
                  <Edit2 :size="14" />
                </button>
                <button title="Delete" @click="$emit('prompt-delete', item)" class="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-950/30 border-none bg-transparent cursor-pointer transition-all">
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-5 py-14 text-center text-muted-foreground text-sm">No armory locations found.</td>
          </tr>
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
          @update:page="$emit('page-change', $event)"
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
import { Search, Edit2, Trash2, Warehouse } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrev,
} from '@/components/ui/pagination'
import type { ArmoryLocationResponse } from '~/lib/models/ArmoryLocation'
import type { BranchResponse }         from '~/lib/models/Branch'
import { formatDate } from '~/lib/helpers/date_time'

defineProps<{
  items:         ArmoryLocationResponse[]
  total:         number
  totalPages:    number
  currentPage:   number
  pageSize:      number
  searchQuery:   string
  branchFilter:  string
  branchOptions: BranchResponse[]
}>()

defineEmits<{
  (e: 'open-edit',              item: ArmoryLocationResponse): void
  (e: 'prompt-delete',          item: ArmoryLocationResponse): void
  (e: 'page-change',            page: number):                 void
  (e: 'update:searchQuery',     val: string):                  void
  (e: 'update:branchFilter',    val: string):                  void
}>()


</script>