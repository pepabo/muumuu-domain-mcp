# Container image for running the Muumuu Domain MCP bridge via stdio.
# This wraps the hosted endpoint at https://mcp.muumuu-domain.com/mcp using mcp-remote,
# so MCP clients that only speak stdio can connect to the remote server.
FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node bin ./bin

RUN npm ci --omit=dev && \
    chmod +x bin/muumuu-mcp.js

USER node

ENTRYPOINT ["node", "bin/muumuu-mcp.js"]
