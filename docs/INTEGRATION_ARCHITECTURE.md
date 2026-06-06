# Integration Architecture

## Principle

Single Source of Truth. Multiple Distribution Channels.

The internal catalog must remain platform-agnostic. Each external platform adapts to the internal catalog through its own connector.

---

## Goal

Create a reusable omnichannel integration layer capable of distributing catalog data to multiple external platforms.

Current active connector:

- Meta Commerce

Future connectors:

- Google Merchant Center
- Pinterest
- Mercado Libre
- TikTok Shop
- Shopify
- WooCommerce

---

## Current Flow

Google Sheets
→ Product Loader
→ Internal Product Model
→ Connector Mapper
→ Export File
→ External Platform

---

## Target Structure

src/modules/integrations/
├── engine/
│   ├── CatalogEngine.ts
│   ├── ValidationEngine.ts
│   └── ExportEngine.ts
├── connectors/
│   ├── meta/
│   │   ├── mapper.ts
│   │   ├── validator.ts
│   │   └── exporter.ts
│   ├── google/
│   ├── pinterest/
│   └── mercadolibre/
├── types/
└── utils/

scripts/
├── feeds/
│   ├── generate-meta-feed.ts
│   ├── generate-google-feed.ts
│   └── generate-pinterest-feed.ts
├── prepare.ts
└── publish.ts

public/api/exports/
├── meta.csv
├── google.xml
├── pinterest.csv
└── status.json

---

## Connector Contract

Every connector should implement three responsibilities:

### mapper.ts

Transforms an internal product into the external platform format.

### validator.ts

Validates platform-specific rules before export.

### exporter.ts

Generates the final output: CSV, XML, JSON, or API payload.

---

## Command Standard

### Feed generation

npm run feed:meta

Future:

npm run feed:google
npm run feed:pinterest
npm run feed:mercadolibre

---

### Prepare

npm run prepare

Responsibilities:

- Generate feeds
- Validate catalog
- Generate status files
- Build the app

---

### Publish

npm run publish

Future responsibilities:

- Deploy to production
- Clear cache
- Run health checks
- Verify public exports
- Notify result

---

## Naming Rules

Avoid brand-specific names inside reusable integration modules.

Use:

- integrations
- connectors
- engine
- exports
- feed
- catalog
- publish

Avoid:

- brand-specific module names
- business-specific connector names
- hardcoded brand logic inside the engine

---

## Rule of Ownership

The internal catalog owns the product data.

Connectors own platform-specific transformations.

The engine owns orchestration.

Scripts own execution.

---

## Active MVP

Meta Commerce connector is active and exports:

/api/exports/meta.csv

It currently supports:

- Facebook Shop
- Instagram Shopping
- WhatsApp Catalog

---

## Roadmap

### Phase 1

Meta Commerce feed.

Status: complete.

### Phase 2

Generic integration architecture.

Status: in progress.

### Phase 3

Admin integrations dashboard.

Route proposal:

/admin/integrations

### Phase 4

Google Merchant Center feed.

Output:

/api/exports/google.xml

### Phase 5

Pinterest product feed.

Output:

/api/exports/pinterest.csv

### Phase 6

Marketplace API connectors.

Examples:

- Mercado Libre
- TikTok Shop
- Shopify
- WooCommerce

### Phase 7

Automated publish pipeline.

prepare
→ build
→ deploy
→ cache clear
→ health check
→ notify

---

## Guiding Phrase

Single Source of Truth. Multiple Distribution Channels.
