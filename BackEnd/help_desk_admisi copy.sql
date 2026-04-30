-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2026 at 02:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `help_desk_admisi`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_sessions`
--

CREATE TABLE `active_sessions` (
  `id` int(11) NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `session_id` text NOT NULL,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `active_sessions`
--

INSERT INTO `active_sessions` (`id`, `gmail`, `session_id`, `last_activity`) VALUES
(14, 'AdminDev@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnbWFpbCI6IkFkbWluRGV2QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc3NzU0NTEwNH0.z1AckBxwdMsp3RLJ1lSHCbMRsdpuquyEZwlQ6qZKpMs', '2026-04-29 10:31:44'),
(16, 'AdminDev@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnbWFpbCI6IkFkbWluRGV2QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc3NzU0NTg3Mn0._WXsh3QrkUvNO_vlEqiSMUY-tsVbvF3QWnkNOaQ_4t0', '2026-04-29 10:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `authentication`
--

CREATE TABLE `authentication` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authentication`
--

INSERT INTO `authentication` (`id`, `username`, `gmail`, `password`, `role`, `created_at`) VALUES
(1, 'Admisi UNJ', 'AdminDev@gmail.com', '$2a$14$EftdvnwkWtfbpBAMvVIB2eppPjpw/sMrwlqlRx51eQCYJfBedcOAy', 'admin', '2026-04-29 07:56:51'),
(4, 'Syafikh', 'Syafikh@gmail.com', '$2a$14$7CDnjnVvdXhl9tvVNaDyJOUNVri8H9r/9Yj55gyTj/G2hbzK6UBfW', 'user', '2026-04-29 08:28:42'),
(5, 'User1', 'User1@gmail.com', '$2a$14$j/b7JGstnPhb7VP9swlfmORHPWKst5T7vRgnvVd6hwzmLMkvwYpmu', 'user', '2026-04-29 10:41:40');

-- --------------------------------------------------------

--
-- Table structure for table `captcha`
--

CREATE TABLE `captcha` (
  `kode` int(11) NOT NULL,
  `pertanyaan` varchar(100) NOT NULL,
  `jawaban` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `captcha`
--

INSERT INTO `captcha` (`kode`, `pertanyaan`, `jawaban`) VALUES
(1, '2 + 2', 4),
(2, '4 - 1', 3),
(3, '5 - 3', 8),
(4, '9 ÷ 3', 3),
(5, '7 - 6', 1),
(6, '1 + 3', 4),
(7, '5 - 5', 0),
(8, '8 - 2', 6),
(9, '2 x 3', 6),
(10, '7 - 5', 2);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `sender_gmail` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `message_type` enum('text','file','image') DEFAULT 'text',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `room_id`, `sender_gmail`, `message`, `message_type`, `created_at`, `is_read`) VALUES
(8, 1, 'Syafikh@gmail.com', 'HAllo brooooo selama iang broo ', 'text', '2026-04-29 10:31:03', 1),
(9, 1, 'Syafikh@gmail.com', 'hallo', 'text', '2026-04-29 10:31:29', 1),
(10, 1, 'AdminDev@gmail.com', 'oyyy ntoll', 'text', '2026-04-29 10:39:53', 1),
(11, 1, 'Syafikh@gmail.com', 'quihdiwasad0sisadjiofj', 'text', '2026-04-29 10:41:58', 1),
(12, 1, 'Syafikh@gmail.com', 'sjcanscsncsncsdc', 'text', '2026-04-29 10:41:59', 1),
(13, 2, 'User1@gmail.com', 'Hallo NAma Saya Syafih ', 'text', '2026-04-29 10:42:50', 1),
(14, 2, 'User1@gmail.com', 'gua anak unj', 'text', '2026-04-29 10:42:56', 1),
(15, 2, 'User1@gmail.com', 'fakultas teknik', 'text', '2026-04-29 10:43:04', 1),
(16, 1, 'AdminDev@gmail.com', 'Berkas KTP tidak perlu dilegalisir, cukup unggah scan asli yang berwarna dan jelas terbaca.\n\nCatatan Tambahan:\noh kuontol', 'text', '2026-04-29 10:46:34', 1),
(17, 1, 'AdminDev@gmail.com', 'Untuk pendaftaran SNMPTN, silakan buka portal resmi LTMPT dan masukkan NISN serta password yang sudah didaftarkan.\n\nCatatan Tambahan:\n', 'text', '2026-04-29 10:46:47', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` int(11) NOT NULL,
  `user_gmail` varchar(255) NOT NULL,
  `last_message` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `user_gmail`, `last_message`, `updated_at`) VALUES
(1, 'Syafikh@gmail.com', 'Untuk pendaftaran SNMPTN, silakan buka portal resmi LTMPT dan masukkan NISN serta password yang sudah didaftarkan.\n\nCatatan Tambahan:\n', '2026-04-29 10:46:47'),
(2, 'User1@gmail.com', 'fakultas teknik', '2026-04-29 10:43:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gmail` (`gmail`);

--
-- Indexes for table `authentication`
--
ALTER TABLE `authentication`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gmail` (`gmail`);

--
-- Indexes for table `captcha`
--
ALTER TABLE `captcha`
  ADD PRIMARY KEY (`kode`) USING BTREE;

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_gmail` (`user_gmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_sessions`
--
ALTER TABLE `active_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `authentication`
--
ALTER TABLE `authentication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `captcha`
--
ALTER TABLE `captcha`
  MODIFY `kode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
