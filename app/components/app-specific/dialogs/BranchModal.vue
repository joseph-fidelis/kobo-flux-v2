<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BranchCreate, UpdateBranch } from '~/lib/models/Branch'
import type { EnumResponse } from '~/lib/models/util'

const branchSchema = z.object({
  name:     z.string().min(1, 'Branch name is required'),
  location: z.string().min(1, 'Location is required'),
  type:     z.enum(['head_office', 'sub_hq', 'branch'], { required_error: 'Branch type is required' }),
})

type BranchSchema = z.infer<typeof branchSchema>

const props = defineProps<{
  isOpen: boolean
  initial?: UpdateBranch | null,
  branch: EnumResponse[]
}>()

const emits = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'confirm', payload: BranchCreate): void
}>()

const localOpen = ref(props.isOpen)
watch(() => props.isOpen, v => (localOpen.value = v))
watch(localOpen, v => emits('update:isOpen', v))

const { handleSubmit, setValues, resetForm } = useForm<BranchSchema>({
  validationSchema: toTypedSchema(branchSchema),
})

watch(
  () => [props.isOpen, props.initial] as const,
  ([open, val]) => {
    if (!open) return
    if (val) {
      setValues({
        name:     val.name     ?? '',
        location: val.location ?? '',
        type:     (val.type as BranchSchema['type']) ?? undefined,
      })
    } else {
      resetForm({
        values:{
          name: "", 
          location: "",
          type: undefined
        }
      })
    }
  },
  { immediate: true },
)
const onSubmit = handleSubmit((values) => {
  emits('confirm', values)
  localOpen.value = false
})
</script>

<template>
  <Dialog v-model:open="localOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.initial == null ? "Create a new Branch" : "Edit Branch" }}</DialogTitle>
      </DialogHeader>

      <div
        class="w-full sm:max-w-2xl mx-auto p-4 flex flex-col gap-4  rounded-lg bg-card-light dark:bg-card-dark shadow-sm">
        <form id="branch-form" @submit="onSubmit">
          <FieldGroup class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <VeeField v-slot="{ field, errors }" name="name">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>Branch Name</FieldLabel>
                <Input v-bind="field" :model-value="field.value" placeholder="Dodoma HQ" type="text" />
                <FieldError :errors="errors" />
              </Field>
            </VeeField>

            
            <VeeField v-slot="{ field, errors }" name="location">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>Branch Location</FieldLabel>
                <Input v-bind="field" :model-value="field.value" placeholder="Dar es Salaam Sub HQ" type="text" />
                <FieldError :errors="errors" />
              </Field>
            </VeeField>
            
            <VeeField v-slot="{ field, errors }" name="type">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>Branch Type</FieldLabel>
                <Select v-bind="field" :model-value="field.value" @update:model-value="field.onChange">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="opt in props.branch"
                        :key="opt.name"
                        :value="opt.value"
                      >
                        {{ opt.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

        </form>
      </div>
      <DialogFooter>
        <div class="mt-6 flex justify-start gap-4">
          <DialogClose>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" form="branch-form" class="bg-green-600 text-amber-100">{{ props.initial == null ?
            "Create Branch" : "Update Branch" }}</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
