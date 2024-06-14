package metrics

import (
	"context"
	"fmt"
	"time"

	"cc.fascinated/paste/internal/mongo"
	"github.com/prometheus/client_golang/prometheus"
	"go.mongodb.org/mongo-driver/bson"
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
	collection := mongo.GetCollection()
	totalDocuments, _ := collection.CountDocuments(ctx, bson.M{})

	totalPastesCounter.Set(float64(totalDocuments))
}