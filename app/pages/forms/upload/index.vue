<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between gap-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink
          :to="form ? `/forms/${form.uid}` : '/forms'"
          class="flex items-center gap-1.5 text-muted-foreground"
        >
          <ArrowLeft class="h-4 w-4" />
          {{ form ? 'Back to form' : 'Back to forms' }}
        </NuxtLink>
      </Button>

      <div v-if="form && !pending && expectedHeaders.length > 0" class="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" :disabled="headersPending || uploading" @click="downloadTemplate">
          <Download class="mr-2 h-4 w-4" />
          Template
        </Button>
        <Button
          v-if="uploadResults.length > 0"
          variant="outline"
          size="sm"
          @click="downloadUploadLog"
        >
          <Download class="mr-2 h-4 w-4" />
          Download log
        </Button>
        <Button size="sm" :disabled="!canUpload || uploading" @click="upload">
          <Upload class="mr-2 h-4 w-4" />
          {{ uploading ? 'Uploading…' : 'Upload' }}
        </Button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <h1 class="text-2xl font-semibold tracking-tight">Upload submissions</h1>
    </div>

    <p v-if="form" class="text-sm text-muted-foreground">
      Form: <span class="font-medium text-foreground">{{ form.name }}</span>
      <span> · headers must match Kobo export labels (lang: default)</span>
    </p>

    <div
      v-if="!hasForm"
      class="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground"
    >
      No form selected. Open upload from a form or add
      <code class="text-xs">?form=&lt;uid&gt;</code> to the URL.
      <div class="mt-3">
        <NuxtLink to="/forms" class="text-primary hover:underline">Go to forms list</NuxtLink>
      </div>
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
      <div
        v-if="pending || headersPending"
        class="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Skeleton class="h-4 w-4 rounded-full" />
        Loading form and export headers from Kobo…
      </div>

      <template v-else>
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Select spreadsheet</CardTitle>
            <CardDescription>
              Upload an .xlsx file. Column headers are validated against this form's Kobo data export.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              :disabled="parsing || uploading"
              @change="onInputChange"
            />
            <p v-if="parsing" class="text-sm text-muted-foreground">Reading spreadsheet…</p>
            <p v-if="selectedFile && !parsing" class="text-sm text-muted-foreground">
              {{ selectedFile.name }} · {{ totalRowCount }} data row(s)
            </p>
          </CardContent>
        </Card>

        <div
          v-if="parseError"
          class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {{ parseError }}
        </div>

        <Alert v-if="validation && !validation.valid" variant="destructive">
          <AlertTitle>Header mismatch</AlertTitle>
          <AlertDescription class="flex flex-col gap-3">
            <p>Your file does not match the expected Kobo export columns.</p>
            <div v-if="validation.missing.length > 0">
              <p class="font-medium">Missing columns:</p>
              <ul class="list-inside list-disc text-sm">
                <li v-for="col in validation.missing" :key="col">{{ col }}</li>
              </ul>
            </div>
            <div v-if="validation.extra.length > 0">
              <p class="font-medium">Unexpected columns:</p>
              <ul class="list-inside list-disc text-sm">
                <li v-for="col in validation.extra" :key="col">{{ col }}</li>
              </ul>
            </div>
            <div>
              <p class="font-medium">Expected columns (Kobo export labels):</p>
              <p class="mt-1 font-mono text-xs leading-relaxed">
                {{ validation.expectedData.join(' · ') }}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <Alert v-else-if="validation?.valid">
          <AlertTitle>Headers valid</AlertTitle>
          <AlertDescription>
            All question columns match. You can upload {{ totalRowCount }} row(s).
          </AlertDescription>
        </Alert>

        <div v-if="uploading || uploadProgress.done > 0" class="flex flex-col gap-2">
          <div class="flex items-center justify-between text-sm text-muted-foreground">
            <span>Upload progress</span>
            <span>{{ uploadProgress.done }} / {{ uploadProgress.total }}</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{ width: `${uploadProgressPercent}%` }"
            />
          </div>
          <p v-if="uploadProgress.done > 0" class="text-xs text-muted-foreground">
            {{ uploadProgress.succeeded }} succeeded · {{ uploadProgress.failed }} failed
          </p>
        </div>

        <div
          v-if="uploadMessage"
          class="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm"
        >
          {{ uploadMessage }}
        </div>

        <div v-if="uploadResults.length > 0" class="rounded-lg border border-border">
          <div class="border-b border-border px-4 py-3">
            <h2 class="text-sm font-medium">Upload results</h2>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-16">Row</TableHead>
                  <TableHead class="w-24">Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="result in uploadResults" :key="result.row">
                  <TableCell class="font-medium tabular-nums">{{ result.row }}</TableCell>
                  <TableCell>
                    <Badge :variant="result.ok ? 'default' : 'destructive'">
                      {{ result.ok ? 'OK' : 'Failed' }}
                    </Badge>
                  </TableCell>
                  <TableCell class="max-w-md truncate text-sm text-muted-foreground" :title="result.message">
                    {{ result.message ?? '—' }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div v-if="previewRows.length > 0" class="rounded-lg border border-border">
          <div class="border-b border-border px-4 py-3">
            <h2 class="text-sm font-medium">Preview</h2>
            <p class="text-xs text-muted-foreground">
              First {{ Math.min(previewRows.length, previewRowLimit) }} of {{ totalRowCount }} rows
            </p>
          </div>
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    v-for="header in previewHeaders"
                    :key="header"
                    class="whitespace-nowrap"
                  >
                    {{ header }}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(row, rowIndex) in previewRows" :key="rowIndex">
                  <TableCell
                    v-for="(header, colIndex) in previewHeaders"
                    :key="`${rowIndex}-${header}`"
                    class="max-w-[200px] truncate text-muted-foreground"
                    :title="cellValue(row, colIndex)"
                  >
                    {{ cellValue(row, colIndex) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Download, Upload } from 'lucide-vue-next'
import { useSubmissionUpload } from '~/composables/forms/useSubmissionUpload'

definePageMeta({ layout: 'admin-layout' })

const route = useRoute()
const formUid = computed(() => route.query.form as string | undefined)

const {
  form,
  expectedHeaders,
  pending,
  headersPending,
  parsing,
  uploading,
  error,
  parseError,
  hasForm,
  selectedFile,
  previewHeaders,
  previewRows,
  totalRowCount,
  previewRowLimit,
  validation,
  canUpload,
  uploadMessage,
  uploadProgress,
  uploadResults,
  refresh,
  onFileSelected,
  downloadTemplate,
  downloadUploadLog,
  upload,
} = useSubmissionUpload(formUid)

const uploadProgressPercent = computed(() => {
  if (uploadProgress.value.total === 0) return 0
  return Math.round((uploadProgress.value.done / uploadProgress.value.total) * 100)
})

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  onFileSelected(file)
}

function cellValue(row: (string | number)[], colIndex: number) {
  const value = row[colIndex]
  if (value == null || value === '') return '—'
  return String(value)
}
</script>
