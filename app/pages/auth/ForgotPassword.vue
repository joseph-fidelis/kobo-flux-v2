<template>
  <div class="min-h-screen bg-background flex">

    <!-- Left — Form panel -->
    <div class="flex flex-col w-full lg:w-120 xl:w-130 shrink-0 px-8 py-10 md:px-14">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group w-fit">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Shield :size="16" class="text-white" />
        </div>
        <span class="text-[15px] font-bold tracking-tight text-foreground group-hover:text-white transition-colors">
          {{ appName }}
        </span>
      </NuxtLink>

      <!-- Form area -->
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">

          <!-- Back link -->
          <NuxtLink to="/auth/login" class="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground/70 transition-colors mb-8 group">
            <ArrowLeft :size="14" class="group-hover:-translate-x-0.5 transition-transform" />
            Back to sign in
          </NuxtLink>

          <!-- Heading -->
          <div class="mb-8">
            <div class="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-5">
              <KeyRound :size="20" class="text-blue-400" />
            </div>
            <h1 class="text-[26px] font-bold text-foreground tracking-tight mb-1.5">
              Reset your password
            </h1>
            <p class="text-[14px] text-muted-foreground leading-relaxed">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          <!-- Form -->
          <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-1.5">
              <label for="reset-email" class="text-[13px] font-medium text-foreground/70">
                Email address
              </label>
              <input
                id="reset-email"
                v-model="email"
                type="email"
                placeholder="j.mwamba@organisation.tz"
                required
                class="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              :disabled="submitted"
              class="h-10 w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {{ submitted ? 'Email sent' : 'Send reset link' }}
            </button>
          </form>

          <!-- Success state -->
          <div v-if="submitted" class="mt-5 flex items-start gap-3 bg-emerald-950/50 border border-emerald-700/40 rounded-xl px-4 py-3.5">
            <CircleCheck :size="16" class="text-emerald-400 mt-0.5 shrink-0" />
            <p class="text-[13px] text-emerald-300 leading-relaxed">
              If that email is registered, you'll receive a reset link shortly. Check your inbox.
            </p>
          </div>

          <!-- Footer link -->
          <p class="mt-8 text-center text-[13px] text-muted-foreground">
            Remember your password?
            <NuxtLink to="/auth/login" class="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </NuxtLink>
          </p>

        </div>
      </div>

      <!-- Bottom copyright -->
      <p class="text-[12px] text-slate-700 text-center">
        © 2026 {{ appName }} · All rights reserved
      </p>

    </div>

    <!-- Right — Decorative panel -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden bg-background border-l border-border">

      <!-- Ambient glow -->
      <div class="absolute -top-30 -right-20 w-125 h-125 rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />
      <div class="absolute -bottom-25 -left-15 w-100 h-100 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center w-full p-14 gap-10">

        <div>
          <div class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-3.5 py-1.5 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span class="text-[11px] text-blue-400 font-semibold tracking-wide uppercase">Account Security</span>
          </div>
          <h2 class="text-[28px] font-black text-foreground tracking-tight leading-snug max-w-xs">
            Secure Access<br>
            <span class="text-blue-500">Recovery</span> Process
          </h2>
          <p class="mt-3 text-[14px] text-muted-foreground leading-relaxed max-w-xs">
            Password resets are logged and monitored. All access events are recorded in the system audit trail.
          </p>
        </div>

        <!-- Steps -->
        <div class="flex flex-col gap-5">
          <div v-for="(step, i) in steps" :key="i" class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-[11px] font-bold text-muted-foreground">{{ i + 1 }}</span>
            </div>
            <div>
              <div class="text-[13px] font-semibold text-foreground">{{ step.title }}</div>
              <div class="text-[12px] text-muted-foreground mt-0.5">{{ step.desc }}</div>
            </div>
          </div>
        </div>

        <!-- Security notice -->
        <div class="flex items-start gap-3 bg-amber-950/30 border border-amber-700/30 rounded-xl px-4 py-4">
          <TriangleAlert :size="15" class="text-amber-400 mt-0.5 shrink-0" />
          <p class="text-[12px] text-amber-300/80 leading-relaxed">
            If you did not request a password reset, contact your system administrator immediately. All reset attempts are logged.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Shield, ArrowLeft, KeyRound, CircleCheck, TriangleAlert } from 'lucide-vue-next'
import { ref } from 'vue'

definePageMeta({ layout: false })

const { public: { appName } } = useRuntimeConfig()

const email = ref('')
const submitted = ref(false)

function handleSubmit() {
  if (!email.value) return
  submitted.value = true
}

const steps = [
  { title: 'Enter your email', desc: 'Provide the email address linked to your account.' },
  { title: 'Check your inbox', desc: 'A secure reset link will be sent to your email address.' },
  { title: 'Set a new password', desc: 'Follow the link to create a new secure password.' },
  { title: 'Sign back in', desc: 'Use your new credentials to access the portal.' },
]
</script>
