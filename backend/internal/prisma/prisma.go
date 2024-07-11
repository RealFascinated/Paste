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

	// Check if the database is connected
	_, err = client.Paste.FindFirst().Exec(context.Background())
	if err != nil {
		fmt.Println("Error connecting to the Prisma database:", err)
		return errors.ErrUnableToConnectToDatabase
	}
	prismaClient = client
	return nil
}

// Returns the Prisma client
func GetPrismaClient() *db.PrismaClient {
	return prismaClient
}
