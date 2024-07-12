package routes

import (
	"io"
	"net/http"
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

	// Create the paste
	newPaste, err := paste.CreatePaste(buf.String())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"key": newPaste.ID})
}