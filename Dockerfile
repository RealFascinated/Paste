# Stage 1: Build the Go application
FROM golang:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Makefile and source code to the container
COPY Makefile .
COPY . .

# Build the Go application using the Makefile
RUN make

# Stage 2: Create the final image with a smaller base image
FROM alpine:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/bin/paste /app/bin/paste

# Expose the port that the application listens on
EXPOSE 8080
ENV PORT=8080

# Run the Go application
CMD ["./bin/paste"]
