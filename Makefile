# Variables
TARGET = paste
SRC_DIR = ./backend/cmd/paste
BUILD_DIR = ./bin

# Detect the OS
ifeq ($(OS), Windows_NT) # Windows
    RM = cmd /C if exist $(subst /,\,$(BUILD_DIR)) rmdir /S /Q $(subst /,\,$(BUILD_DIR))
    EXE = .exe
    MKDIR = if not exist $(subst /,\,$(BUILD_DIR)) mkdir $(subst /,\,$(BUILD_DIR))
else # Linux and macOS
    UNAME_S := $(shell uname -s)
    RM = rm -rf
    EXE =
    MKDIR = mkdir -p $(BUILD_DIR)
endif

# Default target
all: clean build

# Clean target
clean:
	$(RM)

# Build target
build:
	$(MKDIR)
	go build -o $(BUILD_DIR)/$(TARGET)$(EXE) $(SRC_DIR)/main.go

# Run target
run:
	@echo "Starting frontend and backend..."
	@powershell -File run.ps1

.PHONY: build test run
