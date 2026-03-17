import { z } from "zod";

const urlOrPath = z.string().refine(
  (val) => val.startsWith("/") || val.startsWith("http"),
  { message: "Must be a URL or absolute path" },
);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_ANALYTICS_API_URL: urlOrPath,
  NEXT_PUBLIC_API_GATEWAY_URL: urlOrPath,
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const serverEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  IDP_CLIENT_ID: z.string().min(1),
  IDP_CLIENT_SECRET: z.string().min(1),
  IDP_ISSUER_URL: z.string().url(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseClientEnv(
  env: Record<string, string | undefined> = process.env,
): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_ANALYTICS_API_URL: env.NEXT_PUBLIC_ANALYTICS_API_URL,
    NEXT_PUBLIC_API_GATEWAY_URL: env.NEXT_PUBLIC_API_GATEWAY_URL,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  });
}

export function parseServerEnv(
  env: Record<string, string | undefined> = process.env,
): ServerEnv {
  return serverEnvSchema.parse({
    JWT_SECRET: env.JWT_SECRET,
    IDP_CLIENT_ID: env.IDP_CLIENT_ID,
    IDP_CLIENT_SECRET: env.IDP_CLIENT_SECRET,
    IDP_ISSUER_URL: env.IDP_ISSUER_URL,
  });
}
