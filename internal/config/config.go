package config

import (
	"os"
	"strconv"
)

// GetMongoConnectionString returns the MongoDB connection string from the environment or a default value.
func GetMongoConnectionString() string {
	return getEnv("MONGO_URI", "mongodb://localhost:27017")
}

// GetPasteIDLength returns the paste ID length from the environment or a default value.
func GetPasteIDLength() int {
	return getIntEnv("PASTE_ID_LENGTH", 12)
}

// GetMaxPasteLength returns the maximum paste length from the environment or a default value.
func GetMaxPasteLength() int {
	return getIntEnv("MAX_PASTE_LENGTH", 5000000)
}

// EnableMetrics returns whether to enable metrics or not (default: false).
func EnableMetrics() bool {
	return getEnv("ENABLE_METRICS", "false") == "true"
}

// getEnv returns the environment variable value or a default value if not set.
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// getIntEnv returns the integer value of an environment variable or a default value if not set or invalid.
func getIntEnv(key string, defaultValue int) int {
	valueStr := getEnv(key, strconv.Itoa(defaultValue))
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}
