<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-semibold tracking-tight">Team</h1>
          <Badge v-if="organization && !pending" variant="secondary">
            {{ organization.name }}
          </Badge>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">
          Organization members and roles
        </p>
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

    <Card v-if="!pending && !hasOrganization && !error">
      <CardHeader>
        <CardTitle>No organization</CardTitle>
        <CardDescription>
          Your account is not linked to a Kobo organization.
        </CardDescription>
      </CardHeader>
      <CardContent v-if="currentUser">
        <dl class="grid gap-3 sm:grid-cols-2">
          <div>
            <dt class="text-sm text-muted-foreground">Username</dt>
            <dd class="mt-1 text-sm font-medium">{{ currentUser.username }}</dd>
          </div>
          <div>
            <dt class="text-sm text-muted-foreground">Email</dt>
            <dd class="mt-1 text-sm font-medium">{{ currentUser.email }}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>

    <template v-else>
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
            <p
              v-else
              class="text-2xl font-semibold capitalize tabular-nums"
              :class="stat.label === 'Your role' ? 'text-lg' : ''"
            >
              {{ stat.value }}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            People with access to this organization
          </CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="pending">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell><Skeleton class="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton class="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton class="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton class="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton class="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton class="h-4 w-28" /></TableCell>
                </TableRow>
              </template>

              <TableEmpty v-else-if="members.length === 0" :colspan="6">
                No members found for this organization.
              </TableEmpty>

              <TableRow v-for="member in members" v-else :key="member.url">
                <TableCell class="font-medium">
                  {{ memberDisplayName(member) }}
                  <span
                    v-if="member.user__username === currentUser?.username"
                    class="ml-1.5 text-xs font-normal text-muted-foreground"
                  >
                    (you)
                  </span>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  {{ member.user__email }}
                </TableCell>
                <TableCell>
                  <Badge :variant="roleVariant(member.role)">
                    {{ formatRole(member.role) }}
                  </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  {{ member.user__has_mfa_enabled ? 'Yes' : 'No' }}
                </TableCell>
                <TableCell>
                  <Badge :variant="member.user__is_active ? 'default' : 'secondary'">
                    {{ member.user__is_active ? 'Active' : 'Inactive' }}
                  </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  {{ formatDate(member.date_joined) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { BadgeVariants } from '@/components/ui/badge'
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
import type { MemberRole } from '~/lib/models/UserOrgUsage'
import { Clock, Shield, UserCog, Users } from 'lucide-vue-next'
import { useOrgMembers } from '~/composables/useOrgMembers'

definePageMeta({ layout: 'admin-layout' })

const {
  currentUser,
  organization,
  members,
  kpis,
  hasOrganization,
  pending,
  error,
  refresh,
  memberDisplayName,
} = useOrgMembers()

const { formatDate } = useFormatDate()

function formatRole(role: MemberRole) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function roleVariant(role: MemberRole): BadgeVariants['variant'] {
  switch (role) {
    case 'owner':
      return 'default'
    case 'admin':
      return 'secondary'
    default:
      return 'outline'
  }
}

const kpiCards = computed(() => [
  {
    label: 'Total members',
    value: kpis.value.totalMembers,
    icon: Users,
  },
  {
    label: 'Admins',
    value: kpis.value.admins,
    icon: Shield,
  },
  {
    label: 'Pending invites',
    value: kpis.value.pendingInvites,
    icon: Clock,
  },
  {
    label: 'Your role',
    value: kpis.value.yourRole,
    icon: UserCog,
  },
])
</script>
