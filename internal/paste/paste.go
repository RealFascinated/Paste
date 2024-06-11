package paste

import (
	"context"
	"time"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/database/mongo"
	"cc.fascinated/paste/internal/database/redis"
	"cc.fascinated/paste/internal/model"
	stringUtils "cc.fascinated/paste/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPaste(id string) (*model.Paste, error) {
	collection := mongo.GetCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var paste model.Paste
	var foundPaste bool

	collection.FindOne(ctx, bson.M{"_id": id}).Decode(&paste)
	if paste.ID != "" { // If the paste exists in MongoDB
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
