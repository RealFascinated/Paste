package main

import (
	"fmt"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/metrics"
	"cc.fascinated/paste/internal/mongo"
	"cc.fascinated/paste/internal/routes"
)

func main() {
	fmt.Println("Starting Paste...")
	router := routes.NewRouter()

	_, err := mongo.ConnectMongo(config.GetMongoConnectionString())
	if err != nil {
		fmt.Printf("Error connecting to MongoDB: %v\n", err)
		return
	}

	if config.EnableMetrics() {	// Check if metrics are enabled
		metrics.RegisterMetrics() // Register the metrics
		metrics.InitMetricsUpdater() // Start the metrics updater
	}

	port := 8080
	router.Logger.Fatal(router.Start(fmt.Sprintf(":%d", port)))
}