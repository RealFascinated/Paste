# Use the official Golang image as the base image
FROM golang:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the source code to the container
COPY . .

# Build the Go application
RUN make

# Stage 2: Create the final image with a smaller base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the necessary files from the builder stage to the final image
COPY --from=builder /app/bin/paste /app/bin/paste
COPY --from=builder /app/public /app/public

# Expose the port that the application listens on
EXPOSE 8080
ENV PORT=8080

# Run the Go application
CMD ["./bin/paste"]
