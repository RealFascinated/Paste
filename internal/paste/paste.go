package paste

import (
	"context"
	"fmt"
	"time"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/database/mongo"
	"cc.fascinated/paste/internal/database/redis"
	"cc.fascinated/paste/internal/model"
	stringUtils "cc.fascinated/paste/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPaste(id string) (*model.Paste, error) {
	fmt.Printf("Getting paste \"%s\"...\n", id)
	before := time.Now()
	collection := mongo.GetCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var paste model.Paste
	var foundPaste bool

	collection.FindOne(ctx, bson.M{"_id": id}).Decode(&paste)
	if paste.ID != "" { // If the paste exists in MongoDB
		paste.LineCount = getLineCount(&paste) // Get the number of lines in the paste
		fmt.Printf("Found paste \"%s\" in %fms\n", id, time.Since(before).Seconds()*1000)
		return &paste, nil
	}

	// !!!!!! THIS IS REALLY SHIT LOLLL !!!!!!!!!!!!!
	redisClient := redis.GetDatabase()
	pasteContent, _ := redisClient.Get(ctx, stringUtils.GetMD5Hash(id)).Result()
	if pasteContent != "" { // If the paste exists in Redis
		paste = model.Paste{
			ID:      id,
			Content: pasteContent,
		}

		// Add the paste to Mongo
		_, err := collection.InsertOne(ctx, paste)
		if err != nil {
			return nil, err
		}

		foundPaste = true
	}

	// No paste found
	if !foundPaste {
		return nil, model.ErrUnknownPaste
	}

	paste.LineCount = getLineCount(&paste) // Get the number of lines in the paste
	fmt.Printf("Found and migrated paste from redis \"%s\" in %fms\n", id, time.Since(before).Seconds()*1000)
	return &paste, nil
}

// CreatePaste creates a new paste
func CreatePaste(content string) (*model.Paste, error) {
	fmt.Println("Creating paste...")
	before := time.Now()
	// Get the length of the content
	contentLength := len(content)
	if contentLength > config.GetMaxPasteLength() {
		return nil, model.ErrPasteTooLarge
	}

	collection := mongo.GetCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	id := getNextPasteID()
	if id == "" { // Unable to generate a paste key
		return nil, model.ErrUnableToGeneratePasteKey
	}

	// Create a new paste
	paste := model.Paste{
		ID:      id,
		Content: content,
	}

	// Insert the paste into the database
	_, err := collection.InsertOne(ctx, paste)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Created paste \"%s\" in %fms\n", paste.ID, time.Since(before).Seconds()*1000)
	return &paste, nil
}

// Get the next available paste ID
func getNextPasteID() string {
	id := stringUtils.RandomString(config.GetPasteIDLength())
	currentIteration := 0

	// Generate a new ID if the current one is already in use
	for {
		if currentIteration >= 100 {
			fmt.Println("Unable to generate a unique paste key after 100 attempts, maybe increase the paste key length?")
			return ""
		}

		_, err := mongo.GetCollection().FindOne(context.Background(), bson.M{"_id": id}).Raw()
		if err != nil {
			break
		}
		fmt.Printf("Paste key \"%s\" already in use\n", id)
		id = stringUtils.RandomString(config.GetPasteIDLength())
		currentIteration++
	}
	fmt.Printf("Generated paste key \"%s\" in %d iterations\n", id, currentIteration)
	return id
}

// Gets the number of lines in a paste
func getLineCount(paste *model.Paste) int {
	lineCount := 0
	for _, char := range paste.Content {
		if char == '\n' {
			lineCount++
		}
	}
	return lineCount
}
