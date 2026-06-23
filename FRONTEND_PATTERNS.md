# Frontend Coding Patterns — Nuxt 3 + Vue 3

This document defines the exact coding patterns used in this project. All new code must follow these patterns precisely.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (file-based routing, auto-imports) |
| Language | TypeScript (strict) |
| UI Components | Shadcn-Vue (prefix `''`), Reka-UI primitives |
| Styling | Tailwind CSS v4 |
| Icons | Lucide Vue Next |
| State | Pinia + `pinia-plugin-persistedstate` |
| Forms | VeeValidate + Zod + `@vee-validate/zod` |
| HTTP | `useApi` composable wrapping Nuxt `$fetch` |
| Toasts | `vue-sonner` |
| Auth | JWT — `access_token` + `refresh_token` cookies |

---

## Directory Structure

```
app/
├── components/
│   ├── ui/                    # Shadcn base components (auto-imported)
│   └── app-specific/
│       ├── components/        # Reusable feature tab/section components
│       ├── dialogs/           # Modal/dialog components per domain
│       ├── forms/             # Form-only components
│       └── partial-page/      # Large page sections
├── composables/
│   ├── util/
│   │   ├── useApi.ts          # Core HTTP client — NEVER bypass this
│   │   └── debounce.ts        # useDebounce utility
│   ├── auth/useAuth.ts
│   ├── permission/usePermissions.ts
│   └── {domain}/use{Domain}.ts  # One composable per feature domain
├── layouts/
│   ├── AdminLayout.vue        # Authenticated pages (sidebar + header)
│   └── public.vue             # Public pages
├── lib/
│   ├── models/                # TypeScript interfaces per domain
│   │   └── util.ts            # Shared: PaginatedResponse, ApiResponse, EnumResponse
│   └── helpers/
│       └── lists.ts           # updateItemInList, removeItemFromList, prependItemToList
├── middleware/
│   ├── auth.ts                # Cookie token guard
│   └── permission.ts          # Route-level permission guard
├── pages/
│   └── admin/{feature}/index.vue
├── services/
│   └── {domain}.service.ts    # API call definitions per domain
└── stores/
    └── {domain}.ts            # Pinia stores
```

---

## 1. Stores (`app/stores/`)

**Naming:** `kebab-case.ts` → export `useXxxStore`

**Pattern:**
```typescript
import { defineStore } from 'pinia'
import type { XxxResponse } from '~/lib/models/Xxx'

export const useXxxStore = defineStore('xxx-store', {
  state: () => ({
    currentXxx: null as XxxResponse | null,
  }),
  actions: {
    setCurrentXxx(item: XxxResponse | null) {
      this.currentXxx = item
    }
  },
  persist: [
    {
      // SSR-safe minimal data in cookies
      storage: piniaPluginPersistedstate.cookies({
        sameSite: 'strict',
        secure: import.meta.env.PROD,
      }),
      pick: ['currentXxx.id', 'currentXxx.role.name']
    },
    {
      // Large data client-only in localStorage
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['currentXxx.role.permissions']
    }
  ]
})
```

**Rules:**
- Stores hold state only — no business logic, no API calls
- Use dual persistence: cookies for SSR-safe minimal fields, localStorage for large arrays
- `pick` arrays must list dot-path strings to select nested fields
- Store key string must be unique: `'xxx-store'`

---

## 2. Middleware (`app/middleware/`)

**Naming:** `kebab-case.ts`, applied in pages via `middleware: ['auth', 'permission']`

### `auth.ts` — Token guard
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('access_token')
  if (!token.value) {
    return navigateTo('/auth/login')
  }
})
```

### `permission.ts` — Route permission guard
```typescript
import { usePermissionsUtil } from "~/composables/permission/usePermissions"

export default defineNuxtRouteMiddleware((to) => {
  const { can, canAny } = usePermissionsUtil()

  const requiredPermission = to.meta.permission as string | undefined
  const requiredAny = to.meta.permissionAny as string[] | undefined

  if (requiredPermission && !can(requiredPermission)) {
    return navigateTo('/admin/unauthorized')
  }
  if (requiredAny && !canAny(...requiredAny)) {
    return navigateTo('/admin/unauthorized')
  }
})
```

**Route meta usage in pages:**
```typescript
definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth', 'permission'],
  // Optional permission checks:
  // permission: 'inventory:view'         — single required slug
  // permissionAny: ['inventory:view', 'audit:view']  — any one of these
})
```

---

## 3. Services (`app/services/`)

**Naming:** `{domain}.service.ts` → export `useXxxApi`

**Pattern:**
```typescript
import { useApi } from "~/composables/util/useApi"
import type { XxxCreate, XxxUpdate, XxxResponse, XxxListResponse } from "~/lib/models/Xxx"
import type { ApiResponse } from "~/lib/models/util"

