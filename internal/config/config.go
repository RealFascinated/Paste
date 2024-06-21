package config

import (
	"os"
	"strconv"
)

var (
	MONGO_URI = getEnv("MONGO_URI", "mongodb://localhost:27017")
	PASTE_ID_LENGTH = getIntEnv("PASTE_ID_LENGTH", 12)
	MAX_PASTE_LENGTH = getIntEnv("MAX_PASTE_LENGTH", 5000000)
	ENABLE_METRICS = getBoolEnv("ENABLE_METRICS", false)
	TEXTBOX_PLACEHOLDER = getEnv("TEXTBOX_PLACEHOLDER", "Enter your text here...")
	HASTEBIN_COMPATIBILITY_URL = getEnv("HASTEBIN_COMPATIBILITY_URL", "/documents")
	SITE_TITLE = getEnv("SITE_TITLE", "Paste")
)

// Returns the environment variable value or a default value if not set.
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// Returns the integer value of an environment variable or a default value if not set or invalid.
func getIntEnv(key string, defaultValue int) int {
	valueStr := getEnv(key, strconv.Itoa(defaultValue))
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}

// Returns the boolean value of an environment variable or a default value if not set or invalid.
func getBoolEnv(key string, defaultValue bool) bool {
	valueStr := getEnv(key, strconv.FormatBool(defaultValue))
	value, err := strconv.ParseBool(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}
