package routes

import (
	"cc.fascinated/paste/internal/config"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
)

// Initializes the routes for the application.
func InitRoutes(router *echo.Echo) {
	if config.EnableMetrics() { // Check if metrics are enabled
		router.GET("/metrics", echoprometheus.NewHandler())
	}

	// Static Files
	router.Static("/assets", "public/assets")
	router.File("/", "public/views/index.html")

	// Favicon
	router.File("/favicon.ico", "public/assets/favicon.ico")

	// Robots.txt
	router.File("/robots.txt", "public/assets/robots.txt")

	// Site
	router.GET("/:id", renderPaste)
	router.GET("/raw/:id", renderPasteRaw)

	// API Routes
	router.GET("/api/paste/:id", getPaste)
	router.POST("/documents", createPaste) // Hastebin compatibility
	router.POST("/api/upload", createPaste)
}