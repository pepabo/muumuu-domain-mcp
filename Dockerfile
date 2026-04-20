# Container image for running the Muumuu Domain MCP bridge via stdio.
# This wraps the hosted endpoint at https://mcp.muumuu-domain.com/mcp using mcp-remote,
# so MCP clients that only speak stdio can connect to the remote server.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY bin ./bin

RUN npm install --omit=dev && \
    chmod +x bin/muumuu-mcp.js

ENTRYPOINT ["node", "bin/muumuu-mcp.js"]
