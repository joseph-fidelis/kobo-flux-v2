<script setup lang="ts">
import { Lock } from 'lucide-vue-next'

definePageMeta({ layout: 'public' })

const lastUpdated = '13 March 2026'

const sections = [
  {
    title: '1. Introduction',
    content: `This Privacy Policy explains how the Tactical Armory System ("the System") collects, uses, stores, and protects personal and operational data when you use this platform.

This System is an internal tool operated exclusively for authorized organizational personnel. It is not accessible to the general public. By using the System, you acknowledge that data about your activity will be recorded as described herein.`,
  },
  {
    title: '2. Data We Collect',
    content: `The System collects and processes the following categories of data:

Personal Data:
• Full name, initials, title, and file number
• Email address and phone number
• Directorate, department, and branch assignment
• Role and access level

Authentication Data:
• Session tokens (JWT access token and refresh token stored in secure cookies)
• Login timestamps and IP address logs

Operational Data:
• Firearm registration, modification, and approval records
• Ammunition inventory adjustments and request records
• Handover and return records including OTP verification events
• Deployment schedules and completion records
• Occurrence book entries and inspection reports
• All form submissions and record changes with timestamps

Audit Data:
• A complete log of all user actions performed within the System, including the identity of the user, the action taken, the record affected, and the time of the action.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `Data collected by the System is used exclusively for the following purposes:

• Authenticating and authorizing your access to the System
• Associating actions and records with your user identity for accountability
• Tracking the lifecycle of firearms, ammunition, and security equipment
• Supporting operational planning for security personnel deployment
• Generating management and compliance reports
• Conducting audits and investigations as required

Data is never used for commercial purposes, advertising, or any purpose outside official organizational operations.`,
  },
  {
    title: '4. Data Storage and Security',
    content: `All data is stored on organizational servers and infrastructure. Security measures in place include:

• JWT-based authentication with short-lived access tokens and secure refresh token rotation
• Tokens stored in HttpOnly, SameSite-Strict cookies to prevent client-side access
• All API communications are conducted over HTTPS
• Role-based access control ensures users can only access data relevant to their function
• All data access is logged for audit trail purposes

The organization implements reasonable technical and organizational measures to protect data against unauthorized access, loss, or alteration.`,
  },
  {
    title: '5. Data Retention',
    content: `Operational records (firearm registrations, handovers, deployments, etc.) are retained for the duration required by organizational policy and applicable regulations governing firearms management.

Audit logs are retained for a minimum of 5 years to support accountability and legal compliance requirements.

Personal data of deactivated users is retained in the system for audit integrity but access is revoked. Active personal data is updated when role or organizational assignments change.`,
  },
  {
    title: '6. Access to Your Data',
    content: `As an authorized user, you may view your own profile information within the System. Corrections to inaccurate personal data should be requested through your System Administrator.

Managers, system administrators, and auditors may have access to operational records and audit logs as required for their organizational responsibilities. All such access is itself logged.`,
  },
  {
    title: '7. Data Sharing',
    content: `Data within the System is not shared with external third parties except in the following circumstances:

• Where required by law, court order, or regulatory authority
• In connection with an official law enforcement investigation
• With authorized external auditors under a formal engagement

No personal or operational data is shared for commercial, marketing, or non-operational purposes.`,
  },
  {
    title: '8. Cookies and Session Management',
    content: `The System uses the following cookies:

• access_token — A short-lived JWT used to authenticate API requests. HttpOnly, SameSite=Strict.
• refresh_token — Used to obtain a new access token when the current one expires. HttpOnly, SameSite=Strict.

No tracking, analytics, or advertising cookies are used. Cookies are essential for authentication only and cannot be disabled without losing System access.`,
  },
  {
    title: '9. Your Responsibilities',
    content: `While the organization takes measures to protect data, you are also responsible for:

• Keeping your credentials confidential and not sharing them with others
• Logging out from the System when your session is complete
• Reporting any suspected data breach or unauthorized access immediately
• Ensuring that any devices used to access the System are protected with appropriate security measures`,
  },
  {
    title: '10. Changes to This Policy',
    content: `This Privacy Policy may be updated periodically to reflect changes in the System or applicable regulations. The "Last updated" date at the top of this page will reflect any changes. Continued use of the System constitutes acceptance of the updated policy.

For any questions about this Privacy Policy, contact your System Administrator.`,
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
          <Lock :size="18" class="text-emerald-400" />
        </div>
        <span class="text-[12px] font-bold text-emerald-400 tracking-widest uppercase">Privacy</span>
      </div>
      <h1 class="text-4xl font-black tracking-tight text-foreground">Privacy Policy</h1>
      <p class="text-[14px] text-muted-foreground">Last updated: {{ lastUpdated }}</p>
      <p class="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
        This policy describes how your personal and operational data is collected, used, and protected within the Tactical Armory System.
      </p>
    </div>

    <!-- Sections -->
    <div class="flex flex-col gap-6">
      <div
        v-for="section in sections"
        :key="section.title"
        class="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
      >
        <h2 class="text-[15px] font-semibold text-foreground">{{ section.title }}</h2>
        <p class="text-[13.5px] text-muted-foreground leading-relaxed whitespace-pre-line">{{ section.content }}</p>
      </div>
    </div>

    <!-- Footer note -->
    <div class="bg-blue-50 dark:bg-[#0f1829] border border-blue-200 dark:border-blue-900/30 rounded-xl px-6 py-5">
      <p class="text-[13px] text-muted-foreground leading-relaxed">
        <span class="font-semibold text-blue-400">Questions?</span> If you have any questions or concerns about how your data is handled within this System, please contact your branch System Administrator or the designated data officer for your organization.
      </p>
    </div>

  </div>
</template>
