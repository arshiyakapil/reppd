import winston from 'winston'

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'reppd-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()

  static startTimer(operation: string): () => void {
    const start = Date.now()
    
    return () => {
      const duration = Date.now() - start
      this.recordMetric(operation, duration)
    }
  }

  static recordMetric(operation: string, value: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    const values = this.metrics.get(operation)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  static getMetrics(operation: string) {
    const values = this.metrics.get(operation) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    }
  }

  static getAllMetrics() {
    const result: Record<string, any> = {}
    for (const [operation, _] of this.metrics) {
      result[operation] = this.getMetrics(operation)
    }
    return result
  }
}

// Error tracking
export class ErrorTracker {
  private static errors = new Map<string, { count: number; lastSeen: Date; samples: any[] }>()

  static recordError(error: Error, context?: any) {
    const key = `${error.name}:${error.message}`
    
    if (!this.errors.has(key)) {
      this.errors.set(key, {
        count: 0,
        lastSeen: new Date(),
        samples: []
      })
    }

    const errorData = this.errors.get(key)!
    errorData.count++
    errorData.lastSeen = new Date()
    
    // Keep last 5 samples
    errorData.samples.push({
      stack: error.stack,
      context,
      timestamp: new Date()
    })
    
    if (errorData.samples.length > 5) {
      errorData.samples.shift()
    }

    // Log error
    logger.error('Application error', {
      error: error.message,
      stack: error.stack,
      context,
      count: errorData.count
    })

    // Send to external monitoring if in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalMonitoring(error, context)
    }
  }

  private static sendToExternalMonitoring(error: Error, context?: any) {
    // Integration with Sentry, DataDog, or other monitoring services
    // For now, just log to console in production
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }

  static getErrorSummary() {
    const summary: any[] = []
    
    for (const [key, data] of this.errors) {
      summary.push({
        error: key,
        count: data.count,
        lastSeen: data.lastSeen,
        recentSample: data.samples[data.samples.length - 1]
      })
    }

    return summary.sort((a, b) => b.count - a.count)
  }
}

// Usage analytics
export class UsageAnalytics {
  private static events = new Map<string, { count: number; lastSeen: Date }>()
  private static userActions = new Map<string, number>()

  static trackEvent(eventName: string, userId?: string, metadata?: any) {
    // Track event frequency
    if (!this.events.has(eventName)) {
      this.events.set(eventName, { count: 0, lastSeen: new Date() })
    }
    
    const event = this.events.get(eventName)!
    event.count++
    event.lastSeen = new Date()

    // Track user actions
    if (userId) {
      const userKey = `${userId}:${eventName}`
      this.userActions.set(userKey, (this.userActions.get(userKey) || 0) + 1)
    }

    // Log analytics event
    logger.info('Analytics event', {
      event: eventName,
      userId,
      metadata,
      timestamp: new Date()
    })
  }

  static getEventSummary() {
    const summary: any[] = []
    
    for (const [eventName, data] of this.events) {
      summary.push({
        event: eventName,
        count: data.count,
        lastSeen: data.lastSeen
      })
    }

    return summary.sort((a, b) => b.count - a.count)
  }

  static getUserActionCount(userId: string, eventName: string): number {
    return this.userActions.get(`${userId}:${eventName}`) || 0
  }
}

// Health check system
export class HealthChecker {
  private static checks = new Map<string, () => Promise<boolean>>()

  static registerCheck(name: string, checkFunction: () => Promise<boolean>) {
    this.checks.set(name, checkFunction)
  }

  static async runHealthChecks(): Promise<{ status: 'healthy' | 'unhealthy'; checks: Record<string, boolean> }> {
    const results: Record<string, boolean> = {}
    let allHealthy = true

    for (const [name, checkFn] of this.checks) {
      try {
        results[name] = await checkFn()
        if (!results[name]) allHealthy = false
      } catch (error) {
        results[name] = false
        allHealthy = false
        ErrorTracker.recordError(error as Error, { healthCheck: name })
      }
    }

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks: results
    }
  }
}

// Database health check
HealthChecker.registerCheck('database', async () => {
  try {
    const { getDatabase } = await import('./mongodb')
    const db = await getDatabase()
    await db.admin().ping()
    return true
  } catch (error) {
    return false
  }
})

// Memory usage check
HealthChecker.registerCheck('memory', async () => {
  const usage = process.memoryUsage()
  const maxMemory = 512 * 1024 * 1024 // 512MB threshold
  return usage.heapUsed < maxMemory
})

// API response time monitoring middleware
export function monitorApiResponse(endpoint: string) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const timer = PerformanceMonitor.startTimer(`api:${endpoint}`)
      
      try {
        const result = await method.apply(this, args)
        timer()
        UsageAnalytics.trackEvent(`api_call:${endpoint}`)
        return result
      } catch (error) {
        timer()
        ErrorTracker.recordError(error as Error, { endpoint, args })
        throw error
      }
    }

    return descriptor
  }
}

// Export logger and monitoring tools
export { logger }

// System metrics collector
export class SystemMetrics {
  static collect() {
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    return {
      timestamp: new Date(),
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      performance: PerformanceMonitor.getAllMetrics(),
      errors: ErrorTracker.getErrorSummary(),
      events: UsageAnalytics.getEventSummary()
    }
  }
}

// Initialize monitoring
if (process.env.NODE_ENV === 'production') {
  // Collect metrics every 5 minutes
  setInterval(() => {
    const metrics = SystemMetrics.collect()
    logger.info('System metrics', metrics)
  }, 5 * 60 * 1000)
}
