# Search & Filter Specification

Purpose
- Provide a canonical spec for full-text search, filters, facets and ranking across the platform.

Index fields (per announcement/listing)
- id: string (PK)
- title: text (indexed - full-text)
- description: text (indexed - full-text)
- category_id: keyword (e.g. `items`, `vehicles`)
- subcategory_id: keyword (e.g. `electronics`, `cars`)
- price_cents: integer (sortable, filterable)
- location: geo / region / city / state (filterable)
- posted_at: datetime (sortable)
- seller_id: uuid
- condition: keyword (new, used, salvaged)
- attributes: object (key/value for faceting: rooms, year, mileage)
- is_premium: boolean (boosted results)

Filterable & Facetable fields
- category_id, subcategory_id
- price range (min/max)
- location (country / state / city)
- condition
- attribute facets (e.g., number_of_rooms, year, mileage ranges)
- seller reputation score / badge

Ranking & Relevancy
- Primary: full-text score (title weighted higher than description)
- Secondary: recency (posted_at) with tunable decay
- Tertiary: paid promotion flag (`is_premium`) and seller reputation
- Apply a small negative weight for listings with missing photos

Language & analyzers
- Support Portuguese (pt), Spanish (es) and English (en)
- Use language-specific tokenization and stopwords for the main text fields
- Provide a light synonym map for common terms (e.g., "apartamento"↔"apartment", "carro"↔"auto")

Autocomplete & suggestions
- Implement prefix completion on `title` and a `suggestions` source derived from recent successful searches and popular titles.

Spell correction & fuzzy match
- Fuzzy matching at edit distance 1 for short queries (<= 4 chars) and 2 for longer queries.

Search engines recommended
- For self-hosted and cost-conscious: PostgreSQL full-text + trigram GIN indexes (good baseline).
- For low-latency relevance and nice UX: Typesense (open-source) or MeiliSearch.
- For enterprise-level feature set: Algolia.

Sync model
- Source of truth: Postgres listings table.
- Incremental sync: on create/update/delete events via background worker or DB trigger to search index.
- Full reindex: nightly job or when schema evolves.

API contract (server-side)
- `GET /api/search?q=&category=&subcategory=&min_price=&max_price=&page=&per_page=&sort=`
- Response: `items`, `total`, `facets` (counts for requested facet fields), `suggestions`.

Privacy & moderation
- Exclude listings from unverified/blocked users from public search results.
- Add a moderation queue flag to omit non-approved listings from index until approved.

Next steps
- Choose engine (Postgres vs Typesense) and implement index migrations and sync worker.
- Create mapping and run a test index with a subset of production data.