const BASE = "/api/v1/resource"

export const useXxxApi = () => {
  const api = useApi()
  return {
    createXxx: (payload: XxxCreate) =>
      api.post<ApiResponse<XxxResponse>>(`${BASE}/`, payload),

    getXxxs: ({
      page = 1,
      size = 20,
      search,
      filter,
    }: { page?: number; size?: number; search?: string; filter?: string } = {}) =>
      api.get<XxxListResponse>(`${BASE}/`, {
        params: {
          page,
          size,
          ...(search?.trim() && { search }),
          ...(filter?.trim() && { filter }),
        },
      }),

    getXxx: (id: string) =>
      api.get<XxxResponse>(`${BASE}/${id}`),

    updateXxx: (id: string, payload: XxxUpdate) =>
      api.patch<ApiResponse<XxxResponse>>(`${BASE}/${id}`, payload),

    deleteXxx: (id: string) =>
      api.delete<{ message: string }>(`${BASE}/${id}`),
  }
}
```

**Rules:**
- One service file per API domain
- `BASE` constant at top of file
- Optional filters use conditional spread: `...(value?.trim() && { key: value })`
- HTTP methods: `post` = create, `get` = read, `patch` = update, `delete` = delete
- Return types: create/update → `ApiResponse<T>`, list → `XxxListResponse`, single → `XxxResponse`, delete → `{ message: string }`
- Services never contain state, watchers, or toast calls

---

## 4. Composables (`app/composables/`)

**Naming:** `app/composables/{domain}/use{Domain}.ts` → export `useXxx`

**Full pattern** (copy this structure for every feature composable):

```typescript
import { computed, ref, watch } from "vue"
import { toast } from "vue-sonner"
import { useDebounce } from "~/composables/util/debounce"
import { removeItemFromList, updateItemInList, prependItemToList } from "~/lib/helpers/lists"
import type { XxxCreate, XxxUpdate, XxxListResponse, XxxResponse } from "~/lib/models/Xxx"
import { useXxxApi } from "~/services/xxx.service"

