---
title: Containers
description: General good practice for building small, secure and reproducible container images.
status: draft
sidebar:
  order: 2
---

:::caution[Draft]
General good practice; no organisation-specific base images or registries are defined here.
:::

## Image guidelines

- **Use minimal, maintained base images** and pin them by digest for reproducibility.
- **Use multi-stage builds** so compilers and build tools never reach the runtime image.
- **Run as a non-root user** and keep the filesystem read-only where possible.
- **Never bake secrets into images**; inject them at runtime.
- **Scan images** for known vulnerabilities in CI and rebuild regularly.

## Example multi-stage Dockerfile (Node.js)

```dockerfile title="Dockerfile"
FROM node:26-slim AS build
WORKDIR /app
RUN npm install --global pnpm@12
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM node:26-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

## Further reading

- [Docker — Building best practices](https://docs.docker.com/build/building/best-practices/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
