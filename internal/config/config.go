package config

import (
	"os"
	"strconv"
	"fmt"
)

// Gets the mongo connection string from the environment or returns a default value
func GetMongoConnectionString() string {
	return getEnv("MONGO_URI", "mongodb://localhost:27017")
}

// Gets the redis host from the environment or returns a default value
func GetRedisHost() string {
	return getEnv("REDIS_HOST", "10.0.50.98:6379")
}

// Gets the redis password from the environment or returns a default value
func GetRedisPassword() string {
	return getEnv("REDIS_PASSWORD", "")
}

// Gets the redis DB from the environment or returns a default value
func GetRedisDB() int {
	dbStr := getEnv("REDIS_DB", "0")
	db, err := strconv.Atoi(dbStr)
	if err != nil {
		// handle the error, e.g. return a default value
		fmt.Println("using fallback redis db index")
		return 0
	}
	return db
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

// Gets a key from the environment or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}