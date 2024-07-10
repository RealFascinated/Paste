package routes

import (
	"net/http"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/paste"
	"github.com/labstack/echo/v4"
)

// Renders the paste content
func renderHome(c echo.Context) error {
	// Render the paste
	return c.Render(http.StatusOK, "index.html", map[string]interface{}{
		"title": config.SITE_TITLE,
		"textboxPlaceholder": config.TEXTBOX_PLACEHOLDER,
	})
}

// Renders the paste content
func renderPaste(c echo.Context) error {
	// Get the paste ID
	id := c.Param("id")
	if id == "" {
		return c.Redirect(http.StatusFound, "/")
	}

	// Get the paste
	paste, err := paste.GetPaste(id)
	if err != nil {
		return c.Redirect(http.StatusFound, "/")
	}

	// Render the paste
	return c.Render(http.StatusOK, "paste.html", map[string]interface{}{
		"title": config.SITE_TITLE + " - " + paste.ID,
		"content": paste.Content,
		"rawUrl": "/raw/" + paste.ID,
		"lineCount": paste.LineCount,
		"sizeBytes": paste.SizeBytes,
	})
}

// Renders the raw paste content
func renderPasteRaw(c echo.Context) error {
	// Get the paste ID
	id := c.Param("id")
	if id == "" {
		return c.Redirect(http.StatusFound, "/")
	}

	// Get the paste
	paste, err := paste.GetPaste(id)
	if err != nil {
		return c.Redirect(http.StatusFound, "/")
	}

	// Render the paste
	return c.Render(http.StatusOK, "paste-raw.html", map[string]interface{}{
		"title": config.SITE_TITLE + " - " + paste.ID + " (Raw)",
		"content": paste.Content,
		"lineCount": paste.LineCount,
		"sizeBytes": paste.SizeBytes,
	})
}