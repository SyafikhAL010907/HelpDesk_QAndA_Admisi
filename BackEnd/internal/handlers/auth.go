package handlers

import (
	"fmt"
	"net/http"
	"time"

	"helpdesk-backend/internal/database"
	"helpdesk-backend/internal/middleware"
	"helpdesk-backend/internal/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

const MaxAdminDevices = 4 // <--- UBAH ANGKA INI BUAT TEST

func HandleSignUp(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	_, err := database.DB.Exec("INSERT INTO authentication (username, gmail, password, role) VALUES (?, ?, ?, ?)",
		user.Username, user.Gmail, string(hashedPassword), user.Role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mendaftarkan user. Gmail mungkin sudah terdaftar."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pendaftaran berhasil!"})
}

func HandleLogin(c *gin.Context) {
	var loginData struct {
		Gmail    string `json:"gmail"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	var user models.User
	err := database.DB.QueryRow("SELECT id, username, gmail, password, role FROM authentication WHERE gmail = ?", loginData.Gmail).
		Scan(&user.ID, &user.Username, &user.Gmail, &user.Password, &user.Role)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Gmail atau Password salah"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Gmail atau Password salah"})
		return
	}

	// Fitur Batasan 4 Device buat Admin
	if user.Role == "admin" {
		var activeCount int
		// Bersihkan session yang sudah tua (misal > 24 jam) biar nggak nyangkut
		database.DB.Exec("DELETE FROM active_sessions WHERE last_activity < ?", time.Now().Add(-24*time.Hour))

		database.DB.QueryRow("SELECT COUNT(*) FROM active_sessions WHERE gmail = ?", user.Gmail).Scan(&activeCount)

		fmt.Printf("[DEBUG] Admin Login: %s, Active Sessions: %d, Max: %d\n", user.Gmail, activeCount, MaxAdminDevices)

		if activeCount >= MaxAdminDevices {
			c.JSON(http.StatusForbidden, gin.H{"error": "Batas maksimal device/orang tercapai untuk Admin"})
			return
		}
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Gmail: user.Gmail,
		Role:  user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(middleware.JwtKey)

	// Catat session baru buat admin
	if user.Role == "admin" {
		_, err := database.DB.Exec("INSERT INTO active_sessions (gmail, session_id) VALUES (?, ?)", user.Gmail, tokenString)
		if err != nil {
			fmt.Printf("[ERROR] Gagal nyatet session admin: %v\n", err)
		} else {
			fmt.Printf("[SUCCESS] Session admin dicatat untuk: %s\n", user.Gmail)
		}
	}

	fmt.Printf("[DEBUG] Login Berhasil: %s (Role: %s, Name: %s)\n", user.Gmail, user.Role, user.Username)

	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"username": user.Username,
		"gmail":    user.Gmail,
		"role":     user.Role,
	})
}
func GetCaptcha(c *gin.Context) {
	var captcha models.Captcha
	err := database.DB.QueryRow("SELECT kode, pertanyaan, jawaban FROM captcha ORDER BY RAND() LIMIT 1").
		Scan(&captcha.Kode, &captcha.Pertanyaan, &captcha.Jawaban)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil captcha: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, captcha)
}

func HandleLogout(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token diperlukan"})
		return
	}

	// Hapus session dari database
	_, err := database.DB.Exec("DELETE FROM active_sessions WHERE session_id = ?", token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal logout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Berhasil logout, slot device telah dibebaskan"})
}
