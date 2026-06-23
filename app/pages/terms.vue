<script setup lang="ts">
import { FileText } from 'lucide-vue-next'

definePageMeta({ layout: 'public' })

const lastUpdated = '13 March 2026'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Tactical Armory System ("the System"), you confirm that you are an authorized employee or contractor of the organization, and that you agree to be bound by these Terms and Conditions. If you do not agree, you must not use the System.

Unauthorized access to this system is strictly prohibited and may be subject to disciplinary action and legal prosecution under applicable laws.`,
  },
  {
    title: '2. Authorized Use Only',
    content: `This system is exclusively for authorized personnel with valid credentials issued by the System Administrator. You must:

• Use only your assigned username and password — never share credentials with any other person
• Report any suspected unauthorized access or breach to your system administrator immediately
• Access only the data and functions your role permits
• Not attempt to access modules, data, or records beyond your assigned role

Access is granted on a need-to-use basis. Role-based permissions are enforced by the system and may not be circumvented.`,
  },
  {
    title: '3. Acceptable Use',
    content: `The System is provided solely for official armoury management operations. Permitted uses include:

• Registering, tracking, and managing firearms and ammunition records
• Recording security personnel deployments and shift rosters
• Processing firearm issuances and returns through the OTP-gated handover process
• Logging incidents in the occurrence book
• Generating official reports for management and audit purposes

Prohibited activities include but are not limited to: unauthorized data export, modification of records without authorization, introduction of malware or disruptive software, and any activity that compromises the integrity of armoury records.`,
  },
  {
    title: '4. Data Accuracy and Integrity',
    content: `All users are responsible for the accuracy of information they enter into the System. You must:

• Ensure all firearm registrations, handover records, and deployment entries are accurate and complete
• Correct any errors promptly and document reasons for amendments
• Not delete, alter, or suppress records to conceal operational activities

Falsification of armoury records is a serious disciplinary offence and may constitute a criminal act.`,
  },
  {
    title: '5. OTP and Handover Verification',
    content: `The firearm issuance process requires one-time password (OTP) verification. By participating in any OTP-gated handover:

• The issuing armoury keeper confirms the recipient identity and firearm condition
• The receiving security personnel confirms acceptance of the firearm and ammunition count
• Both parties acknowledge that the record created is legally binding for accountability purposes

Misuse of the OTP process — including issuing firearms without proper verification — is a serious breach of protocol.`,
  },
  {
    title: '6. Confidentiality',
    content: `All data within this system — including personnel records, deployment schedules, firearm inventories, and incident logs — is classified as confidential organizational information.

Users must not:
• Share system data with unauthorized persons inside or outside the organization
• Export, copy, or reproduce records for personal use
• Discuss sensitive operational data in unsecured environments

Confidentiality obligations continue after your employment or engagement with the organization ends.`,
  },
  {
    title: '7. Audit and Monitoring',
    content: `All actions performed within the System are logged and auditable. This includes login events, record creation and modification, approval decisions, and report generation.

By using this System, you consent to this monitoring. Audit logs may be reviewed by authorized auditors, management, or law enforcement in connection with official investigations.`,
  },
  {
    title: '8. Account Security',
    content: `You are responsible for maintaining the security of your account. This includes:

• Using a strong, unique password and updating it as directed by your administrator
• Logging out from the System when not in use, especially on shared terminals
• Reporting any suspected compromise of your credentials immediately
• Not leaving authenticated sessions unattended

The organization reserves the right to suspend or revoke access at any time without notice if a security concern is identified.`,
  },
  {
    title: '9. Termination of Access',
    content: `Your access to the System will be revoked upon termination of employment, change of role, or at the discretion of the System Administrator. You must not access the System after your authorization has been revoked.

Continued unauthorized access following revocation may result in legal action.`,
  },
  {
    title: '10. Changes to These Terms',
    content: `These Terms and Conditions may be updated periodically. Continued use of the System following any update constitutes acceptance of the revised terms. Significant changes will be communicated through your system administrator.`,
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
          <FileText :size="18" class="text-blue-400" />
        </div>
        <span class="text-[12px] font-bold text-blue-400 tracking-widest uppercase">Legal</span>
      </div>
      <h1 class="text-4xl font-black tracking-tight text-foreground">Terms and Conditions</h1>
      <p class="text-[14px] text-muted-foreground">Last updated: {{ lastUpdated }}</p>
      <p class="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
        These Terms and Conditions govern your use of the Tactical Armory System. Please read them carefully before accessing the System.
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
    <div class="bg-orange-50 dark:bg-[#1a0e08] border border-orange-200 dark:border-orange-900/30 rounded-xl px-6 py-5">
      <p class="text-[13px] text-muted-foreground leading-relaxed">
        <span class="font-semibold text-orange-400">Important:</span> Violation of these terms may result in immediate suspension of access, disciplinary proceedings, and/or referral to law enforcement authorities. If you have questions about these terms, contact your System Administrator.
      </p>
    </div>

  </div>
</template>
