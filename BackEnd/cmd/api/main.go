package main

import (
	"fmt"
	"time"

	"helpdesk-backend/internal/database"
	"helpdesk-backend/internal/handlers"
	"helpdesk-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()
	r := gin.Default()

	// CORS Setup
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
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
	r.POST("/api/logout", handlers.HandleLogout)

	// Protected Routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// User Routes
		protected.GET("/user/profile", handlers.UserProfile)

		// Chat Routes (Shared)
		protected.GET("/chat/user-room", handlers.GetOrCreateRoom)
		protected.GET("/chat/messages/:room_id", handlers.GetMessages)
		protected.POST("/chat/send", handlers.SendMessage)

		// Admin Routes
		admin := protected.Group("/admin")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			admin.GET("/dashboard", handlers.AdminDashboard)
			admin.GET("/chat/rooms", handlers.GetRooms)
			admin.POST("/chat/mark-read/:room_id", handlers.MarkAsRead)
		}
	}

	fmt.Println("Server running on :8080")
	r.Run(":8080")
}
