import { useApi } from "~/composables/util/useApi"
import type {
  AssetUsage,
  CreateEmailPayload,
  CreateOrganizationInvitePayload,
  CreateOrganizationInviteResponse,
  CurrentUser,
  EmailAddress,
  Organization,
  OrganizationAssetListCount,
  OrganizationAssetListParams,
  OrganizationAssetMinimal,
  OrganizationAssetUsage,
  OrganizationAssetUsageListParams,
  OrganizationInvite,
  OrganizationMember,
  ProjectView,
  ProjectViewAsset,
  ProjectViewAssetListParams,
  ProjectViewAssetMinimalListParams,
  ProjectViewExport,
  ProjectViewExportCreateResult,
  ProjectViewExportObjectType,
  ProjectViewUser,
  ProjectViewUserListParams,
  ServiceUsage,
  SocialAccount,
  UpdateCurrentUserPayload,
  UpdateOrganizationInvitePayload,
  UpdateOrganizationMemberPayload,
  UpdateOrganizationPayload,
  UserListItem,
  UserProfile,
} from "~/lib/models/UserOrgUsage"
import type { Asset } from "~/lib/models/ProjectsLibrary"
import type { KoboListParams, KoboPaginatedResponse } from "~/lib/models/SurveyData"

const ME_BASE = "/me"
const USER_BASE = "/api/v2/users"
const ORG_BASE = "/api/v2/organizations"
const PROJECT_VIEW_BASE = "/api/v2/project-views"
const ASSET_USAGE_BASE = "/api/v2/asset_usage"
const SERVICE_USAGE_BASE = "/api/v2/service_usage"

/**
 * Service layer for KoboToolbox API v2 "User / team / organization / usage"
 * endpoints: current-user profile, user directory, organizations (members,
 * invites, nested assets), project views (team dashboards), and usage
 * tracking (service-wide and per-asset).
 */
