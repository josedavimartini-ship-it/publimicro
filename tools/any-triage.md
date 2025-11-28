Priority triage for `@typescript-eslint/no-explicit-any` hotspots

Summary
- Goal: provide small, safe, manual steps per file to replace `any` with narrower types or `unknown`+guards.
- Approach: prefer importing/defining interfaces for API responses and database rows; use `unknown` + runtime checks for external data; avoid large refactors.

Top files (by count) — recommended actions

1) apps/publimicro/src/app/comparar/page.tsx (10 occurrences)
- Problem: `any` used for fetched listing(s) and comparison utilities.
- Fix plan:
  1. Identify fetch call(s) (likely `fetch` or `supabase.from('...')`). Replace `any` with `Listing` or `Listing[]` interface. If no central `Listing` type exists, create a minimal local interface:
     ```ts
     interface Listing { id: number; title?: string; price?: number; fotos?: string[]; }
     ```
  2. Replace `const data: any = await ...` with `const data = await fetchListing() as Listing[];` or better: `const data = (await fetchListing()) as unknown; if (!Array.isArray(data)) throw ...`.
  3. Add small runtime guards where data enters components.
- Quick snippet:
  ```ts
  type Listing = { id: number; title?: string; price?: number; fotos?: string[] };
  const raw = await fetch('/api/properties');
  const data = (await raw.json()) as unknown;
  if (!Array.isArray(data)) return []; // fail safe
  const listings = data as Listing[];
  ```

2) apps/publimicro/src/app/api/admin/phone-preview/route.ts (7 occurrences)
- Problem: `any` used for parsed request body or external API responses.
- Fix plan:
  1. Add a `type PhonePreviewRequest = { phone: string; country?: string }` and use `const body = (await request.json()) as unknown;` then validate shape.
  2. If calling third-party APIs, define response interfaces and narrow them.
- Snippet:
  ```ts
  type PhonePreviewRequest = { phone: string }
  const raw = await request.json() as unknown;
  if (typeof raw !== 'object' || raw === null || typeof (raw as any).phone !== 'string') {
    return new Response('Bad request', { status: 400 });
  }
  const body = raw as PhonePreviewRequest;
  ```

3) apps/publimicro/src/app/api/admin/cleanup-listings/route.ts (5 occurrences)
4) apps/publimicro/src/app/api/admin/property-media/proxy/route.ts (5 occurrences)
5) apps/publimicro/src/app/api/admin/property-media/route.ts (5 occurrences)
6) apps/publimicro/src/app/api/background-check/route.ts (5 occurrences)
7) apps/publimicro/src/app/api/webhooks/stripe-enhancements/route.ts (5 occurrences)
- Combined guidance for API routes:
  - Always treat `request.json()` as `unknown`. Validate required fields with small guards, then cast to typed interface.
  - For Supabase responses, create small types matching query results (e.g., `type PropertyRow = { id: number; fotos: string[] }`).
  - Avoid `any` in `catch` blocks — use `unknown` and `console.error(String(err))` or `if (err instanceof Error) ...`.
- Example for a route handler:
  ```ts
  import { NextResponse } from 'next/server';
  type Payload = { propertyId: number }
  export async function POST(req: Request) {
    const raw = await req.json() as unknown;
    if (typeof raw !== 'object' || raw === null || typeof (raw as any).propertyId !== 'number') {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    const { propertyId } = raw as Payload;
    // ...
  }
  ```

8) apps/publimicro/src/app/api/admin/settings/proxy/route.ts (4 occurrences)
- Same as other API routes: define small interfaces and validate.

9) apps/publimicro/src/components/map/MapKmlViewer.tsx (3 occurrences)
- Problem: `any` in KML parsing or Leaflet handlers.
- Fix plan:
  - Replace `any` with `Document | Element` or `XMLDocument` for parsed XML, or use `unknown` + guards before treating as expected shape.
  - Example: `const xml = new DOMParser().parseFromString(str, 'application/xml');` then use DOM APIs with proper types.

10) apps/publimicro/src/components/UserQuickPanel.tsx (3 occurrences)
- Problem: `any` for profile or notifications payloads.
- Fix plan: import `UserProfile` or define minimal fields used by component.

11) apps/publimicro/src/lib/carcaraHelpers.ts (3 occurrences)
12) apps/publimicro/src/lib/supabaseServer.ts (3 occurrences)
- For helpers and supabase server client:
  - Replace `any` with `unknown` on external JSON then validate.
  - Replace non-null assertions (`!`) with explicit checks and return early.
  - Example: `const res = await supabase.from('...').select(); const rows = res.data as YourRowType[] | null; if (!rows) return [];`

General quick rules (low-risk):
- Prefer `unknown` for external data then narrow with type guards.
- Create small local types rather than sweeping refactors.
- Avoid editing many files at once — do this per-file and test builds between small groups (keeps memory usage low).

Execution plan for triage
1. I will prepare a per-file patch suggestion list (this `tools/any-triage.md`), marking quick fixes that are safe to apply.
2. If you want, I can apply trivial replacements automatically (e.g., `any` → `unknown` + a small guard) for a small subset (1–5 files) and run `pnpm -s type-check` each time.
3. For API routes and Supabase interactions, avoid aggressive automation — I will prepare exact code snippets and you/your team can review/apply them.

Where to start (recommendation)
- First 3 files to fix manually: `comparar/page.tsx`, `app/api/admin/phone-preview/route.ts`, `app/api/background-check/route.ts` (they are high-impact). I can open and propose exact edits for each.

Artifacts
- This file: `tools/any-triage.md` (you are reading it now).
- If you want, I can convert each bullet into an `apply_patch` change and apply 1 file at a time.

If you'd like me to begin applying small, safe automated changes, pick which file to start with (I recommend `app/api/admin/phone-preview/route.ts` or `comparar/page.tsx`).
