<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Overview of your Kobo forms and submission activity
        </p>
      </div>
      <Button variant="outline" size="sm" as-child>
        <NuxtLink to="/forms">View all forms</NuxtLink>
      </Button>
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

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="stat in kpiCards" :key="stat.label">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ stat.label }}
          </CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="pending" class="h-8 w-16" />
          <p v-else class="text-2xl font-semibold tabular-nums">
            {{ stat.value }}
          </p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent forms</CardTitle>
          <CardDescription>Last modified forms on your account</CardDescription>
        </div>
        <Button variant="ghost" size="sm" as-child>
          <NuxtLink to="/forms">See all</NuxtLink>
        </Button>
      </CardHeader>
      <CardContent class="p-0">
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
                <TableCell><Skeleton class="h-4 w-28" /></TableCell>
                <TableCell><Skeleton class="h-8 w-8 rounded-md" /></TableCell>
              </TableRow>
            </template>

            <TableEmpty v-else-if="recentForms.length === 0" :colspan="5">
              No forms found on this account.
            </TableEmpty>

            <TableRow
              v-for="form in recentForms"
              v-else
              :key="form.uid"
              class="cursor-pointer"
              @click="viewForm(form.uid)"
            >
              <TableCell class="font-medium">{{ form.name }}</TableCell>
              <TableCell>
                <Badge :variant="deploymentStatusVariant(form.deployment_status)">
                  {{ formatDeploymentStatus(form.deployment_status) }}
                </Badge>
              </TableCell>
              <TableCell class="text-right tabular-nums">
                {{ form.deployment__submission_count ?? 0 }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ formatDateTime(form.date_modified) }}
              </TableCell>
              <TableCell @click.stop>
                <Button variant="ghost" size="icon" class="h-8 w-8" as-child>
                  <NuxtLink :to="`/forms/${form.uid}`">
                    <ChevronRight class="h-4 w-4" />
                    <span class="sr-only">View form</span>
                  </NuxtLink>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  ChevronRight,
  ClipboardList,
  FormInput,
  Radio,
  Send,
} from 'lucide-vue-next'
import { useDashboard } from '~/composables/useDashboard'

definePageMeta({ layout: 'admin-layout' })

const { kpis, recentForms, pending, error, refresh, viewForm } = useDashboard()
const { formatDateTime } = useFormatDate()
const { formatDeploymentStatus, deploymentStatusVariant } = useAssetStatus()

const kpiCards = computed(() => [
  {
    label: 'Total forms',
    value: kpis.value.totalForms,
    icon: FormInput,
  },
  {
    label: 'Deployed',
    value: kpis.value.deployedForms,
    icon: ClipboardList,
  },
  {
    label: 'Total submissions',
    value: kpis.value.totalSubmissions,
    icon: Send,
  },
  {
    label: 'Active collectors',
    value: kpis.value.activeCollectors,
    icon: Radio,
  },
])
</script>