export const useUserOrgApi = () => {
  const api = useApi()

  return {
    // -----------------------------------------------------------------
    // Current user (/me)
    // -----------------------------------------------------------------

    getCurrentUser: () => api.get<CurrentUser>(`${ME_BASE}/`),

    updateCurrentUser: (payload: UpdateCurrentUserPayload) =>
      api.patch<CurrentUser>(`${ME_BASE}/`, payload),

    deleteCurrentUser: () => api.delete<void>(`${ME_BASE}/`),

    getCurrentUserEmails: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<EmailAddress>>(`${ME_BASE}/emails/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    addCurrentUserEmail: (payload: CreateEmailPayload) =>
      api.post<EmailAddress>(`${ME_BASE}/emails/`, payload),

    getCurrentUserSocialAccounts: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<SocialAccount>>(`${ME_BASE}/social-accounts/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getCurrentUserSocialAccount: (provider: string, socialAccountUid: string) =>
      api.get<SocialAccount>(`${ME_BASE}/social-accounts/${provider}/${socialAccountUid}/`),

    deleteCurrentUserSocialAccount: (provider: string, socialAccountUid: string) =>
      api.delete<void>(`${ME_BASE}/social-accounts/${provider}/${socialAccountUid}/`),

    // -----------------------------------------------------------------
    // Users (superuser-only listing)
    // -----------------------------------------------------------------

    getUsers: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<UserListItem>>(`${USER_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getUser: (username: string) =>
      api.get<UserProfile>(`${USER_BASE}/${username}/`),

    // -----------------------------------------------------------------
    // Organizations
    // -----------------------------------------------------------------

    getOrganizations: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<Organization>>(`${ORG_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getOrganization: (organizationUid: string) =>
      api.get<Organization>(`${ORG_BASE}/${organizationUid}/`),

    updateOrganization: (organizationUid: string, payload: UpdateOrganizationPayload) =>
      api.patch<Organization>(`${ORG_BASE}/${organizationUid}/`, payload),

    getOrganizationMembers: (organizationUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<OrganizationMember>>(
        `${ORG_BASE}/${organizationUid}/members/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.offset !== undefined && { offset: params.offset }),
          },
        }
      ),

    getOrganizationMember: (organizationUid: string, username: string) =>
      api.get<OrganizationMember>(`${ORG_BASE}/${organizationUid}/members/${username}/`),

    updateOrganizationMember: (
      organizationUid: string,
      username: string,
      payload: UpdateOrganizationMemberPayload
    ) =>
      api.patch<OrganizationMember>(
        `${ORG_BASE}/${organizationUid}/members/${username}/`,
        payload
      ),

    deleteOrganizationMember: (organizationUid: string, username: string) =>
      api.delete<void>(`${ORG_BASE}/${organizationUid}/members/${username}/`),

    getOrganizationInvites: (organizationUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<OrganizationInvite>>(
        `${ORG_BASE}/${organizationUid}/invites/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.offset !== undefined && { offset: params.offset }),
          },
        }
      ),

    createOrganizationInvite: (
      organizationUid: string,
      payload: CreateOrganizationInvitePayload
    ) =>
      api.post<CreateOrganizationInviteResponse>(
        `${ORG_BASE}/${organizationUid}/invites/`,
        payload
      ),

    getOrganizationInvite: (organizationUid: string, inviteGuid: string) =>
      api.get<OrganizationInvite>(`${ORG_BASE}/${organizationUid}/invites/${inviteGuid}/`),

    /**
     * Send exactly one variant of UpdateOrganizationInvitePayload — either
     * `{ status }` to accept/decline/cancel, or `{ role }` to change role.
     */
    updateOrganizationInvite: (
      organizationUid: string,
      inviteGuid: string,
      payload: UpdateOrganizationInvitePayload
    ) =>
      api.patch<OrganizationInvite>(
        `${ORG_BASE}/${organizationUid}/invites/${inviteGuid}/`,
        payload
      ),

    deleteOrganizationInvite: (organizationUid: string, inviteGuid: string) =>
      api.delete<void>(`${ORG_BASE}/${organizationUid}/invites/${inviteGuid}/`),

    getOrganizationAssets: (organizationUid: string, params: OrganizationAssetListParams = {}) =>
      api.get<KoboPaginatedResponse<Asset>>(`${ORG_BASE}/${organizationUid}/assets/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.q?.trim() && { q: params.q }),
        },
      }),

    getOrganizationAssetCounts: (organizationUid: string) =>
      api.get<OrganizationAssetListCount>(`${ORG_BASE}/${organizationUid}/assets/counts/`),

    getOrganizationAssetsMinimalList: (
      organizationUid: string,
      params: OrganizationAssetListParams = {}
    ) =>
      api.get<KoboPaginatedResponse<OrganizationAssetMinimal>>(
        `${ORG_BASE}/${organizationUid}/assets/minimal-list/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.q?.trim() && { q: params.q }),
          },
        }
      ),

    getOrganizationServiceUsage: (organizationUid: string) =>
      api.get<ServiceUsage>(`${ORG_BASE}/${organizationUid}/service_usage/`),

    getOrganizationAssetUsage: (
      organizationUid: string,
      params: OrganizationAssetUsageListParams = {}
    ) =>
      api.get<KoboPaginatedResponse<OrganizationAssetUsage>>(
        `${ORG_BASE}/${organizationUid}/asset_usage/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.ordering?.trim() && { ordering: params.ordering }),
          },
        }
      ),

    // -----------------------------------------------------------------
    // Project views (team dashboards)
    // -----------------------------------------------------------------

    getProjectViews: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<ProjectView>>(`${PROJECT_VIEW_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getProjectView: (projectViewUid: string) =>
      api.get<ProjectView>(`${PROJECT_VIEW_BASE}/${projectViewUid}/`),

    getProjectViewAssets: (projectViewUid: string, params: ProjectViewAssetListParams = {}) =>
      api.get<KoboPaginatedResponse<ProjectViewAsset>>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/assets/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
          },
        }
      ),

    getProjectViewAssetCounts: (projectViewUid: string) =>
      api.get<OrganizationAssetListCount>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/assets/counts/`
      ),

    getProjectViewAssetsMinimalList: (
      projectViewUid: string,
      params: ProjectViewAssetMinimalListParams = {}
    ) =>
      api.get<KoboPaginatedResponse<OrganizationAssetMinimal>>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/assets/minimal-list/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.q?.trim() && { q: params.q }),
          },
        }
      ),

    getProjectViewUsers: (projectViewUid: string, params: ProjectViewUserListParams = {}) =>
      api.get<KoboPaginatedResponse<ProjectViewUser>>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/users/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
          },
        }
      ),

    getProjectViewExport: (projectViewUid: string, objectType: ProjectViewExportObjectType) =>
      api.get<ProjectViewExport>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/${objectType}/export/`
      ),

    createProjectViewExport: (projectViewUid: string, objectType: ProjectViewExportObjectType) =>
      api.post<ProjectViewExportCreateResult>(
        `${PROJECT_VIEW_BASE}/${projectViewUid}/${objectType}/export/`
      ),

    // -----------------------------------------------------------------
    // Usage (account-wide)
    // -----------------------------------------------------------------

    /** Per-asset usage for the authenticated user's account. */
    getAssetUsage: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<AssetUsage>>(`${ASSET_USAGE_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    /** Service-level usage quotas/balances for the authenticated user. */
    getServiceUsage: () => api.get<ServiceUsage[]>(`${SERVICE_USAGE_BASE}/`),
  }
}
