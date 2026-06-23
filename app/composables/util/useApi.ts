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

import { useCookie, useRuntimeConfig } from "#app";
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
  const rawBase = (config.public.apiBase as string) || "http://localhost:5000";
  // Ensure the URL is absolute so $fetch never treats it as a relative path
  const baseURL = /^https?:\/\//i.test(rawBase) ? rawBase : `http://${rawBase}`;
  const token = useCookie<string | null>("access_token", {
    sameSite: "strict",
    secure: import.meta.env.PROD,
  });
  const refreshToken = useCookie<string | null>("refresh_token", {
    sameSite: "strict",
    secure: import.meta.env.PROD,
  });

  // Prevent multiple simultaneous refresh calls
  let refreshPromise: Promise<void> | null = null;
  async function attemptRefresh(): Promise<void> {
    if (refreshPromise) return refreshPromise; // queue concurrent calls behind the same refresh

    refreshPromise = (async () => {
      try {
        const data = await $fetch<{
          access_token: string;
          refresh_token: string;
        }>("/api/v1/auth/refresh", {
          baseURL,
          method: "POST",
          body: { refresh_token: refreshToken.value },
        });
        token.value = data.access_token;
        refreshToken.value = data.refresh_token;
      } catch {
        // Refresh failed — force logout
        token.value = null;
        refreshToken.value = null;
        await navigateTo("/auth/login");
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }
  // ── Shared headers ──────────────────────────────────────────────────────────

  function buildHeaders(extra?: HeadersInit): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(extra as Record<string, string>),
    };

    if (token.value) {
      headers["Authorization"] = `Bearer ${token.value}`;
    }

    return headers;
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
    const isFormData = body instanceof FormData;

    try {
      return await $fetch<T>(path, {
        baseURL,
        method,
        headers: isFormData
          ? {
              Accept: "application/json",
              ...(token.value
                ? { Authorization: `Bearer ${token.value}` }
                : {}),
            }
          : buildHeaders(headers),
        query: params,
        body: body ?? undefined,
      });
    } catch (err) {
      const fetchErr = err as FetchError;

      if (fetchErr.response?.status === 401 && !_retry) {
        await attemptRefresh();
        return request<T>(method, path, options, true); // retry once with new token
      }

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
