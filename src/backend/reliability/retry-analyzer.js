/**
 * PIXEL CREW — Retry Strategy Analyzer
 * 
 * Classifies HTTP status codes and errors into retryable vs non-retryable categories.
 */

export class RetryAnalyzer {
  static isRetryableStatus(statusCode) {
    const nonRetryable = [400, 401, 403, 404, 409, 422];
    if (nonRetryable.includes(statusCode)) return false;

    const retryable = [408, 429, 502, 503, 504];
    return retryable.includes(statusCode);
  }
}
