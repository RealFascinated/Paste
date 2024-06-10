package mongo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client // MongoDB client

// Connect to MongoDB
func ConnectMongo(connectionString string) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionString))
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	mongoClient = client
	return client, nil
}

// Get the MongoDB database
func GetDatabase() *mongo.Database {
	return mongoClient.Database("paste")
}

// Get the MongoDB collection
func GetCollection() *mongo.Collection {
	return GetDatabase().Collection("paste")
}