# @robbrown/observability-core

Platform-global OpenTelemetry instrumentation that dual-exports traces, logs, and metrics to both **Sentry** and **Honeycomb** via OTLP/HTTP.

## Install

```bash
npm install @robbrown/observability-core
```

## Configuration

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `OTEL_SERVICE_NAME` | Yes | Service name attached to all telemetry |
| `OTEL_SENTRY_ENDPOINT` | Yes | Sentry OTLP ingest URL |
| `OTEL_SENTRY_HEADERS` | Yes | Auth header(s) for Sentry (comma-separated `key=value`) |
| `OTEL_HONEYCOMB_ENDPOINT` | Yes | Honeycomb OTLP ingest URL |
| `OTEL_HONEYCOMB_HEADERS` | Yes | Auth header(s) for Honeycomb (comma-separated `key=value`) |
| `OTEL_DEBUG` | No | Set to `true` to log init confirmation to stdout |

## Usage

Call `init()` once at application startup, before any other code runs:

```typescript
import { init } from '@robbrown/observability-core';

init();
```

This starts the OpenTelemetry NodeSDK with dual exporters for:

- **Traces** — `SimpleSpanProcessor` to both Sentry and Honeycomb
- **Logs** — `BatchLogRecordProcessor` to both Sentry and Honeycomb
- **Metrics** — `PeriodicExportingMetricReader` to both Sentry and Honeycomb

## Development

```bash
npm run build    # compile TypeScript to dist/
```
