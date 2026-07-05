import type {
  CurrentUser,
  Organization,
  OrganizationMember,
} from '~/lib/models/UserOrgUsage'
import { useUserOrgApi } from '~/services/user-org.service'

export interface OrgMembersKpis {
  totalMembers: number
  admins: number
  pendingInvites: number
  yourRole: string
}

export function useOrgMembers() {
  const {
    getCurrentUser,
    getOrganization,
    getOrganizationMembers,
    getOrganizationInvites,
  } = useUserOrgApi()

  const currentUser = ref<CurrentUser | null>(null)
  const organization = ref<Organization | null>(null)
  const members = ref<OrganizationMember[]>([])
  const pendingInvites = ref(0)
  const pending = ref(true)
  const error = ref<string | null>(null)

  const hasOrganization = computed(() => Boolean(organization.value))

  const kpis = computed<OrgMembersKpis>(() => ({
    totalMembers: members.value.length,
    admins: members.value.filter(
      (member) => member.role === 'admin' || member.role === 'owner',
    ).length,
    pendingInvites: pendingInvites.value,
    yourRole: organization.value?.request_user_role ?? '—',
  }))

  function memberDisplayName(member: OrganizationMember) {
    const name = member.user__extra_details__name?.trim()
    return name || member.user__username
  }

  async function refresh() {
    pending.value = true
    error.value = null

    try {
      const me = await getCurrentUser()
      currentUser.value = me

      const orgUid = me.organization?.uid
      if (!orgUid) {
        organization.value = null
        members.value = []
        pendingInvites.value = 0
        return
      }

      const [org, membersResponse, invitesResponse] = await Promise.all([
        getOrganization(orgUid),
        getOrganizationMembers(orgUid, { limit: 100 }),
        getOrganizationInvites(orgUid, { limit: 100 }),
      ])

      organization.value = org
      members.value = membersResponse.results
      pendingInvites.value = invitesResponse.results.filter(
        (invite) => invite.status === 'pending',
      ).length
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load team'
      organization.value = null
      members.value = []
      pendingInvites.value = 0
    } finally {
      pending.value = false
    }
  }

  onMounted(refresh)

  return {
    currentUser,
    organization,
    members,
    kpis,
    hasOrganization,
    pending,
    error,
    refresh,
    memberDisplayName,
  }
}
