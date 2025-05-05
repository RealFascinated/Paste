FROM oven/bun:1.1.38-alpine AS base

# Set the environment
ENV NODE_ENV production

# Build the app
FROM base AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Production image
FROM base AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src/server.ts ./src/server.ts

# Expose the app port
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["bun", "src/server.ts"]