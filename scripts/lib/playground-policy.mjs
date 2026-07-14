const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

export function isInteractiveOperation(method, path) {
  return method === 'get' || (method === 'post' && path === '/banks/dashboard/query');
}

export function applyPlaygroundPolicy(document) {
  for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem?.[method];
      if (!operation) continue;

      operation['x-mint'] = {
        ...(operation['x-mint'] ?? {}),
        metadata: {
          ...(operation['x-mint']?.metadata ?? {}),
          playground: isInteractiveOperation(method, path) ? 'interactive' : 'simple',
        },
      };
    }
  }

  return document;
}

export function countPlaygroundModes(document) {
  const counts = { interactive: 0, simple: 0 };
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const mode = pathItem?.[method]?.['x-mint']?.metadata?.playground;
      if (mode === 'interactive' || mode === 'simple') counts[mode] += 1;
    }
  }
  return counts;
}
