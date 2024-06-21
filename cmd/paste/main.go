package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
	"text/template"
	"time"

	"cc.fascinated/paste/internal/config"
	"cc.fascinated/paste/internal/metrics"
	"cc.fascinated/paste/internal/prisma"
	"cc.fascinated/paste/internal/routes"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func main() {
	fmt.Println("Starting Paste...")

	// Connect to the Prisma database
	err := prisma.ConnectPrisma()
	if err != nil {
		fmt.Println("Error connecting to the Prisma database:", err)
		return
	}

	router := echo.New()
	router.HideBanner = true // Hide the banner

	// Use Gzip Compression
	router.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Skipper: func(c echo.Context) bool {
			return strings.Contains(c.Path(), "metrics")
		},
	}))
	router.Use(middleware.BodyLimit("1M")) // Limit the body size to 1MB
	router.Use(echoprometheus.NewMiddleware("paste")) // adds middleware to gather metrics	

	// Rate Limiter
	router.Use(middleware.RateLimiterWithConfig( middleware.RateLimiterConfig{
		Skipper: func(c echo.Context) bool {
			if strings.Contains(c.Path(), "metrics") { // Skip rate limiter for metrics
				return true
			}
			if c.Request().Method == http.MethodGet { // Skip rate limiter for GET requests
				return true
			}
			return false
		},
		Store: middleware.NewRateLimiterMemoryStoreWithConfig(
				middleware.RateLimiterMemoryStoreConfig{Rate: 10, Burst: 30, ExpiresIn: 3 * time.Minute},
		),
		IdentifierExtractor: func(ctx echo.Context) (string, error) {
				id := ctx.RealIP()
				return id, nil
		},
		ErrorHandler: func(context echo.Context, err error) error {
				return context.JSON(http.StatusForbidden, nil)
		},
		DenyHandler: func(context echo.Context, identifier string,err error) error {
				return context.JSON(http.StatusTooManyRequests, nil)
		},
	}))

	// Template Renderer
	templates := &Template{
		templates: template.Must(template.ParseGlob("public/views/*.html")),
	}
	router.Renderer = templates

	// Middleware Logger
	router.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	// CORS (Allow all origins)
	router.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))

	if config.ENABLE_METRICS {	// Check if metrics are enabled
		metrics.RegisterMetrics() // Register the metrics
		metrics.InitMetricsUpdater() // Start the metrics updater
	}

	routes.InitRoutes(router) // Initialize the routes

	port := 8080
	router.Logger.Fatal(router.Start(fmt.Sprintf(":%d", port)))
}