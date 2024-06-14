package main

import (
	"fmt"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/metrics"
	"cc.fascinated/paste/internal/prisma"
	"cc.fascinated/paste/internal/routes"
)

func main() {
	fmt.Println("Starting Paste...")
	router := routes.NewRouter()

	// Connect to the Prisma database
	err := prisma.ConnectPrisma()
	if err != nil {
		fmt.Println("Error connecting to the Prisma database:", err)
		return
	}

	if config.EnableMetrics() {	// Check if metrics are enabled
		metrics.RegisterMetrics() // Register the metrics
		metrics.InitMetricsUpdater() // Start the metrics updater
	}

	port := 8080
	router.Logger.Fatal(router.Start(fmt.Sprintf(":%d", port)))
}