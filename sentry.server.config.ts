import * as Sentry from '@sentry/nextjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Profiling
  profilesSampleRate: 1.0,
  
  // Debug mode in development  
  debug: false,
  
  environment: process.env.NODE_ENV,
})