import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  baseUrl?: string;
  body?: unknown;
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  options: FetchOptions = {},
): Promise<T> {
  const { baseUrl = "", body, ...fetchOptions } = options;

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.error?.code ?? "UNKNOWN",
      errorBody.error?.message ?? response.statusText,
      response.status,
      errorBody.error?.details,
    );
  }

  const data = await response.json();
  return schema.parse(data);
}
