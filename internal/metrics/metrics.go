package metrics

import (
	"context"
	"fmt"
	"time"

	"cc.fascinated/paste/internal/prisma"
	"github.com/prometheus/client_golang/prometheus"
)

var totalPastesCounter = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "total_pastes",
		Help: "Total number of pastes",
	})

func RegisterMetrics() {
	prometheus.Register(totalPastesCounter)
}

// Starts the metrics updater (runs every 1 minute)
func InitMetricsUpdater() {
	go func() {
		for {
			updateMetrics()
			<-time.After(1 * time.Minute)
		}
	}()
}

func updateMetrics() {
	fmt.Println("Updating metrics...")
	ctx := context.Background()

	// todo: since this will grow and grow over time, we should probably
	// use a count query instead but idk how to do that in prisma
	pastes, err := prisma.GetPrismaClient().Paste.FindMany().Exec(ctx)
	if err != nil {
		fmt.Println("Error fetching pastes:", err)
		return
	}

	totalPastesCounter.Set(float64(len(pastes)))
}