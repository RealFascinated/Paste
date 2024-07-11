FROM fascinated/docker-images:node-pnpm-latest AS frontend

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to fully utilize Docker layer caching
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --production --silent

# Opt out of Next.js telemetry
RUN npx next telemetry disable

# Copy the rest of the files
COPY ./frontend ./

# Use the official Golang image as the base image
FROM golang:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Download the Paste dependencies
COPY go.mod go.sum ./
RUN go mod download

# Prefetch the binaries, so that they will be cached and not downloaded on each change
RUN go run github.com/steebchen/prisma-client-go prefetch

# Copy the source code to the container
COPY ./backend ./

# Generate the Prisma Client Go client
RUN go run github.com/steebchen/prisma-client-go generate

# Build the Go application
RUN make

# Expose the port that the application listens on
EXPOSE 8080
ENV PORT=8080

COPY --from=frontend . /app/frontend

# Run the Paste application and the Fr
CMD ./bin/paste && ./frontend/node_modules/.bin/next start
