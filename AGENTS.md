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

Run `npm run ci` before committing. The content guard must report exactly 57 customer operations and reject private platform or special integration shapes.
