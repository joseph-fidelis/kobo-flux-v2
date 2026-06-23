<template>
  <div class="min-h-screen bg-background flex">
    <!-- Left — Form panel -->
    <div
      class="flex flex-col w-full lg:w-120 xl:w-130 shrink-0 px-8 py-10 md:px-14"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group w-fit">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0"
        >
          <Shield :size="16" class="text-white" />
        </div>
        <span
          class="text-[15px] font-bold tracking-tight text-foreground group-hover:text-white transition-colors"
        >
          {{ appName }}
        </span>
      </NuxtLink>

      <!-- Form area -->
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <!-- Heading -->
          <div class="mb-8">
            <h1
              class="text-[26px] font-bold text-foreground tracking-tight mb-1.5"
            >
              Sign in to your account
            </h1>
            <p class="text-[14px] text-muted-foreground leading-relaxed">
              Enter your credentials to access the armoury management portal.
            </p>
          </div>

          <!-- Form -->
          <LoginForm
            :is-loading="isLoading"
            @submit="({ username, password }) => login(username, password)"
          />

          <!-- Footer link -->
          <p class="mt-8 text-center text-[13px] text-muted-foreground">
            Having trouble?
            <a
              href="mailto:support@armourysystem.tz"
              class="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>

      <!-- Bottom copyright -->
      <p class="text-[12px] text-slate-700 text-center">
        © 2026 {{ appName }} · All rights reserved
      </p>
    </div>

    <!-- Right — Decorative panel -->
    <div
      class="hidden lg:flex flex-1 relative overflow-hidden bg-background border-l border-border"
    >
      <!-- Ambient glow -->
      <div
        class="absolute -top-30 -right-20 w-125 h-125 rounded-full bg-blue-600/8 blur-[120px] pointer-events-none"
      />
      <div
        class="absolute -bottom-25 -left-15 w-100 h-100 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"
      />

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between w-full p-14">
        <!-- Hero text -->
        <div>
          <div
            class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-3.5 py-1.5 mb-10"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span
              class="text-[11px] text-blue-400 font-semibold tracking-wide uppercase"
              >Secure · Monitored · Controlled</span
            >
          </div>

          <h2
            class="text-[30px] font-black text-foreground tracking-tight leading-snug max-w-sm"
          >
            Centralised Firearm<br />
            <span class="text-blue-500">Management</span> for<br />
            Your Organisation
          </h2>
          <p class="mt-4 text-[14px] text-muted-foreground leading-relaxed max-w-xs">
            Track every firearm, every deployment, and every handover — with a
            full audit trail across all branches.
          </p>
        </div>

        <!-- Feature cards -->
        <div class="flex flex-col gap-3 my-8">
          <div
            class="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
          >
            <div
              class="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center shrink-0"
            >
              <ShieldCheck :size="16" class="text-blue-400" />
            </div>
            <div>
              <div class="text-[13px] font-semibold text-foreground">
                OTP-Gated Issuance
              </div>
              <div class="text-[12px] text-muted-foreground mt-0.5">
                Every firearm handover verified with a one-time passcode
              </div>
            </div>
          </div>
          <div
            class="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
          >
            <div
              class="w-9 h-9 rounded-lg bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center shrink-0"
            >
              <GitBranch :size="16" class="text-emerald-400" />
            </div>
            <div>
              <div class="text-[13px] font-semibold text-foreground">
                Multi-Branch Operations
              </div>
              <div class="text-[12px] text-muted-foreground mt-0.5">
                Real-time visibility across all 7 organisational branches
              </div>
            </div>
          </div>
          <div
            class="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
          >
            <div
              class="w-9 h-9 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center shrink-0"
            >
              <ClipboardList :size="16" class="text-purple-400" />
            </div>
            <div>
              <div class="text-[13px] font-semibold text-foreground">
                Full Audit Trail
              </div>
              <div class="text-[12px] text-muted-foreground mt-0.5">
                Every action logged — who did what, when, and where
              </div>
            </div>
          </div>
        </div>

        <!-- Role badges -->
        <div>
          <p
            class="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-2.5"
          >
            Access roles
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="role in roles"
              :key="role"
              class="text-[11px] font-semibold px-2.5 py-1 rounded-md border"
              :class="roleBadgeClass(role)"
              >{{ role }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList, GitBranch, Shield, ShieldCheck } from "lucide-vue-next";
import { toast } from "vue-sonner";
import LoginForm from "~/components/app-specific/forms/LoginForm.vue";
import { useAuth } from "~/composables/auth/useAuth";

definePageMeta({ layout: false });

const {
  public: { appName },
} = useRuntimeConfig();
const { login, isLoading, error } = useAuth();

watch(error, (msg) => {
  if (msg) toast.error(msg);
});

const roles = [
  "SYSTEM ADMIN",
  "MIS",
  "AMIS",
  "BISO",
  "MAK",
  "AK",
  "SP",
  "AUDITOR",
];

function roleBadgeClass(role: string) {
  const map: Record<string, string> = {
    "SYSTEM ADMIN": "bg-purple-950/60 text-purple-300 border-purple-800/50",
    MIS: "bg-red-950/60 text-red-300 border-red-800/50",
    AMIS: "bg-orange-950/60 text-orange-300 border-orange-800/50",
    BISO: "bg-blue-950/60 text-blue-300 border-blue-800/50",
    MAK: "bg-cyan-950/60 text-cyan-300 border-cyan-800/50",
    AK: "bg-emerald-950/60 text-emerald-300 border-emerald-800/50",
    SP: "bg-slate-800/60 text-foreground/70 border-slate-700/50",
    AUDITOR: "bg-amber-950/60 text-amber-300 border-amber-800/50",
  };
  return map[role] ?? "bg-slate-800/60 text-foreground/70 border-slate-700/50";
}
</script>
