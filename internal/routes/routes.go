package routes

import (
	"html/template"
	"io"
	"net/http"

	"cc.fascinated/paste/internal/config"
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

// Creates a new router
func NewRouter() *echo.Echo {
	router := echo.New()

	router.Use(echoprometheus.NewMiddleware("paste")) // adds middleware to gather metrics		

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

	if config.EnableMetrics() { // Check if metrics are enabled
		router.GET("/metrics", echoprometheus.NewHandler())
	}

	// Static Files
	router.Static("/assets", "public/assets")
	router.File("/", "public/views/index.html")

	// Favicon
	router.File("/favicon.ico", "public/assets/favicon.ico")

	// Site
	router.GET("/:id", renderPaste)
	router.GET("/raw/:id", renderPasteRaw)

	// API Routes
	router.GET("/api/paste/:id", getPaste)
	router.POST("/documents", createPaste) // Hastebin compatibility
	router.POST("/api/upload", createPaste)

	return router
}