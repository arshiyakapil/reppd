import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { HealthChecker, SystemMetrics, PerformanceMonitor } from '@/lib/monitoring'

// Health check endpoint for monitoring services
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Run all health checks
    const healthResults = await HealthChecker.runHealthChecks()
    
    // Collect system metrics
    const systemMetrics = SystemMetrics.collect()
    
    // Calculate response time
    const responseTime = Date.now() - startTime
    
    // Get performance metrics
    const performanceMetrics = PerformanceMonitor.getAllMetrics()
    
    // Determine overall status
    const isHealthy = healthResults.status === 'healthy'
    const status = isHealthy ? 200 : 503
    
    const response = {
      status: healthResults.status,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: healthResults.checks,
      metrics: {
        system: {
          uptime: `${Math.floor(systemMetrics.uptime / 60)} minutes`,
          memory: {
            used: `${Math.round(systemMetrics.memory.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(systemMetrics.memory.heapTotal / 1024 / 1024)}MB`,
            usage: `${Math.round((systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100)}%`
          },
          cpu: {
            user: systemMetrics.cpu.user,
            system: systemMetrics.cpu.system
          }
        },
        performance: performanceMetrics,
        database: await getDatabaseMetrics()
      }
    }
    
    return NextResponse.json(response, { status })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 503 })
  }
}

// Detailed health check for internal monitoring
export async function POST(request: NextRequest) {
  try {
    const { includeDetails = false } = await request.json()
    
    const healthResults = await HealthChecker.runHealthChecks()
    const systemMetrics = SystemMetrics.collect()
    
    let response: any = {
      status: healthResults.status,
      timestamp: new Date().toISOString(),
      checks: healthResults.checks
    }
    
    if (includeDetails) {
      response.details = {
        system: systemMetrics,
        database: await getDatabaseMetrics(),
        performance: PerformanceMonitor.getAllMetrics(),
        errors: systemMetrics.errors,
        events: systemMetrics.events
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get detailed health information'
    }, { status: 500 })
  }
}

// Get database-specific metrics
async function getDatabaseMetrics() {
  try {
    const db = await getDatabase()
    
    // Get database stats
    const stats = await db.stats()
    
    // Get collection counts
    const collections = await db.listCollections().toArray()
    const collectionStats: Record<string, any> = {}
    
    for (const collection of collections) {
      try {
        const collectionName = collection.name
        const count = await db.collection(collectionName).countDocuments()
        collectionStats[collectionName] = { count }
      } catch (error) {
        collectionStats[collection.name] = { error: 'Failed to get count' }
      }
    }
    
    return {
      connected: true,
      stats: {
        collections: stats.collections,
        dataSize: `${Math.round(stats.dataSize / 1024 / 1024)}MB`,
        storageSize: `${Math.round(stats.storageSize / 1024 / 1024)}MB`,
        indexes: stats.indexes,
        indexSize: `${Math.round(stats.indexSize / 1024 / 1024)}MB`
      },
      collections: collectionStats
    }
    
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

// Liveness probe (simple check)
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
