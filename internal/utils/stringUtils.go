package utils

import (
	"math/rand"
	"strings"
)

// Generates a random string of a given length
func RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// Splits a string into lines
func SplitLines(content string) []string {
	return strings.Split(content, "\n")
}