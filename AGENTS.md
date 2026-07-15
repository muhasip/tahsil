# Tahsil customer documentation instructions

This public repository contains only the Mintlify documentation for Tahsil customers.

## Canonical contract

- Public customer API source: `https://api.tahsil.dev/openapi`
- Reviewed snapshot: `openapi/openapi.yaml`
- Authentication: Bearer user session only
- Tenant scope: `x-company-id` for writes and optional `x-company-ids` for multi-company reads

## Content boundaries

- Do not add platform administration endpoints, bootstrap operations, or internal product/billing CRUD.
- Do not add server-to-server integration credentials or special integration contracts.
- Do not mention or expose the provider service, bank credential values, tokens, cookies, request bodies with real customer data, or internal infrastructure.
- Do not copy source code from the server repository into this repository.
- Example values must be synthetic.

## Writing style

- Write in Turkish for the initial release.
- Address the Tahsil customer directly and use concise, active sentences.
- Use sentence case for headings and backticks for paths, headers, and code identifiers.
- Keep the API reference generated from `openapi/openapi.yaml`; use MDX for task-oriented guides.

## Verification

Run `npm run ci` before committing. The content guard must report exactly 81 customer operations and reject private platform or special integration shapes.

## Server contract synchronization

- The canonical local customer contract is `../../server/project/docs/openapi.yaml`.
- After every reviewed change to that file, run `npm run sync:openapi:local` in this repository before either repository is committed.
- Update `degisiklikler.mdx` in the same change with a customer-readable date entry. Separate added, changed, deprecated, removed, and security-relevant behavior when applicable; do not copy internal implementation details.
- If the customer operation count changes intentionally, update the exact-count guards in `scripts/sync-openapi.mjs` and `scripts/check-content.mjs` only after confirming that no platform, bootstrap, or special integration operation entered the snapshot.
- Run `npm run ci` after synchronization. Server and documentation repositories remain separate Git histories and must be committed independently.
