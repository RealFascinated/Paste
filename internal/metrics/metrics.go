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

var avgPasteSizeCounter = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "avg_paste_size",
		Help: "Average size of pastes",
	})

var avgLineCountCounter = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "avg_line_count",
		Help: "Average number of lines in pastes",
	})

func RegisterMetrics() {
	prometheus.Register(totalPastesCounter)
	prometheus.Register(avgPasteSizeCounter)
	prometheus.Register(avgLineCountCounter)
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
	pastes, err := prisma.GetPrismaClient().Paste.FindMany().Select(
		db.Paste.SizeBytes.Field(),
		db.Paste.LineCount.Field(),
	).Exec(ctx)
	if err != nil {
		fmt.Println("Error fetching pastes:", err)
		return
	}

	avgSize, avgLineCount := 0, 0
	for _, paste := range pastes {
		avgSize += paste.SizeBytes
		avgLineCount += paste.LineCount
	}
	avgSize /= len(pastes)
	avgLineCount /= len(pastes)

	totalPastesCounter.Set(float64(len(pastes)))
	avgPasteSizeCounter.Set(float64(avgSize))
	avgLineCountCounter.Set(float64(avgLineCount))
}