export const useXxx = () => {
  const xxxService = useXxxApi()

  // ─── Data ────────────────────────────────────────────────
  const _data = ref<XxxListResponse | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const currentXxx = ref<XxxResponse | null>(null)

  // ─── Filters ─────────────────────────────────────────────
  const searchQuery = ref("")
  const statusFilter = ref("")

  // ─── Pagination ───────────────────────────────────────────
  const currentPage = ref(1)
  const pageSize = ref(10)

  // ─── UI State ────────────────────────────────────────────
  const showModal = ref(false)
  const showDeleteDialog = ref(false)

  // ─── Options ─────────────────────────────────────────────
  const statusOptions = ref<EnumResponse[]>([])

  // ─── Debounce ────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 400)

  // ─── Computed ────────────────────────────────────────────
  const xxxList = computed(() => _data.value?.items ?? [])
  const total = computed(() => _data.value?.total ?? 0)
  const totalPages = computed(() => _data.value?.pages ?? 1)

  // ─── Fetch ───────────────────────────────────────────────
  const fetchXxxs = async (page = currentPage.value, size = pageSize.value) => {
    try {
      isLoading.value = true
      error.value = null
      _data.value = await xxxService.getXxxs({ page, size, search: searchQuery.value })
      currentPage.value = page
    } catch (err: any) {
      error.value = err?.message ?? "Failed to load"
      toast.error(error.value!)
    } finally {
      isLoading.value = false
    }
  }

  // ─── Create ───────────────────────────────────────────────
  const createXxx = async (payload: XxxCreate) => {
    try {
      isSubmitting.value = true
      const { data, message } = await xxxService.createXxx(payload)
      prependItemToList(_data.value?.items, data)
      toast.success(message)
      showModal.value = false
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create")
    } finally {
      isSubmitting.value = false
    }
  }

  // ─── Update ───────────────────────────────────────────────
  const updateXxx = async (id: string, payload: XxxUpdate) => {
    try {
      isSubmitting.value = true
      const { data, message } = await xxxService.updateXxx(id, payload)
      updateItemInList(_data.value?.items, data)
      toast.success(message)
      showModal.value = false
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update")
    } finally {
      isSubmitting.value = false
    }
  }

  // ─── Delete ───────────────────────────────────────────────
  const deleteXxx = async (id: string) => {
    try {
      isSubmitting.value = true
      await xxxService.deleteXxx(id)
      removeItemFromList(_data.value?.items, id)
      toast.success("Deleted successfully")
      showDeleteDialog.value = false
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete")
    } finally {
      isSubmitting.value = false
    }
  }

  // ─── UI Handlers ─────────────────────────────────────────
  const openCreateModal = () => {
    currentXxx.value = null
    showModal.value = true
  }

  const openEditModal = (item: XxxResponse) => {
    currentXxx.value = item
    showModal.value = true
  }

  const promptDelete = (item: XxxResponse) => {
    currentXxx.value = item
    showDeleteDialog.value = true
  }

  const onPageChange = (page: number) => {
    currentPage.value = page
    fetchXxxs(page)
  }

  // ─── Watchers ─────────────────────────────────────────────
  watch(debouncedSearch, () => fetchXxxs(1))
  watch(statusFilter, () => fetchXxxs(1))

  // ─── Init ─────────────────────────────────────────────────
  const init = async () => {
    await fetchXxxs()
  }

  return {
    // data
    xxxList, total, totalPages, currentPage, pageSize, currentXxx,
    // state
    isLoading, isSubmitting, error,
    // filters
    searchQuery, statusFilter,
    // options
    statusOptions,
    // ui
    showModal, showDeleteDialog,
    // actions
    init, fetchXxxs, createXxx, updateXxx, deleteXxx,
    openCreateModal, openEditModal, promptDelete, onPageChange,
  }
}
```

**Rules:**
- Section comments with `// ─── Section ───` separators (exact style)
- Internal raw response refs use leading underscore: `_data`
- Always separate `isLoading` (fetch) from `isSubmitting` (create/update/delete)
- List mutations use helpers from `~/lib/helpers/lists`: `updateItemInList`, `removeItemFromList`, `prependItemToList` — never replace the entire array
- Always reset `error.value = null` at fetch start
- Watchers reset to page 1: `watch(filter, () => fetchXxxs(1))`
- Debounce search with `useDebounce(searchQuery, 400)`
- `openCreateModal` sets `currentXxx.value = null` then opens; `openEditModal` sets the item then opens
- On success: mutate list in place → toast → close modal (do NOT refetch unless required)
- On create: `prependItemToList` (adds to top)
- On update: `updateItemInList` (replaces by id)
- On delete: `removeItemFromList` (splices by id)
- Parallel init: `await Promise.all([fetchXxxs(), fetchOptions()])`

---

## 5. `useApi` Composable (`app/composables/util/useApi.ts`)

**Never call `$fetch` directly.** Always use `useApi()`.

```typescript
const api = useApi()

// GET with query params
api.get<T>(path, { params: { page, size, search } })

// POST / PATCH / PUT with body
api.post<ApiResponse<T>>(path, payload)
api.patch<ApiResponse<T>>(path, payload)

// DELETE
api.delete<{ message: string }>(path)

// Reactive (SSR-friendly)
api.useFetch<T>(path, options)
```

**Internals (do not modify):**
- Reads `access_token` cookie, injects `Authorization: Bearer` header
- On 401: auto-refreshes token via `/api/v1/auth/refresh`, retries once
- On refresh failure: clears cookies, redirects to `/auth/login`
- `FormData` bodies skip `Content-Type` header automatically
- Errors normalized to `{ status_code, message, detail }` — access via `err?.message`

---

## 6. Permission Composable (`app/composables/permission/usePermissions.ts`)

```typescript
const { can, canAny, canAll, hasRole, isSuperAdmin } = usePermissionsUtil()

can('inventory:view')              // user has this exact permission slug
canAny('inventory:view', 'audit')  // has any of these
canAll('inventory:view', 'inventory:create')  // has all
hasRole('system_admin', 'manager') // role abbreviation match
isSuperAdmin.value                 // computed boolean
```

