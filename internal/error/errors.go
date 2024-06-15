package errors

import "errors"

var (
	ErrPasteTooLarge = errors.New("paste is too large")
	ErrUnableToGeneratePasteKey = errors.New("unable to generate paste key")
	ErrUnableToConnectToDatabase = errors.New("unable to connect to database")
	ErrInvalidPasteID = errors.New("invalid paste id")
)