package paste

import (
	"context"
	"fmt"
	"strings"
	"time"

	"cc.fascinated/paste/db"
	"cc.fascinated/paste/internal/config"
	errors "cc.fascinated/paste/internal/error"
	"cc.fascinated/paste/internal/prisma"
	stringUtils "cc.fascinated/paste/internal/utils"
	"github.com/DmitriyVTitov/size"
)

// Gets a paste by its ID
func GetPaste(id string) (*db.PasteModel, error) {
	fmt.Printf("Getting paste \"%s\"...\n", id)
	before := time.Now()

	if strings.Contains(id, "/") { // This was causing a panic w/o it???????
		return nil, errors.ErrInvalidPasteID
	}
	
	paste, err := prisma.GetPrismaClient().Paste.FindFirst(db.PasteEqualsWhereParam(
		db.Paste.ID.Equals(id),
	)).Exec(context.Background())

	if err != nil {
		return nil, err
	}

	// Update data if it's missing
	// todo: CLEAN THIS UP AAAAAAAAHHHHHHHHHHHHHHHH
	if paste.SizeBytes == 0 || paste.LineCount == 0 {
		// Update the paste object
		paste.SizeBytes = size.Of(paste.Content)
		paste.LineCount = getLineCount(paste.Content)

		// Save the new data
		_, err := prisma.GetPrismaClient().Paste.FindMany(db.Paste.ID.Equals(id)).Update(
			db.Paste.SizeBytes.Set(paste.SizeBytes),
			db.Paste.LineCount.Set(paste.LineCount),
		).Exec(context.Background())
		if err != nil {
			fmt.Println("Error updating paste size and line count:", err)
			return nil, err
		}
	}

	fmt.Printf("Found paste \"%s\" in %fms\n", id, time.Since(before).Seconds()*1000)
	return paste, nil
}

// CreatePaste creates a new paste
func CreatePaste(content string) (*db.PasteModel, error) {
	fmt.Println("Creating paste...")
	before := time.Now()
	// Get the length of the content
	contentLength := len(content)
	if contentLength > config.MAX_PASTE_LENGTH {
		return nil, errors.ErrPasteTooLarge
	}

	id := getNextPasteID()
	if id == "" { // Unable to generate a paste key
		return nil, errors.ErrUnableToGeneratePasteKey
	}

	paste, err := prisma.GetPrismaClient().Paste.CreateOne(
		db.Paste.ID.Set(id),
		db.Paste.Content.Set(content),
	).Exec(context.Background())
	if err != nil {
		return nil, err
	}

	// Update the paste object
	paste.SizeBytes = size.Of(content)
	paste.LineCount = getLineCount(content)

	// Save the new data
	_, err = prisma.GetPrismaClient().Paste.FindMany(db.Paste.ID.Equals(id)).Update(
		db.Paste.SizeBytes.Set(paste.SizeBytes),
		db.Paste.LineCount.Set(paste.LineCount),
	).Exec(context.Background())

	fmt.Printf("Created paste \"%s\" in %fms\n", paste.ID, time.Since(before).Seconds()*1000)
	return paste, nil
}

// Get the next available paste ID
func getNextPasteID() string {
	id := stringUtils.RandomString(config.PASTE_ID_LENGTH)
	currentIteration := 0

	// Generate a new ID if the current one is already in use
	for {
		if currentIteration >= 100 {
			fmt.Println("Unable to generate a unique paste key after 100 attempts, maybe increase the paste key length?")
			return ""
		}

		// Check if the paste key is already in use
		_, err := prisma.GetPrismaClient().Paste.FindFirst(db.PasteEqualsWhereParam(
			db.Paste.ID.Equals(id),
		)).Exec(context.Background())
		if err != nil {
			break
		}

		fmt.Printf("Paste key \"%s\" already in use\n", id)
		id = stringUtils.RandomString(config.PASTE_ID_LENGTH)
		currentIteration++
	}
	fmt.Printf("Generated paste key \"%s\" in %d iterations\n", id, currentIteration)
	return id
}

// Gets the number of lines in a paste
func getLineCount(content string) int {
	return len(stringUtils.SplitLines(content))
}
