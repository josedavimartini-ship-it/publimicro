import { NextResponse } from "next/server";
import { CATEGORIES_BY_SECTION } from "@/lib/categories";

export async function GET() {
  try {
    return NextResponse.json({ data: CATEGORIES_BY_SECTION });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'unknown' }, { status: 500 });
  }
}
