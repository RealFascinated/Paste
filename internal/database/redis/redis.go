package redis

import (
	"cc.fascinated/paste/internal/config"
	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client // Redis client

// Connect to Redis
func ConnectRedis() (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     config.GetRedisHost(),
		Password: config.GetRedisPassword(),
		DB:       config.GetRedisDB(),
	})

	redisClient = client
	return client, nil
}

// Get the Redis client
func GetDatabase() *redis.Client {
	return redisClient
}