- `system_admin` role bypasses all permission checks automatically
- Permissions come from `currentUser.role.permissions` (array of slug strings)
- Use the `<Can>` component in templates for conditional UI rendering

---

## 7. Layouts (`app/layouts/`)

### `AdminLayout.vue` — All authenticated admin pages
- Wraps: `SidebarProvider` → `AppSidebar` + `SidebarInset`
- Header: notifications dropdown + user pill + sign-out button
- `<slot />` renders the page content
- Activated via: `definePageMeta({ layout: 'admin-layout' })`

### `public.vue` — Login, landing pages
- No sidebar
- Activated via: `definePageMeta({ layout: 'public' })`

---

## 8. Pages (`app/pages/admin/{feature}/index.vue`)

**Pattern:**

```vue
<template>
  <div class="p-6 min-h-screen bg-background text-foreground font-sans">

    <!-- Page Header -->
    <div class="flex items-start justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-foreground -tracking-[0.3px] mb-1">Page Title</h1>
        <p class="text-sm text-muted-foreground">Page subtitle</p>
      </div>
      <div class="flex flex-row gap-3">
        <!-- Secondary action -->
        <button @click="secondaryAction"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground hover:border-slate-600 transition-colors cursor-pointer whitespace-nowrap">
          <SomeIcon :size="14" />
          Secondary
        </button>
        <!-- Primary action -->
        <button @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white border-none hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-blue-900/40">
          <Plus :size="14" />
          Add New
        </button>
      </div>
    </div>

    <!-- Tabs (when feature has multiple views) -->
    <div class="inline-flex bg-card border border-border rounded-[10px] p-1 gap-1 mb-5">
      <Button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-5 py-2 border-none rounded-[7px] text-[13.5px] font-medium cursor-pointer transition-all"
        :class="{
          'bg-muted text-foreground font-semibold': activeTab === tab.id,
          'bg-transparent text-muted-foreground hover:text-muted-foreground': activeTab !== tab.id,
        }"
      >
        {{ tab.label }}
        <!-- Badge for count on a tab -->
        <span v-if="tab.id === 'pending' && pendingCount > 0"
          class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold leading-none">
          {{ pendingCount }}
        </span>
      </Button>
    </div>

    <!-- Tab content — one component per tab -->
    <FeatureTab
      v-if="activeTab === 'main'"
      v-bind="tabProps"
      @open-edit="openEditModal"
      @prompt-delete="promptDelete"
      @page-change="onPageChange"
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
    />

    <!-- Modals at end of template -->
    <CreateEditModal
      v-model:open="showModal"
      :initial="currentXxx"
      :loading="isSubmitting"
      @confirm="currentXxx ? updateXxx(currentXxx.id, $event) : createXxx($event)"
    />
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="Delete Item"
      :description="`Delete ${currentXxx?.name}? This cannot be undone.`"
      variant="danger"
      confirm-label="Delete"
      :loading="isSubmitting"
      @confirm="deleteXxx(currentXxx!.id)"
    />

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-layout', middleware: ['auth', 'permission'] })

import { ref, computed, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useXxx } from '~/composables/xxx/useXxx'
import FeatureTab from '@/components/app-specific/components/FeatureTab.vue'
import CreateEditModal from '~/components/app-specific/dialogs/xxx/CreateEditModal.vue'
import ConfirmDialog from '~/components/app-specific/dialogs/ConfirmationDialog.vue'

// ─── Composable ────────────────────────────────────────────
const {
  xxxList, total, totalPages, currentPage, pageSize, currentXxx,
  isLoading, isSubmitting,
  searchQuery, statusFilter,
  showModal, showDeleteDialog,
  openCreateModal, openEditModal, promptDelete, onPageChange,
  createXxx, updateXxx, deleteXxx,
  init,
} = useXxx()

// ─── Tabs ──────────────────────────────────────────────────
type TabId = 'main' | 'secondary'
const activeTab = ref<TabId>('main')
const tabs = [
  { id: 'main' as const, label: 'Main View' },
  { id: 'secondary' as const, label: 'Secondary View' },
]

// ─── Props bundle for tab component ───────────────────────
const tabProps = computed(() => ({
  items: xxxList.value,
  total: total.value,
  totalPages: totalPages.value,
  currentPage: currentPage.value,
  pageSize: pageSize.value,
  isLoading: isLoading.value,
}))

// ─── Init ──────────────────────────────────────────────────
onMounted(async () => {
  await init()
})
</script>
```

