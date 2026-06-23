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
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Submissions</TableHead>
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
              <TableCell><Skeleton class="h-5 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton class="ml-auto h-4 w-8" /></TableCell>
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell><Skeleton class="h-8 w-8 rounded-md" /></TableCell>
            </TableRow>
          </template>

          <TableEmpty v-else-if="forms.length === 0" :colspan="5">
            No forms found on this account.
          </TableEmpty>

          <TableRow v-for="form in forms" v-else :key="form.uid">
            <TableCell class="font-medium">{{ form.name }}</TableCell>
            <TableCell>
              <Badge :variant="statusVariant(form.deployment_status)">
                {{ formatStatus(form.deployment_status) }}
              </Badge>
            </TableCell>
            <TableCell class="text-right tabular-nums">
              {{ form.deployment__submission_count ?? 0 }}
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
import type { Asset, AssetDeploymentStatus } from '~/lib/models/ProjectsLibrary'
import { useProjectsLibraryApi } from '~/services/project.service'
import { FileText, Inbox, MoreVertical } from 'lucide-vue-next'

definePageMeta({ layout: 'admin-layout' })

const { getAssets } = useProjectsLibraryApi()

const forms = ref<Asset[]>([])
const pending = ref(true)
const error = ref<string | null>(null)

async function refresh() {
  pending.value = true
  error.value = null
  try {
    const response = await getAssets({
      // q: 'asset_type:survey',
      // ordering: '-date_modified',
      current_user_permissions_only: true,
      limit: 100,
    })
    forms.value = response.results
  } catch (err: unknown) {
    const apiErr = err as { message?: string }
    error.value = apiErr.message ?? 'Failed to load forms'
    forms.value = []
  } finally {
    pending.value = false
  }
}

onMounted(refresh)

function formatStatus(status?: AssetDeploymentStatus) {
  if (!status) return 'Draft'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusVariant(status?: AssetDeploymentStatus) {
  switch (status) {
    case 'deployed':
      return 'default' as const
    case 'archived':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function viewDetails(uid: string) {
  navigateTo(`/forms/${uid}`)
}

function viewSubmissions(uid: string) {
  navigateTo({ path: '/submissions', query: { form: uid } })
}
</script>
