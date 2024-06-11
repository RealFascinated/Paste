package main

import (
	"fmt"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/database/mongo"
	"cc.fascinated/paste/internal/database/redis"
	"cc.fascinated/paste/internal/routes"
	stringUtils "cc.fascinated/paste/internal/utils"
)

func main() {
	router := routes.NewRouter()

	_, err := redis.ConnectRedis()
	if err != nil {
		fmt.Printf("Error connecting to Redis: %v\n", err)
		return
	}

	fmt.Printf("%s", stringUtils.GetMD5Hash("test")) // Print the MD5 hash of "test" to the console for testing purposes

	_, err = mongo.ConnectMongo(config.GetMongoConnectionString())
	if err != nil {
		fmt.Printf("Error connecting to MongoDB: %v\n", err)
		return
	}

	port := 8080
	router.Logger.Fatal(router.Start(fmt.Sprintf(":%d", port)))
}