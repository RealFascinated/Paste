package routes

import (
	"cc.fascinated/paste/internal/config"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
)

// Initializes the routes for the application.
func InitRoutes(router *echo.Echo) {
	if config.ENABLE_METRICS { // Check if metrics are enabled
		router.GET("/metrics", echoprometheus.NewHandler())
	}

	// Static Files
	router.Static("/assets", "public/assets")

	// Favicon
	router.File("/favicon.ico", "public/assets/favicon.ico")

	// Robots.txt
	router.File("/robots.txt", "public/assets/robots.txt")

	// Site
	router.GET("/", renderHome)
	router.GET("/:id", renderPaste)
	router.GET("/raw/:id", renderPasteRaw)

	// API Routes
	router.GET("/api/paste/:id", getPaste)
	router.POST(config.HASTEBIN_COMPATIBILITY_URL, createPaste) // Hastebin compatibility
	router.POST("/api/upload", createPaste)
}