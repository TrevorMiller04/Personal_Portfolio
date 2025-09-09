import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.profilerIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Profiling
  profilesSampleRate: 1.0,
  
  // Debug mode in development  
  debug: false,
  
  environment: process.env.NODE_ENV,
})