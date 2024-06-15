package errors

import "errors"

var ErrPasteTooLarge = errors.New("paste is too large")
var ErrUnableToGeneratePasteKey = errors.New("unable to generate paste key")
var ErrUnableToConnectToDatabase = errors.New("unable to connect to database")
var ErrInvalidPasteID = errors.New("invalid paste id")