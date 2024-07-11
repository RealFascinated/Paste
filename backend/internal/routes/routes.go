package routes

import (
	"net/url"
	"strings"

	"cc.fascinated/paste/internal/config"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	// Proxy the frontend
	frontendUrl, err := url.Parse("http://localhost:3000")
	if err != nil {
		router.Logger.Fatal(err)
	}
	router.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
		Skipper: func(context echo.Context) bool {
			if strings.HasPrefix(context.Request().URL.Path, "/api") {
				return true
			}
			if strings.HasPrefix(context.Request().URL.Path, "/" + config.HASTEBIN_COMPATIBILITY_URL) {
				return true
			}
			if strings.HasPrefix(context.Request().URL.Path, "/assets") {
				return true
			}
			if context.Request().URL.Path == "/favicon.ico" {
				return true
			}
			if context.Request().URL.Path == "/robots.txt" {
				return true
			}
			if context.Request().URL.Path == "/metrics" {
				return true
			}
			return false
		},
		Balancer: middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
			{
				URL: frontendUrl,
			},
		}),
	}))

	// API Routes
	router.GET("/api/paste/:id", getPaste)
	router.POST(config.HASTEBIN_COMPATIBILITY_URL, createPaste) // Hastebin compatibility
	router.POST("/api/upload", createPaste)
	router.GET("/api/config", func(c echo.Context) error {
		return c.JSON(200, map[string]string{
			"siteTitle": config.SITE_TITLE,
			"textboxPlaceholder": config.TEXTBOX_PLACEHOLDER,
		})
	})
}