**Rules:**
- `definePageMeta` always first line in `<script setup>`
- `<script setup>` comes after `<template>` (template first)
- Composable destructuring uses inline rename for naming conflicts: `showModal: showXxxModal`
- Tab IDs typed as `type TabId = 'a' | 'b'` with `as const` in array
- Bundle props for child components in a `computed(() => ({...}))` object — no prop drilling
- Filters/search use `v-model:filter-name` two-way binding with child components
- All modals at bottom of `<template>`
- `onMounted` uses `Promise.all` for parallel initialization

---

## 9. Dialog/Modal Components (`app/components/app-specific/dialogs/`)

**Naming:** `PascalCase.vue`, grouped in subdirectory by domain (e.g., `dialogs/armsregister/`)

**Standard structure:**

```vue
<script setup lang="ts">
import type { XxxResponse, XxxCreate } from '~/lib/models/Xxx'

const props = defineProps<{
  open: boolean
  initial?: XxxResponse | null
  loading?: boolean
  // option lists
  statusOptions?: EnumResponse[]
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'confirm', payload: XxxCreate): void
}>()

const form = reactive({
  name: '',
  status: '',
})
const errors = reactive({
  name: '',
  status: '',
})

watch(() => [props.open, props.initial] as const, ([open, initial]) => {
  if (!open) return
  // Reset errors
  Object.keys(errors).forEach(k => (errors as any)[k] = '')
  // Populate or clear form
  if (initial) {
    form.name = initial.name
    form.status = initial.status
  } else {
    form.name = ''
    form.status = ''
  }
})

function validate() {
  let valid = true
  errors.name = ''
  errors.status = ''
  if (!form.name.trim()) { errors.name = 'Name is required'; valid = false }
  if (!form.status) { errors.status = 'Status is required'; valid = false }
  return valid
}

function onSubmit() {
  if (!validate()) return
  emit('confirm', { ...form })
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="bg-card border border-border text-foreground p-0 gap-0 max-w-110 rounded-xl shadow-2xl"
      hide-close
    >
      <!-- Header -->
      <DialogHeader class="px-6 pt-6 pb-4 border-b border-border">
        <DialogTitle class="text-[17px] font-bold text-foreground mb-1">
          {{ initial ? 'Edit Item' : 'Create Item' }}
        </DialogTitle>
        <DialogDescription class="text-[13px] text-muted-foreground m-0">
          {{ initial ? 'Update the details below.' : 'Fill in the details below.' }}
        </DialogDescription>
      </DialogHeader>

      <!-- Form -->
      <form id="xxx-form" @submit.prevent="onSubmit" class="px-6 py-5 flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-foreground/70">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            class="bg-muted border rounded-lg px-3 py-2.5 text-[13px] h-[40px] w-full focus:outline-none transition-colors"
            :class="errors.name ? 'border-red-500/60' : 'border-border focus:border-blue-500/70'"
          />
          <p v-if="errors.name" class="text-[11.5px] text-red-400">{{ errors.name }}</p>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-foreground/70">Status</label>
          <Select v-model="form.status">
            <SelectTrigger
              class="h-[40px] text-[13px]"
              :class="errors.status ? 'border-red-500/60' : ''"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.status" class="text-[11.5px] text-red-400">{{ errors.status }}</p>
        </div>
      </form>

      <!-- Footer -->
      <DialogFooter class="px-6 pb-6 pt-3 border-t border-border flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('update:open', false)"
          class="px-4 py-2 rounded-lg text-[13px] font-semibold border border-border text-muted-foreground bg-transparent hover:bg-muted transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="xxx-form"
          :disabled="loading"
          class="px-4 py-2 rounded-lg text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Saving...' : initial ? 'Save Changes' : 'Create Item' }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

**Rules:**
- `hide-close` always on `DialogContent` — no X button, close via Cancel only
- `max-w-110` default; use `max-w-130` or `max-w-150` for wider forms
- Form has an `id` attribute; submit button uses `form="<id>"` (not nested inside `<form>`)
- Submit label: `loading ? 'Saving...' : initial ? 'Save Changes' : 'Create …'`
- `watch(() => [props.open, props.initial] as const, ...)` resets/populates form on open
- Validation is manual: `validate()` sets `errors`, returns boolean
- Emit `'confirm'` with the payload, never call the service directly from dialogs
- Select "All" option sentinel uses `value=" "` (space string), not empty string

**Field classes (exact):**
- Input: `bg-muted border rounded-lg px-3 py-2.5 text-[13px] h-[40px] w-full focus:outline-none transition-colors` + `:class="error ? 'border-red-500/60' : 'border-border focus:border-blue-500/70'"`
- Label: `text-[12.5px] font-semibold text-foreground/70`
- Error text: `text-[11.5px] text-red-400`
- Field wrapper: `flex flex-col gap-1.5`

---

## 10. Type Models (`app/lib/models/`)

**Naming:** `PascalCase.ts` matching domain (e.g., `Firearm.ts`, `User.ts`)

**Standard pattern:**
```typescript
import type { PaginatedResponse } from '~/lib/models/util'

