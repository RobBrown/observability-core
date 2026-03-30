export interface ObservabilityConfig {
  serviceName: string;
  sentryEndpoint: string;
  sentryHeaders: string;
  honeycombEndpoint: string;
  honeycombHeaders: string;
  debug?: boolean;
}

export function getConfig(): ObservabilityConfig {
  const required = [
    "OTEL_SERVICE_NAME",
    "OTEL_SENTRY_ENDPOINT",
    "OTEL_SENTRY_HEADERS",
    "OTEL_HONEYCOMB_ENDPOINT",
    "OTEL_HONEYCOMB_HEADERS",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`observability-core: missing required env var ${key}`);
    }
  }

  return {
    serviceName: process.env.OTEL_SERVICE_NAME!,
    sentryEndpoint: process.env.OTEL_SENTRY_ENDPOINT!,
    sentryHeaders: process.env.OTEL_SENTRY_HEADERS!,
    honeycombEndpoint: process.env.OTEL_HONEYCOMB_ENDPOINT!,
    honeycombHeaders: process.env.OTEL_HONEYCOMB_HEADERS!,
    debug: process.env.OTEL_DEBUG === "true",
  };
}
