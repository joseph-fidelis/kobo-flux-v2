<template>
  <div class="bg-card border border-border rounded-xl p-6">
    <h2 class="text-[15px] font-bold text-foreground mb-1">Pending Approvals</h2>
    <p class="text-[13px] text-muted-foreground mb-5">
      Review and approve firearms registered by other BISO officers
    </p>

    <div class="flex flex-col gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-background border border-orange-700/40 rounded-xl p-5"
      >
        <!-- Card header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <Clock :size="16" class="text-orange-500 shrink-0" />
            <span class="text-[14.5px] font-bold text-foreground">{{ item.model }}</span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-950/60 text-orange-400 border border-orange-700/50">
              Pending Approval
            </span>
          </div>
          <button
            @click="$emit('review', item)"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold cursor-pointer border-none hover:bg-blue-700 transition-colors"
          >
            Review
          </button>
        </div>

        <!-- Details grid -->
        <div class="grid grid-cols-4 gap-x-8 gap-y-4">
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Barcode:</span>
            <span class="text-[13px] font-bold text-foreground">{{ item.barcode }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Type:</span>
            <span class="text-[13px] font-bold text-foreground uppercase">{{ typeof item.type === 'object' ? item.type?.name : item.type }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Weapon #:</span>
            <span class="text-[13px] font-bold text-foreground">{{ item.weapon_no }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">C.A.R. #:</span>
            <span class="text-[13px] font-bold text-foreground">{{ item.car_no }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Branch:</span>
            <span class="text-[13px] font-bold text-foreground">{{ item.armory_location?.branch?.name ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Armory:</span>
            <span class="text-[13px] font-bold text-foreground">{{ item.armory_location?.name ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Condition:</span>
            <span class="text-[13px] font-bold text-foreground uppercase">{{ typeof item.condition === 'object' ? item.condition?.name : item.condition }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Registered By:</span>
            <span class="text-[13px] font-bold text-foreground">
              {{ item.submitted_by_user?.first_name }} {{ item.submitted_by_user?.surname }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[11.5px] text-muted-foreground">Date:</span>
            <span class="text-[13px] font-bold text-foreground">{{ formatDate(item.submitted_at) }}</span>
          </div>
        </div>
      </div>

      <div v-if="items.length === 0" class="py-14 text-center text-muted-foreground text-sm">
        No pending approvals.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { formatDate } from '~/lib/helpers/date_time';
import type { FirearmApprovalResponse } from '~/lib/models/Firearm'

defineProps<{
  items: FirearmApprovalResponse[]
}>()

defineEmits<{
  (e: 'review', item: FirearmApprovalResponse): void
}>()

</script>