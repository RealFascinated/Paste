package stringUtils

import (
	"crypto/md5"
	"encoding/hex"
	"math/rand"
)

// Generates a random string of a given length
func RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// Generates an MD5 hash of a given text
func GetMD5Hash(text string) string {
 hash := md5.Sum([]byte(text))
 return hex.EncodeToString(hash[:])
}