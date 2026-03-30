import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getConfig } from './types';

function parseHeaders(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw.split(',').map(pair => {
      const [key, ...rest] = pair.split('=');
      return [(key ?? '').trim(), rest.join('=').trim()];
    })
  );
}

export function init() {
  const config = getConfig();

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: config.serviceName,
  });

  const sentryTraceExporter = new OTLPTraceExporter({
    url: config.sentryEndpoint,
    headers: parseHeaders(config.sentryHeaders),
  });

  const honeycombTraceExporter = new OTLPTraceExporter({
    url: config.honeycombEndpoint,
    headers: parseHeaders(config.honeycombHeaders),
  });

  const sentryLogExporter = new OTLPLogExporter({
    url: config.sentryEndpoint,
    headers: parseHeaders(config.sentryHeaders),
  });

  const honeycombLogExporter = new OTLPLogExporter({
    url: config.honeycombEndpoint,
    headers: parseHeaders(config.honeycombHeaders),
  });

  const sentryMetricExporter = new OTLPMetricExporter({
    url: config.sentryEndpoint,
    headers: parseHeaders(config.sentryHeaders),
  });

  const honeycombMetricExporter = new OTLPMetricExporter({
    url: config.honeycombEndpoint,
    headers: parseHeaders(config.honeycombHeaders),
  });

  const sdk = new NodeSDK({
    resource,
    spanProcessors: [
      new SimpleSpanProcessor(sentryTraceExporter),
      new SimpleSpanProcessor(honeycombTraceExporter),
    ],
    logRecordProcessors: [
      new BatchLogRecordProcessor(sentryLogExporter),
      new BatchLogRecordProcessor(honeycombLogExporter),
    ],
    metricReaders: [
      new PeriodicExportingMetricReader({ exporter: sentryMetricExporter }),
      new PeriodicExportingMetricReader({ exporter: honeycombMetricExporter }),
    ],
  });

  sdk.start();

  if (config.debug) {
    console.log(`[observability-core] started for service: ${config.serviceName}`);
  }
}
