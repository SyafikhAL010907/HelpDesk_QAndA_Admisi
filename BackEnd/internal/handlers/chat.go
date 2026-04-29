package handlers

import (
	"database/sql"
	"fmt"
	"helpdesk-backend/internal/database"
	"helpdesk-backend/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetRooms - Admin fetches all chat rooms
func GetRooms(c *gin.Context) {
	rows, err := database.DB.Query(`
		SELECT 
			cr.id, 
			cr.user_gmail, 
			COALESCE(cr.last_message, ''), 
			cr.updated_at, 
			COALESCE(a.username, ''),
			(SELECT COUNT(*) FROM chat_messages WHERE room_id = cr.id AND is_read = 0 AND sender_gmail = cr.user_gmail) as unread_count
		FROM chat_rooms cr
		LEFT JOIN authentication a ON cr.user_gmail = a.gmail
		ORDER BY cr.updated_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil daftar room: " + err.Error()})
		return
	}
	defer rows.Close()

	var rooms []models.ChatRoom
	for rows.Next() {
		var room models.ChatRoom
		if err := rows.Scan(&room.ID, &room.UserGmail, &room.LastMessage, &room.UpdatedAt, &room.UserName, &room.UnreadCount); err != nil {
			log.Println("[ERROR] Scan room:", err)
			continue
		}
		rooms = append(rooms, room)
	}

	c.JSON(http.StatusOK, rooms)
}

// GetOrCreateRoom - User fetches their personal room
func GetOrCreateRoom(c *gin.Context) {
	userGmail := c.Query("gmail")
	if userGmail == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gmail tidak boleh kosong"})
		return
	}

	var room models.ChatRoom
	err := database.DB.QueryRow(`
		SELECT id, user_gmail, COALESCE(last_message, ''), updated_at,
		(SELECT COUNT(*) FROM chat_messages WHERE room_id = chat_rooms.id AND is_read = 0 AND sender_gmail != ?) as unread_count
		FROM chat_rooms WHERE user_gmail = ?`, userGmail, userGmail).
		Scan(&room.ID, &room.UserGmail, &room.LastMessage, &room.UpdatedAt, &room.UnreadCount)

	if err == sql.ErrNoRows {
		fmt.Printf("[INFO] Creating new room for: %s\n", userGmail)
		// Buat room baru kalau belum ada
		result, err := database.DB.Exec("INSERT INTO chat_rooms (user_gmail) VALUES (?)", userGmail)
		if err != nil {
			fmt.Printf("[ERROR] CreateRoom: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat room chat: " + err.Error()})
			return
		}
		id, _ := result.LastInsertId()
		room.ID = int(id)
		room.UserGmail = userGmail
	} else if err != nil {
		fmt.Printf("[ERROR] GetOrCreateRoom: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mencari room: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, room)
}

// GetMessages - Fetch messages for a specific room
func GetMessages(c *gin.Context) {
	roomID := c.Param("room_id")
	rows, err := database.DB.Query("SELECT id, room_id, sender_gmail, message, message_type, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC", roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil history chat"})
		return
	}
	defer rows.Close()

	messages := []models.ChatMessage{}
	for rows.Next() {
		var msg models.ChatMessage
		if err := rows.Scan(&msg.ID, &msg.RoomID, &msg.SenderGmail, &msg.Message, &msg.MessageType, &msg.CreatedAt); err != nil {
			continue
		}
		messages = append(messages, msg)
	}

	c.JSON(http.StatusOK, messages)
}

// SendMessage - Post a new message
func SendMessage(c *gin.Context) {
	var msg models.ChatMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data pesan tidak valid"})
		return
	}

	// 1. Simpan pesan ke DB
	result, err := database.DB.Exec("INSERT INTO chat_messages (room_id, sender_gmail, message, message_type) VALUES (?, ?, ?, ?)",
		msg.RoomID, msg.SenderGmail, msg.Message, msg.MessageType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pesan"})
		return
	}

	// 2. Update last_message di chat_rooms
	_, _ = database.DB.Exec("UPDATE chat_rooms SET last_message = ? WHERE id = ?", msg.Message, msg.RoomID)

	id, _ := result.LastInsertId()
	msg.ID = int(id)
	
	c.JSON(http.StatusOK, msg)
}

// MarkAsRead - Reset unread count for a room
func MarkAsRead(c *gin.Context) {
	roomID := c.Param("room_id")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room ID wajib diisi"})
		return
	}

	_, err := database.DB.Exec("UPDATE chat_messages SET is_read = 1 WHERE room_id = ?", roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update status baca: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status baca berhasil diperbarui"})
}
