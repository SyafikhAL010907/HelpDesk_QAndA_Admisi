package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	var err error
	dsn := "root:@tcp(127.0.0.1:3306)/help_desk_admisi?parseTime=true"
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Database not reachable: ", err)
	}
	fmt.Println("Connected to MySQL (help_desk_admisi)!")
}
