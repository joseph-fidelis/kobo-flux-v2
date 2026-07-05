import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  if (!config.posthogEnabled || !config.posthogKey) {
    return
  }

  posthog.init(config.posthogKey, {
    api_host: config.posthogHost,
    capture_pageview: false,
    person_profiles: 'identified_only',
  })

  posthog.register({
    deployment_host: window.location.hostname,
    app_version: config.appVersion,
  })

  return {
    provide: {
      posthog,
    },
  }
})
