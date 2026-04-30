package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"helpdesk-backend/internal/database"
	"helpdesk-backend/internal/handlers"
	"helpdesk-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on OS environment variables")
	}

	database.InitDB()
	r := gin.Default()

	// CORS Setup
	frontendUrl := os.Getenv("FRONTEND_URL")
	if frontendUrl == "" {
		frontendUrl = "http://localhost:3000"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendUrl},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Public Routes
	r.POST("/api/signup", handlers.HandleSignUp)
	r.POST("/api/login", handlers.HandleLogin)
	r.GET("/api/captcha", handlers.GetCaptcha)
	// Protected Routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// User Routes
		protected.GET("/user/profile", handlers.UserProfile)
		protected.POST("/logout", handlers.HandleLogout)

		// Chat Routes (Shared)
		protected.GET("/chat/user-room", handlers.GetOrCreateRoom)
		protected.GET("/chat/messages/:room_id", handlers.GetMessages)
		protected.POST("/chat/send", handlers.SendMessage)

		// Admin Routes
		admin := protected.Group("/admin")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			admin.GET("/dashboard", handlers.AdminDashboard)
			admin.GET("/stats", handlers.GetStats)
			admin.GET("/users", handlers.GetAllUsers)
			admin.GET("/chat/rooms", handlers.GetRooms)
			admin.POST("/chat/mark-read/:room_id", handlers.MarkAsRead)
			admin.POST("/chat/mark-unread/:room_id", handlers.MarkAsUnread)
			admin.POST("/chat/broadcast", handlers.BroadcastMessage)
			admin.POST("/chat/delete-bulk", handlers.BulkDeleteRooms)
		}
	}

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Server running on :" + port)
	r.Run(":" + port)
}
