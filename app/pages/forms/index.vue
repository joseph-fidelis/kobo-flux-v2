<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold tracking-tight">Forms</h1>
        <Badge v-if="!pending && !error" variant="secondary">
          {{ forms.length }}
        </Badge>
      </div>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ error }}
      <Button variant="outline" size="sm" class="ml-3" @click="refresh">
        Retry
      </Button>
    </div>

    <div class="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead >Submissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead class="w-12">
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="pending">
            <TableRow v-for="i in 5" :key="i">
              <TableCell><Skeleton class="h-4 w-48" /></TableCell>
              <TableCell><Skeleton class="h-4 w-24" /></TableCell>
              <TableCell><Skeleton class="h-4 w-16" /></TableCell>
              <TableCell><Skeleton class="h-5 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton class="ml-auto h-4 w-8" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-8 w-8 rounded-md" /></TableCell>
            </TableRow>
          </template>

          <TableEmpty v-else-if="forms.length === 0" :colspan="8">
            No forms found on this account.
          </TableEmpty>

          <TableRow v-for="form in forms" v-else :key="form.uid">
            <TableCell class="font-medium">{{ form.name }}</TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatOwner(form.owner, form) }}
            </TableCell>
            <TableCell class="uppercase text-muted-foreground">
              {{ form.asset_type }}
            </TableCell>
            <TableCell>
              <Badge :variant="deploymentStatusVariant(form.deployment_status)">
                {{ formatDeploymentStatus(form.deployment_status) }}
              </Badge>
            </TableCell>
            <TableCell class="tabular-nums">
              {{ form.deployment__submission_count ?? 0 }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatDate(form.date_created) }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatDate(form.date_modified) }}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <MoreVertical class="h-4 w-4" />
                    <span class="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-44">
                  <DropdownMenuItem @click="viewDetails(form.uid)">
                    <FileText class="h-4 w-4" />
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="viewSubmissions(form.uid)">
                    <Inbox class="h-4 w-4" />
                    View submissions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Inbox, MoreVertical } from 'lucide-vue-next'
import { useForms } from '~/composables/forms/useForms'

definePageMeta({ layout: 'admin-layout' })

const { forms, pending, error, refresh, viewDetails, viewSubmissions, formatOwner } = useForms()
const { formatDate } = useFormatDate()
const { formatDeploymentStatus, deploymentStatusVariant } = useAssetStatus()
</script>