// Create payload
export interface XxxCreate {
  name: string
  status: string
  branch_id?: string
}

// Update payload (all optional)
export type XxxUpdate = Partial<XxxCreate>

// Full response from API
export interface XxxResponse extends XxxCreate {
  id: string
  created_at: string
  updated_at: string
}

// Paginated list response
export interface XxxListResponse extends PaginatedResponse<XxxResponse> {}

// Query params interface for service
export interface GetXxxsParams {
  page?: number
  size?: number
  search?: string
  status?: string
}
```

**Shared util types** (`lib/models/util.ts`):
```typescript
PaginatedResponse<T>   // { items, total, page, size, pages }
ApiResponse<T>         // { message, data }
SearchResponse<T>      // { message, data: T[] }
EnumResponse           // { name, value }
```

---

## 11. List Helpers (`app/lib/helpers/lists.ts`)

Always use these instead of array replacement:

```typescript
import { updateItemInList, removeItemFromList, prependItemToList } from "~/lib/helpers/lists"

// After update: replace item by id in place
updateItemInList(_data.value?.items, updatedItem)

// After delete: remove item by id
removeItemFromList(_data.value?.items, deletedId)

// After create: add to top of list
prependItemToList(_data.value?.items, newItem)
```

All three handle `null`/`undefined` arrays safely and return the array.

---

## 12. Auth Flow

1. `useAuth().login(username, password)` →
2. `useAuthApi().login()` sends `FormData` to `/api/v1/auth/login` →
3. Stores `access_token` + `refresh_token` in cookies →
4. Sets `currentUser` in Pinia store →
5. Redirects to `/admin/dashboard`

Logout: clears store, clears cookies, redirects to `/auth/login`. Always fires even if API call fails.

Token refresh is automatic inside `useApi` — never manually manage tokens.

---

## 13. Toast Notifications

```typescript
import { toast } from "vue-sonner"

toast.success("Item created successfully")
toast.error(err?.message ?? "Operation failed")
toast.info("Processing...")
```

- Always in composables, never in services or components
- Error toast: `toast.error(err?.message ?? "Fallback message")`
- Success toast: use `message` from `ApiResponse` when available

---

## 14. Debounce

```typescript
import { useDebounce } from "~/composables/util/debounce"

const searchQuery = ref("")
const debouncedSearch = useDebounce(searchQuery, 400)

watch(debouncedSearch, () => fetchItems(1))
```

Always debounce search inputs at 400ms. Watch the debounced ref, not the raw ref.

---

## 15. Permission Component (`<Can>`)

```vue
<!-- Single permission -->
<Can permission="inventory:view">
  <button>View</button>
</Can>

<!-- Any of several permissions -->
<Can :any="['inventory:view', 'audit:view']">
  <div>...</div>
</Can>

<!-- Role-based -->
<Can :role="['system_admin', 'manager']">
  <AdminPanel />
</Can>
```

---

## Quick Reference: New Feature Checklist

1. **Model** — `app/lib/models/Feature.ts` (Create, Update, Response, ListResponse, GetParams)
2. **Service** — `app/services/feature.service.ts` (useFeatureApi with CRUD methods)
3. **Composable** — `app/composables/feature/useFeature.ts` (state + actions following full pattern)
4. **Dialogs** — `app/components/app-specific/dialogs/feature/CreateEditModal.vue`
5. **Tab component** — `app/components/app-specific/components/FeatureTab.vue` (table/list)
6. **Page** — `app/pages/admin/feature/index.vue` (orchestrates composables + renders components)
7. **Sidebar** — Add nav entry in `app/components/app-specific/AppSidebar.vue`
