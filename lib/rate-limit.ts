// Simple in-memory rate limiter
// For production, consider Redis or Upstash

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60 * 60 * 1000) // 1 hour

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // No entry or expired - create new
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime
    }
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime
  }
}

export function getClientIP(request: Request): string {
  // Check Vercel/Cloudflare headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown'
}
