<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between gap-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink to="/forms" class="flex items-center gap-1.5 text-muted-foreground">
          <ArrowLeft class="h-4 w-4" />
          Back to forms
        </NuxtLink>
      </Button>

      <div v-if="form && !pending" class="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadFormJson"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'json' ? 'Downloading…' : 'JSON' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadFormXml"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'xml' ? 'Downloading…' : 'XML' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!!downloading"
          @click="downloadFormXlsx"
        >
          <Download class="mr-2 h-4 w-4" />
          {{ downloading === 'xlsx' ? 'Downloading…' : 'XLSX' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          as-child
        >
          <NuxtLink :to="{ path: '/forms/upload', query: { form: form.uid } }">
            <Upload class="mr-2 h-4 w-4" />
            Upload data
          </NuxtLink>
        </Button>
      
      </div>
    </div>

    <div
      v-if="downloadError"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ downloadError }}
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

    <template v-if="pending">
      <div class="space-y-2">
        <Skeleton class="h-8 w-64" />
        <Skeleton class="h-4 w-40" />
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <Skeleton class="h-48 rounded-lg" />
        <Skeleton class="h-48 rounded-lg" />
      </div>
    </template>

    <template v-else-if="form">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-semibold tracking-tight">{{ form.name }}</h1>
        <Badge :variant="deploymentStatusVariant(form.deployment_status)">
          {{ formatDeploymentStatus(form.deployment_status) }}
        </Badge>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>General form metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <dl class="grid gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm text-muted-foreground">UID</dt>
                <dd class="mt-1 font-mono text-xs font-medium break-all">{{ form.uid }}</dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Type</dt>
                <dd class="mt-1 text-sm font-medium uppercase">{{ form.asset_type }}</dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Owner</dt>
                <dd class="mt-1 text-sm font-medium">{{ formatOwner(form.owner, form) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Submissions</dt>
                <dd class="mt-1 text-sm font-medium tabular-nums">
                  {{ form.deployment__submission_count ?? 0 }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Created</dt>
                <dd class="mt-1 text-sm font-medium">{{ formatDateTime(form.date_created) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Last modified</dt>
                <dd class="mt-1 text-sm font-medium">{{ formatDateTime(form.date_modified) }}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment</CardTitle>
            <CardDescription>Publish and collection status</CardDescription>
          </CardHeader>
          <CardContent>
            <dl v-if="deployment" class="grid gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm text-muted-foreground">Active</dt>
                <dd class="mt-1 text-sm font-medium">{{ deployment.active ? 'Yes' : 'No' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Backend</dt>
                <dd class="mt-1 text-sm font-medium">{{ deployment.backend ?? '—' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm text-muted-foreground">Identifier</dt>
                <dd class="mt-1 font-mono text-xs font-medium break-all">
                  {{ deployment.identifier ?? '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-muted-foreground">Version</dt>
                <dd class="mt-1 font-mono text-xs font-medium">{{ deployment.version_id }}</dd>
              </div>
              <div v-if="deployment.date_modified">
                <dt class="text-sm text-muted-foreground">Last deployed</dt>
                <dd class="mt-1 text-sm font-medium">
                  {{ formatDateTime(deployment.date_modified) }}
                </dd>
              </div>
            </dl>
            <p v-else class="text-sm text-muted-foreground">
              This form has not been deployed yet.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card v-if="hasDeploymentLinks">
        <CardHeader>
          <CardTitle>Collection links</CardTitle>
          <CardDescription>Enketo web form URLs for data collection</CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="divide-y rounded-lg border">
            <li
              v-for="link in deploymentLinkEntries"
              :key="link.key"
              class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span class="text-sm font-medium">{{ link.label }}</span>
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline break-all sm:max-w-[60%] sm:justify-end"
              >
                {{ link.url }}
                <ExternalLink class="h-3.5 w-3.5 shrink-0" />
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card v-if="assetSettings.hasContent">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Project metadata from the form settings</CardDescription>
        </CardHeader>
        <CardContent>
          <dl class="grid gap-4 sm:grid-cols-2">
            <div v-if="assetSettings.description" class="sm:col-span-2">
              <dt class="text-sm text-muted-foreground">Description</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.description }}</dd>
            </div>
            <div v-if="assetSettings.sector">
              <dt class="text-sm text-muted-foreground">Sector</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.sector }}</dd>
            </div>
            <div v-if="assetSettings.countries.length">
              <dt class="text-sm text-muted-foreground">Country</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.countries.join(', ') }}</dd>
            </div>
            <div v-if="assetSettings.organization">
              <dt class="text-sm text-muted-foreground">Organization</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.organization }}</dd>
            </div>
            <div v-if="assetSettings.collectsPii">
              <dt class="text-sm text-muted-foreground">Collects PII</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.collectsPii }}</dd>
            </div>
            <div v-if="assetSettings.operationalPurpose">
              <dt class="text-sm text-muted-foreground">Operational purpose</dt>
              <dd class="mt-1 text-sm font-medium">{{ assetSettings.operationalPurpose }}</dd>
            </div>
            <div v-if="assetSettings.dataTableColumns.length" class="sm:col-span-2">
              <dt class="text-sm text-muted-foreground">Data table columns</dt>
              <dd class="mt-2 flex flex-wrap gap-1.5">
                <Badge
                  v-for="column in assetSettings.dataTableColumns"
                  :key="column"
                  variant="secondary"
                  class="font-mono text-xs"
                >
                  {{ column }}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </template>
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
import { ArrowLeft, Download, ExternalLink, Upload } from 'lucide-vue-next'
import { useFormDetail } from '~/composables/forms/useFormDetail'

definePageMeta({ layout: 'admin-layout' })

const route = useRoute()
const uid = computed(() => route.params.uid as string)

const {
  form,
  deployment,
  pending,
  error,
  downloading,
  downloadError,
  refresh,
  downloadFormJson,
  downloadFormXml,
  downloadFormXlsx,
  formatOwner,
  assetSettings,
  deploymentLinkEntries,
  hasDeploymentLinks,
} = useFormDetail(uid)

const { formatDateTime } = useFormatDate()
const { formatDeploymentStatus, deploymentStatusVariant } = useAssetStatus()
</script>
