package paste

import (
	"context"
	"fmt"
	"time"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/model"
	"cc.fascinated/paste/internal/mongo"
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
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&paste)
	if err != nil {
		fmt.Printf("Unable to find paste \"%s\"\n", id)
		return nil, err
	}

	paste.LineCount = getLineCount(&paste) // Get the number of lines in the paste
	fmt.Printf("Found paste \"%s\" in %fms\n", id, time.Since(before).Seconds()*1000)
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

	// Create a new paste
	paste := model.Paste{
		ID:      getNextPasteID(),
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

	// Generate a new ID if the current one is already in use
	for {
		_, err := mongo.GetCollection().FindOne(context.Background(), bson.M{"_id": id}).Raw()
		if err != nil {
			break
		}
		fmt.Printf("Paste key \"%s\" already in use\n", id)
		id = stringUtils.RandomString(config.GetPasteIDLength())
	}
	fmt.Printf("Generated paste key \"%s\"\n", id)
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
