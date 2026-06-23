<script setup lang="ts">
import { h, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"

import { InputGroup, InputGroupAddon, InputGroupText } from '@/components/ui/input-group'

// ------------------------------
// Validation Schema
// ------------------------------
const formSchema = toTypedSchema(
  z.object({
    referenceId: z.string().min(1, "Reference ID is required"),
    itemType: z.enum(["Firearm", "Ammunition", "Kit"]),
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    allocatedTo: z.string().min(1, "Allocated to field is required"),
    requestReason: z.string().min(1),
    allocatedDate: z.string(),
    expectedReturn: z.string().optional(),
    status: z.enum(["Active", "Returned", "Overdue", "Lost", "Damaged"]),
    notes: z.string().optional().nullable()
  })
)

// ------------------------------
// Form Control
// ------------------------------
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    referenceId: "",
    itemType: "Firearm",
    itemName: "",
    quantity: 1,
    allocatedTo: "",
    requestReason: "",
    allocatedDate: "",
    expectedReturn: "",
    status: "Active",
    notes: ""
  }
})

const onSubmit = handleSubmit((data) => {
  toast('Form Submitted!', {
    description: h(
      'pre',
      { class: 'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4' },
      h('code', JSON.stringify(data, null, 2))
    ),
    position: 'bottom-right'
  })
})
</script>

<template>
    <div class="w-full sm:max-w-2xl mx-auto p-4 flex flex-col gap-4  rounded-lg bg-card-light dark:bg-card-dark shadow-sm">
    <form id="inventory-form" @submit="onSubmit">
        <FieldGroup class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Reference ID -->
          <VeeField v-slot="{ field, errors }" name="referenceId">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Reference ID</FieldLabel>
              <Input v-bind="field" placeholder="REF-00123" />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Item Type -->
          <VeeField v-slot="{ field, errors }" name="itemType">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Item Type</FieldLabel>
              <Select v-bind="field">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Firearm">Firearm</SelectItem>
                    <SelectItem value="Ammunition">Ammunition</SelectItem>
                    <SelectItem value="Kit">Kit</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Item Name -->
          <VeeField v-slot="{ field, errors }" name="itemName">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Item Name</FieldLabel>
              <Input v-bind="field" placeholder="M16 Rifle / 9mm Rounds / First Aid Kit" />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Quantity -->
          <VeeField v-slot="{ field, errors }" name="quantity">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Quantity</FieldLabel>
              <Input v-bind="field" type="number" min="1" />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Allocated To -->
          <VeeField v-slot="{ field, errors }" name="allocatedTo">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Allocated To</FieldLabel>
              <Input v-bind="field" placeholder="Officer John Doe / Unit Bravo" />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Allocation Date -->
          <VeeField v-slot="{ field, errors }" name="allocatedDate">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Allocated Date</FieldLabel>
              <Input v-bind="field" type="date" />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Expected Return -->
          <VeeField v-slot="{ field, errors }" name="expectedReturn">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Expected Return</FieldLabel>
              <Input v-bind="field" type="date" />
              <FieldDescription>Optional — leave blank if N/A</FieldDescription>
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <!-- Status -->
          <VeeField v-slot="{ field, errors }" name="status">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Status</FieldLabel>
              <Select v-bind="field">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>

        <!-- Notes (Full Width) -->
        <div class="mt-6">
          <VeeField v-slot="{ field, errors }" name="notes">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Notes</FieldLabel>
              <Textarea v-bind="field" rows="4" placeholder="Additional remarks..." />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>
        </div>
      </form>
    <div class="mt-6 flex justify-start gap-4">
      <Button type="button" variant="outline" @click="resetForm()">Reset</Button>
      <Button type="submit" form="inventory-form" class="bg-green-600 text-amber-100">Create Allocation</Button>
    </div>
</div>
</template>
