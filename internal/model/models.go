package model

import "errors"

// The Paste model
type Paste struct {
	ID      string `bson:"_id"`
	Content string `bson:"content"`

	// The number of lines in the paste
	LineCount int `bson:"-"` // This field is not stored in the database
}

var ErrPasteTooLarge = errors.New("Paste is too large")
var ErrUnableToGeneratePasteKey = errors.New("Unable to generate a paste key")
var ErrUnknownPaste = errors.New("Unknown Paste")
