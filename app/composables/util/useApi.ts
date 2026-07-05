/**
 * useApi composable
 *
 * Thin wrapper around Nuxt's $fetch that normalises errors and exposes typed
 * HTTP helpers. Requests go to same-origin Nitro proxy routes (/api/*, /me/*).
 */

import { useRuntimeConfig } from "#app";
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
  responseType?: "json" | "blob" | "text";
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useApi() {
  const config = useRuntimeConfig();
  /** Same-origin; Nitro proxy routes forward to Kobo server-side. */
  const baseURL = (config.public.baseURL as string) || "";

  function buildHeaders(
    extra?: HeadersInit,
    method: string = "GET",
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(extra as Record<string, string>),
    };
    if (method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json";
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
    const { params, headers, body, responseType } = options;

    try {
      const data = await $fetch(path, {
        baseURL,
        method,
        headers: buildHeaders(headers, method),
        query: params,
        body: body ?? undefined,
        ...(responseType && { responseType }),
      });
      return data as T;
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

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
