export async function rateLimit(identifier: string) {
  // Temporarily disable rate limiting for development
  return { success: true };
} 