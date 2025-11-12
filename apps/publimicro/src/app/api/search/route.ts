import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function tableForSection(section: string) {
  // Mapping rules: map known site sections to the DB tables we manage.
  // Extend this mapping as new domain-specific tables are added.
  const s = (section || "").toLowerCase();
  if (s === "properties" || s === "imoveis") return "properties";
  if (s === "sitios" || s === "projetos" || s === "carcara") return "properties";
  // Motors, machinery and marine currently live in the generic listings table.
  if (s === "motors" || s === "machina" || s === "marine" || s === "motors" || s === "classificados" || s === "acheme-coisas") return "listings";
  // Default fallback
  return "listings";
}

export async function GET(req: NextRequest) {
  // Auto-suggest endpoint: /api/search?q=...&section=...
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const section = searchParams.get("section") || "listings";

    if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });

    const table = tableForSection(section);
    // search title/name and description - tuned per-table
    const ilike = `%${q}%`;

    // Select sensible suggestion fields depending on table
    const selectFields = table === "properties" ? "id,title,slug" : "id,title,name,brand,model,slug";

    // Build OR filters depending on available fields for the table
    const orParts: string[] = [];
    orParts.push(`title.ilike.${ilike}`);
    orParts.push(`name.ilike.${ilike}`);
    orParts.push(`slug.ilike.${ilike}`);
    orParts.push(`description.ilike.${ilike}`);
    if (table === "listings") {
      // For vehicle/machinery listings, also search brand/model
      orParts.push(`brand.ilike.${ilike}`);
      orParts.push(`model.ilike.${ilike}`);
    }

    const orFilter = orParts.join(",");

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .or(orFilter)
      .limit(8);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data || [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "unknown" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      section = "properties",
      query = "",
      category,
      subcategory,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      sortBy = "newest",
      limit = 20,
      offset = 0,
    } = body || {};

    const table = tableForSection(section);
    let qb: any = supabase.from(table).select("*", { count: "exact" });

    // Full-text-ish filters (simple ilike ranges for now)
    if (query) {
      const ilike = `%${query}%`;
      const orParts = [`title.ilike.${ilike}`, `description.ilike.${ilike}`, `location.ilike.${ilike}`];
      if (table === "listings") {
        orParts.push(`name.ilike.${ilike}`, `brand.ilike.${ilike}`, `model.ilike.${ilike}`);
      }
      qb = qb.or(orParts.join(","));
    }

    // Numeric filters
    if (priceMin !== undefined && priceMin !== null) qb = qb.gte("price", Number(priceMin));
    if (priceMax !== undefined && priceMax !== null) qb = qb.lte("price", Number(priceMax));

    if (areaMin !== undefined && areaMin !== null) qb = qb.gte("area_total", Number(areaMin));
    if (areaMax !== undefined && areaMax !== null) qb = qb.lte("area_total", Number(areaMax));

    // Section-specific filters (vehicles / machinery)
    if (body.brand) qb = qb.eq("brand", body.brand);
    if (body.model) qb = qb.eq("model", body.model);
    if (body.yearMin !== undefined && body.yearMin !== null) qb = qb.gte("year", Number(body.yearMin));
    if (body.yearMax !== undefined && body.yearMax !== null) qb = qb.lte("year", Number(body.yearMax));

    if (category) qb = qb.eq("category", category);
    if (subcategory) qb = qb.eq("subcategory", subcategory);

    // Sorting
    switch (sortBy) {
      case "price_asc":
        qb = qb.order("price", { ascending: true });
        break;
      case "price_desc":
        qb = qb.order("price", { ascending: false });
        break;
      case "area_desc":
        qb = qb.order("area_total", { ascending: false });
        break;
      case "year_desc":
        qb = qb.order("year", { ascending: false });
        break;
      case "newest":
      default:
        qb = qb.order("created_at", { ascending: false });
        break;
    }

    qb = qb.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error, count } = await qb;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "unknown" }, { status: 500 });
  }
}
