import type { PostHog } from 'posthog-js'

declare module '#app' {
  interface NuxtApp {
    $posthog: PostHog
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $posthog: PostHog
  }
}

export {}
