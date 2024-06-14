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
COPY . .

# Generate the Prisma Client Go client
RUN go run github.com/steebchen/prisma-client-go generate

# Build the Go application
RUN make

# Expose the port that the application listens on
EXPOSE 8080
ENV PORT=8080

# Run the Paste application
CMD ["./bin/paste"]
