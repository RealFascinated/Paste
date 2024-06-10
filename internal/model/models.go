package model

import "errors"

// The Paste model
type Paste struct {
	ID      string `bson:"_id"`
	Content string `bson:"content"`
}

var ErrPasteTooLarge = errors.New("Paste is too large")