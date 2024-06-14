package model

import "errors"

var ErrPasteTooLarge = errors.New("paste is too large")
var ErrUnableToGeneratePasteKey = errors.New("unable to generate a paste key")