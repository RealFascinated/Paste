package main

import (
	"fmt"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/mongo"
	"cc.fascinated/paste/internal/routes"
)

func main() {
	router := routes.NewRouter()

	_, err := mongo.ConnectMongo(config.GetMongoConnectionString())
	if err != nil {
		fmt.Printf("Error connecting to MongoDB: %v\n", err)
		return
	}

	port := 8080
	router.Logger.Fatal(router.Start(fmt.Sprintf(":%d", port)))
}