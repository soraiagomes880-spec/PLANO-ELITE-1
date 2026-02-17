
/**
 * Executes an async function with exponential backoff retry logic.
 * Targeted at handling transient errors like 503 (Model Overloaded).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1500
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      
      // Determine if the error is retryable (503, 429, or specific "overloaded" message)
      const isOverloaded = err.message?.includes('503') || 
                          err.message?.includes('overloaded') || 
                          err.status === 503 ||
                          err.status === 429;

      if (isOverloaded && i < maxRetries - 1) {
        // Calculate delay with some jitter: (initialDelay * 2^i) + random[0, 1000]ms
        const delay = initialDelay * Math.pow(2, i) + Math.random() * 1000;
        console.warn(`Model overloaded. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
