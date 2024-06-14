package prisma

import "cc.fascinated/paste/db"

var prismaClient *db.PrismaClient;

// Connects to the Prisma database
func ConnectPrisma() (err error) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}
	prismaClient = client
	return nil
}

// Returns the Prisma client
func GetPrismaClient() *db.PrismaClient {
	return prismaClient
}