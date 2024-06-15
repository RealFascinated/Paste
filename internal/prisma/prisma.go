package prisma

import (
	"context"
	"fmt"

	"cc.fascinated/paste/db"
	errors "cc.fascinated/paste/internal/error"
)

var prismaClient *db.PrismaClient; // Prisma client

// Connects to the Prisma database
func ConnectPrisma() (err error) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}

	// Defer the disconnect
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(fmt.Errorf("could not disconnect: %w", err))
		}
	}()

	// Check if the database is connected
	_, err = client.Paste.FindFirst().Exec(context.Background())
	if err != nil {
		return errors.ErrUnableToConnectToDatabase
	}
	return nil
}

// Returns the Prisma client
func GetPrismaClient() *db.PrismaClient {
	return prismaClient
}
