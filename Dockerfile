FROM oven/bun:1.1.38-alpine AS base

# Set the environment
ENV NODE_ENV production

# Build the app
FROM base AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bunx prisma@6.7.0 generate
RUN bun run build

# Expose the app port
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["bun", "src/server.ts"]