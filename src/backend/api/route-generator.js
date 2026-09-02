/**
 * PIXEL CREW — Route Handler Generator
 * 
 * Synthesizes Next.js App Router API Route handlers (route.ts) that delegate cleanly
 * to controllers/services, avoiding inline database logic or unvalidated inputs.
 */

export class RouteGenerator {
  /**
   * Generate Next.js App Router route.ts file for an entity collection
   * @param {object} entity 
   * @returns {string} Route handler code
   */
  static generateCollectionRoute(entity) {
    const name = entity.name;
    const lowerName = name.toLowerCase();

    return `import { NextRequest, NextResponse } from "next/server";
import { ${name}Controller } from "@/modules/${lowerName}/${lowerName}.controller";
import { formatErrorResponse } from "@/shared/errors";

const controller = new ${name}Controller();

export async function GET(request: NextRequest) {
  try {
    const result = await controller.list(request);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error, request.nextUrl.pathname);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await controller.create(request);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error, request.nextUrl.pathname);
    return NextResponse.json(body, { status });
  }
}
`;
  }

  /**
   * Generate Next.js App Router route.ts file for an individual entity item [id]
   * @param {object} entity 
   * @returns {string} Route handler code
   */
  static generateItemRoute(entity) {
    const name = entity.name;
    const lowerName = name.toLowerCase();

    return `import { NextRequest, NextResponse } from "next/server";
import { ${name}Controller } from "@/modules/${lowerName}/${lowerName}.controller";
import { formatErrorResponse } from "@/shared/errors";

const controller = new ${name}Controller();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await controller.getById(params.id, request);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error, request.nextUrl.pathname);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await controller.update(params.id, request);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error, request.nextUrl.pathname);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await controller.delete(params.id, request);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error, request.nextUrl.pathname);
    return NextResponse.json(body, { status });
  }
}
`;
  }
}
