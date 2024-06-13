package paste

import (
	"context"
	"time"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/model"
	"cc.fascinated/paste/internal/mongo"
	stringUtils "cc.fascinated/paste/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPaste(id string) (*model.Paste, error) {
	collection := mongo.GetCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var paste model.Paste
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&paste)
	if err != nil {
		return nil, err
	}

	paste.LineCount = getLineCount(&paste) // Get the number of lines in the paste
	return &paste, nil
}

// CreatePaste creates a new paste
func CreatePaste(content string) (*model.Paste, error) {
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
		ID:      stringUtils.RandomString(config.GetPasteIDLength()),
		Content: content,
	}

	// Insert the paste into the database
	_, err := collection.InsertOne(ctx, paste)
	if err != nil {
		return nil, err
	}

	return &paste, nil
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
