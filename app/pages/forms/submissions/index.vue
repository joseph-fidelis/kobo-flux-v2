<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between gap-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink
          :to="`/forms`"
          class="flex items-center gap-1.5 text-muted-foreground"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to forms
        </NuxtLink>
      </Button>

      <div v-if="form && !pending" class="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadSubmissionJson"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'json' ? 'Downloading…' : 'JSON' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadSubmissionXml"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'xml' ? 'Downloading…' : 'XML' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadSubmissionXlsx"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'xlsx' ? 'Downloading…' : 'XLSX' }}
        </Button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <h1 class="text-2xl font-semibold tracking-tight">Submissions</h1>
      <Badge v-if="form && !pending && !error" variant="secondary">
        {{ totalCount }}
      </Badge>
    </div>

    <p v-if="form" class="text-sm text-muted-foreground">
      Form: <span class="font-medium text-foreground">{{ form.name }}</span>
      <span class="text-muted-foreground"> · exports limited to {{ pageSize }} most recent submissions</span>
    </p>

    <div
      v-if="downloadError"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ downloadError }}
    </div>

    <div
      v-if="!hasForm"
      class="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground"
    >
      No form selected. Open submissions from a form in the
      <NuxtLink to="/forms" class="text-primary hover:underline">forms list</NuxtLink>.
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ error }}
      <Button variant="outline" size="sm" class="ml-3" @click="refresh">
        Retry
      </Button>
    </div>

    <template v-else>
      <div class="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Validation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="pending">
              <TableRow v-for="i in 5" :key="i">
                <TableCell><Skeleton class="h-4 w-16" /></TableCell>
                <TableCell><Skeleton class="h-4 w-24" /></TableCell>
                <TableCell><Skeleton class="h-4 w-36" /></TableCell>
                <TableCell><Skeleton class="h-5 w-24 rounded-full" /></TableCell>
              </TableRow>
            </template>

            <TableEmpty v-else-if="submissions.length === 0" :colspan="4">
              No submissions found for this form.
            </TableEmpty>

            <TableRow v-for="submission in submissions" v-else :key="submissionKey(submission)">
              <TableCell class="font-medium tabular-nums">
                {{ formatSubmissionId(submission) }}
              </TableCell>
              <TableCell
                class="font-mono text-xs text-muted-foreground"
                :title="formatSubmissionUuidFull(submission)"
              >
                {{ formatSubmissionUuid(submission) }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ submission._submission_time ? formatDateTime(submission._submission_time) : '—' }}
              </TableCell>
              <TableCell>
                <Badge :variant="validationStatusVariant(submission._validation_status)">
                  {{ formatValidationStatus(submission._validation_status) }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div
        v-if="!pending && totalCount > 0"
        class="flex flex-col items-center justify-between gap-4 sm:flex-row"
      >
        <p class="text-sm text-muted-foreground">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalCount }} submissions
        </p>

        <Pagination
          v-if="hasPagination"
          :page="page"
          :total="totalCount"
          :items-per-page="pageSize"
          :sibling-count="1"
          show-edges
          @update:page="goToPage"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
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
</template>

<script lang="ts" setup>
import type { SubmissionRecord } from '~/lib/models/SurveyData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
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
import { ArrowLeft, Download } from 'lucide-vue-next'
import { useFormSubmissions } from '~/composables/forms/useFormSubmissions'
import { useSubmissionDisplay } from '~/composables/forms/useSubmissionDisplay'

definePageMeta({ layout: 'admin-layout' })

const route = useRoute()
const formUid = computed(() => route.query.form as string | undefined)

const {
  form,
  submissions,
  totalCount,
  pending,
  error,
  hasForm,
  page,
  pageSize,
  hasPagination,
  rangeStart,
  rangeEnd,
  refresh,
  goToPage,
  downloading,
  downloadError,
  downloadSubmissionJson,
  downloadSubmissionXml,
  downloadSubmissionXlsx,
} = useFormSubmissions(formUid)

const { formatDateTime } = useFormatDate()
const { formatValidationStatus, validationStatusVariant } = useValidationStatus()
const { formatSubmissionId, formatSubmissionUuid, formatSubmissionUuidFull } =
  useSubmissionDisplay()

function submissionKey(submission: SubmissionRecord) {
  return submission._id ?? submission._uuid ?? JSON.stringify(submission)
}
</script>
