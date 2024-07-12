package routes

import (
	"io"
	"net/http"
	"strconv"
	"strings"

	"cc.fascinated/paste/internal/paste"
	"github.com/labstack/echo/v4"
)

// Gets a paste by its ID
func getPaste(c echo.Context) error {
	id := c.Param("id")
	paste, err := paste.GetPaste(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Unknown Paste"})
	}
	return c.JSON(http.StatusOK, paste)
}

// Creates a new paste
func createPaste(c echo.Context) error {
	// Get the request body
	buf := new(strings.Builder)
	_, err := io.Copy(buf, c.Request().Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error reading the request"})
	}

	// Parse the expiration time
	expiresString := c.QueryParam("expires")
	expires := 0
	if expiresString != "" {
		number, err := strconv.ParseInt(expiresString, 10, 64)
		if err != nil || // Error parsing 
			number < 0 || // Negative number
			number < 3600 || // Less than an hour
			number > 31536000 || // More than a year
			number == 0 { // Zero
			return c.JSON(http.StatusBadRequest, map[string]string{
				"message": "Invalid expiration time (must be in seconds and between 1 hour and 1 year)",
			})
		}

		expires = int(number)
	}

	// Create the paste
	newPaste, err := paste.CreatePaste(buf.String(), expires)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"key": newPaste.ID})
}