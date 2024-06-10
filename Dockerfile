# Use the official Golang image as the base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Makefile and source code to the container
COPY Makefile .
COPY . .

# Build the Go application using the Makefile
RUN make

# Expose the port that the application listens on
EXPOSE 8080

# Run the Go application
CMD ["./bin/paste"]