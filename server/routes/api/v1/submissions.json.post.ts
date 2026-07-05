import { createError, readBody, setResponseHeader, setResponseStatus } from "h3"

interface KoboV1SubmissionPayload {
  id: string
  submission: Record<string, unknown>
}

/**
 * @deprecated Removed upstream June 2026. Use OpenRosa instead:
 *   POST /api/openrosa/{username}/submission
 *
 * This route is kept only for backwards compatibility and always returns a
 * migration hint — it no longer proxies to KC v1.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<KoboV1SubmissionPayload>(event)
  if (!body?.id || !body?.submission) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request body must include id and submission",
    })
  }

  setResponseHeader(event, "Deprecation", "true")
  setResponseHeader(
    event,
    "Link",
    '</api/openrosa/{username}/submission>; rel="successor-version"',
  )
  setResponseStatus(event, 200)

  return {
    status: 410,
    data: {
      message:
        "KC v1 /api/v1/submissions.json was removed in June 2026. "
        + "Use POST /api/openrosa/{ownerUsername}/submission with the same JSON body.",
    },
  }
})
