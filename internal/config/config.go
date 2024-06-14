package config

import (
	"os"
	"strconv"
)

// Gets the mongo connection string from the environment or returns a default value
func GetMongoConnectionString() string {
	return getEnv("MONGO_URI", "mongodb://localhost:27017")
}

// Gets the paste ID length from the environment or returns a default value
func GetPasteIDLength() int {
	lengthStr := getEnv("PASTE_ID_LENGTH", "12")
	length, err := strconv.Atoi(lengthStr)
	if err != nil {
		// handle the error, e.g. return a default value
		return 8
	}
	return length
}

// Gets the maximum paste length from the environment or returns a default value
func GetMaxPasteLength() int {
	lengthStr := getEnv("MAX_PASTE_LENGTH", "5000000")
	length, err := strconv.Atoi(lengthStr)
	if err != nil {
		// handle the error, e.g. return a default value
		return 5000000
	}
	return length

}

// Whether to enable metrics or not (default: false)
func EnableMetrics() bool {
	return getEnv("ENABLE_METRICS", "false") == "true"
}

// Gets a key from the environment or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}