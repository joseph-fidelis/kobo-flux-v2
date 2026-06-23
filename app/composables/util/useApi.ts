/**
 * useApi composable
 *
 * A thin wrapper around Nuxt's $fetch / useFetch that:
 *  - Injects the base URL from runtime config
 *  - Attaches the auth token from the auth store / cookie
 *  - Normalises error responses into a consistent shape
 *  - Exposes typed helpers: get, post, put, patch, delete
 *
 * Usage:
 *   const api = useApi()
 *
 *   // Plain async call (inside actions, event handlers, etc.)
 *   const user = await api.post<UserResponse>("/users", payload)
 *
 *   // Reactive call (inside setup, auto-refreshes on param change)
 *   const { data, pending, error, refresh } = api.useFetch<User[]>("/users")
 */

import { useRuntimeConfig } from "#app";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchError } from "ofetch";

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ApiError {
  status_code: number;
  message: string;
  detail?: unknown;
}

interface RequestOptions {
  params?: QueryParams;
  headers?: HeadersInit;
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useApi() {
  const config = useRuntimeConfig();
  /** Same-origin; Nitro proxy routes forward to Kobo server-side. */
  const baseURL = (config.public.baseURL as string) || "";

  function buildHeaders(extra?: HeadersInit): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(extra as Record<string, string>),
    };
  }

  // ── Error normaliser ────────────────────────────────────────────────────────

  function normaliseError(err: unknown): never {
    const fetchErr = err as FetchError;

    const status = fetchErr.response?.status ?? 0;
    const message: string =
      fetchErr.data?.message ??
      fetchErr.message ??
      "An unexpected error occurred";
    const detail = fetchErr.data?.detail ?? null;

    throw { status_code: status, message, detail } satisfies ApiError;
  }
  // ── Core $fetch wrapper ─────────────────────────────────────────────────────

  async function request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    options: RequestOptions & { body?: unknown } = {},
    _retry = false, // guard against infinite retry loop
  ): Promise<T> {
    const { params, headers, body } = options;

    try {
      return await $fetch<T>(path, {
        baseURL,
        method,
        headers:buildHeaders(headers),
        query: params,
        body: body ?? undefined,
      });
    } catch (err) {
      normaliseError(err);
    }
  }

  // ── Typed HTTP helpers ──────────────────────────────────────────────────────

  function get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, options);
  }

  function post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", path, { ...options, body });
  }

  function put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PUT", path, { ...options, body });
  }

  function patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PATCH", path, { ...options, body });
  }

  function del<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, options);
  }

  function useFetchApi<T extends Record<string, any> = Record<string, any>>(
    path: string,
    options: UseFetchOptions<T> = {} as UseFetchOptions<T>,
  ) {
    const { headers, ...rest } = options;

    // @ts-expect-error Nuxt's useFetch types don't allow generic headers, but we know this works
    return useFetch<T>(path, {
      baseURL,
      ...rest,
      headers: buildHeaders(headers as HeadersInit),
    });
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    useFetch: useFetchApi,
  };
}
