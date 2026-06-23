<template>
  <div>
    <!-- Toolbar -->
    <div class="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
      <div class="relative flex-1 max-w-[320px]">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          :value="typesSearchQuery"
          @input="emit('update:typesSearchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search ammunition types..."
          class="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div class="ml-auto">
        <button
          @click="emit('open-create')"
          class="flex items-center gap-1.5 bg-blue-600 text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
        >
          <Plus :size="14" />
          Register Type
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-3.5 border-b border-border">
        <h3 class="text-[13.5px] font-semibold text-foreground">Ammunition Types ({{ total }})</h3>
      </div>

      <div v-if="isLoading" class="py-14 text-center text-muted-foreground text-sm">Loading...</div>

      <template v-else>
        <div v-if="items.length === 0" class="py-14 text-center text-muted-foreground text-sm">
          No ammunition types found.
        </div>

        <div v-else class="grid grid-cols-3 gap-4 p-5">
          <div
            v-for="item in items"
            :key="item.id"
            class="bg-muted/40 border border-border rounded-xl p-5 hover:border-slate-600 transition-colors"
          >
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="flex flex-col gap-1 min-w-0">
                <span class="text-[14px] font-semibold text-foreground truncate">{{ item.name }}</span>
                <span v-if="item.calibar" class="text-[11.5px] font-mono text-muted-foreground">{{ item.calibar }}</span>
              </div>
              <span
                class="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                :class="item.is_active
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-700/50'"
              >
                {{ item.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <p v-if="item.description" class="text-[12px] text-muted-foreground leading-relaxed mb-3">
              {{ item.description }}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] text-muted-foreground">Compatible:</span>
                <span class="text-[11px] font-semibold text-foreground/80 uppercase">
                  {{ item.compatible_firearm_type }}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  title="Edit"
                  @click="emit('open-edit', item)"
                  class="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-950/30 border-none bg-transparent cursor-pointer transition-all"
                >
                  <PenSquare :size="13" />
                </button>
                <button
                  title="Delete"
                  @click="emit('prompt-delete', item)"
                  class="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-950/30 border-none bg-transparent cursor-pointer transition-all"
                >
                  <Trash2 :size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
              <template v-for="(pageItem, idx) in pageItems" :key="pageItem.type === 'page' ? pageItem.value : `e-${idx}`">
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus, PenSquare, Trash2 } from 'lucide-vue-next'
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrev,
} from '@/components/ui/pagination'
import type { AmmunitionTypeResponse } from '~/lib/models/Ammunition'

defineProps<{
  items:            AmmunitionTypeResponse[]
  total:            number
  totalPages:       number
  currentPage:      number
  pageSize:         number
  isLoading:        boolean
  typesSearchQuery: string
}>()

const emit = defineEmits<{
  'update:typesSearchQuery': [val: string]
  'page-change':             [page: number]
  'open-create':             []
  'open-edit':               [item: AmmunitionTypeResponse]
  'prompt-delete':           [item: AmmunitionTypeResponse]
}>()
</script>
