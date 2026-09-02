/**
 * PIXEL CREW — Idempotency Engine
 * 
 * Synthesizes Idempotency-Key validation middleware and storage guards
 * to prevent duplicate side effects on retried mutating requests.
 */

export class IdempotencyEngine {
  /**
   * Synthesize idempotency middleware file
   * @returns {string} TypeScript middleware code
   */
  static generateMiddleware() {
    return `import { NextRequest, NextResponse } from "next/server";
import { ConflictError } from "@/shared/errors";

const idempotencyStore = new Map<string, { status: number; body: any; timestamp: number }>();

/**
 * Validates Idempotency-Key header on mutating endpoints
 */
export async function withIdempotency(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey) {
    return await handler();
  }

  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    return NextResponse.json(cached.body, { status: cached.status });
  }

  const response = await handler();
  
  if (response.status >= 200 && response.status < 300) {
    try {
      const cloned = response.clone();
      const body = await cloned.json();
      idempotencyStore.set(idempotencyKey, {
        status: response.status,
        body,
        timestamp: Date.now()
      });
    } catch {
      // Non-json response
    }
  }

  return response;
}
`;
  }
}
