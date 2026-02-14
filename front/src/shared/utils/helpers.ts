/**
 * Shared Utility Functions
 */

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  // TODO: Implement actual authentication check
  return false;
}
