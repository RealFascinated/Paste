package metrics

import (
	"context"
	"fmt"
	"time"

	"cc.fascinated/paste/db"
	"cc.fascinated/paste/internal/prisma"
	"github.com/prometheus/client_golang/prometheus"
)

var totalPastesCounter = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "total_pastes",
		Help: "Total number of pastes",
	})

var avgPasteSize = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "avg_paste_size",
		Help: "Average size of pastes",
	})

func RegisterMetrics() {
	prometheus.Register(totalPastesCounter)
	prometheus.Register(avgPasteSize)
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

// Updates the metrics
func updateMetrics() {
	fmt.Println("Updating metrics...")
	ctx := context.Background()

	// todo: since this will grow and grow over time, we should probably
	// use a count query instead but idk how to do that in prisma
	pastes, err := prisma.GetPrismaClient().Paste.FindMany().Select(db.Paste.LineCount.Field()).Exec(ctx)
	if err != nil {
		fmt.Println("Error fetching pastes:", err)
		return
	}

	avgSize := 0
	for _, paste := range pastes {
		avgSize += paste.SizeBytes
	}
	avgSize /= len(pastes)

	totalPastesCounter.Set(float64(len(pastes)))
	avgPasteSize.Set(float64(avgSize))
}