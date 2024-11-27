FROM oven/bun:1.1.33-alpine AS base

# Set the environment
ENV NODE_ENV production

# Install dependencies
FROM base AS depends
WORKDIR /app
COPY . .
RUN bun install

# Build the app
FROM base AS build
WORKDIR /app
COPY . .
RUN bun build

# Expose the app port
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["bun", "src/server.ts"]