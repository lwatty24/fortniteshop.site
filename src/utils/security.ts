export function sanitizeInput(input: string): string {
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Remove special characters except basic punctuation
  const sanitized = withoutTags.replace(/[^\w\s.,!?-]/g, '');
  
  // Trim whitespace and limit length
  return sanitized.trim().slice(0, 100);
}
