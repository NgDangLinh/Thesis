-- MySQL dump 10.13  Distrib 8.4.11, for Win64 (x86_64)
--
-- Host: localhost    Database: mojen_retreat
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `site_id` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int unsigned NOT NULL,
  `status` enum('booked','checked-in','checked-out','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'booked',
  `total_amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_customer` (`customer_id`),
  KEY `idx_bookings_site` (`site_id`),
  KEY `idx_bookings_dates` (`check_in`,`check_out`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_bookings_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,'C4','2026-10-05','2026-10-08',2,'cancelled',1050000.00,'2026-09-14 12:47:42','2026-09-14 12:59:17'),(2,2,'C4','2026-11-01','2026-11-03',2,'booked',700000.00,'2026-09-14 12:49:58','2026-09-14 12:49:58'),(3,3,'C1','2026-10-04','2026-10-06',2,'cancelled',580000.00,'2026-09-14 14:03:10','2026-09-14 14:12:41'),(4,3,'C1','2026-10-20','2026-10-22',2,'booked',580000.00,'2026-09-14 14:21:29','2026-09-14 14:21:29'),(8,5,'C3','2026-10-01','2026-10-02',1,'booked',500000.00,'2026-09-14 15:42:46','2026-09-14 15:42:46'),(10,4,'C1','2026-12-12','2026-12-14',1,'booked',1000000.00,'2026-09-14 15:44:32','2026-09-14 15:44:32'),(11,5,'C1','2026-12-22','2026-12-24',2,'booked',1000000.00,'2026-09-14 15:48:57','2026-09-14 15:48:57'),(12,6,'G1','2026-12-28','2026-12-30',1,'booked',2400000.00,'2026-09-14 15:59:15','2026-09-14 15:59:15'),(13,7,'C1','2026-09-14','2026-09-16',1,'booked',1000000.00,'2026-09-14 16:09:30','2026-09-14 16:09:30'),(14,8,'C1','2026-09-12','2026-09-14',1,'booked',1000000.00,'2026-09-14 16:13:50','2026-09-14 16:13:50'),(15,9,'C1','2026-09-18','2026-09-20',2,'booked',2000000.00,'2026-09-14 19:30:59','2026-09-14 19:30:59'),(16,10,'C1','2026-09-10','2026-09-11',1,'cancelled',500000.00,'2026-09-14 19:32:06','2026-09-15 02:58:18'),(17,11,'C2','2026-09-18','2026-09-20',2,'booked',2000000.00,'2026-09-15 04:22:09','2026-09-15 04:22:09'),(18,11,'G1','2026-09-19','2026-09-20',2,'booked',2400000.00,'2026-09-15 04:24:49','2026-09-15 04:24:49'),(19,12,'C4','2026-09-20','2026-09-22',2,'booked',2000000.00,'2026-09-15 06:21:35','2026-09-15 06:21:35'),(20,13,'C2','2026-11-03','2026-11-04',1,'booked',500000.00,'2026-09-15 06:55:56','2026-09-15 06:55:56'),(21,14,'C2','2026-11-06','2026-11-07',1,'booked',500000.00,'2026-09-15 07:06:23','2026-09-15 07:06:23');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Test Customer Updated','0900000001','updated@example.com','2026-09-14 12:47:42'),(2,'Test Maintenance','0900000004','test4@example.com','2026-09-14 12:49:58'),(3,'Dang Linh','12345',NULL,'2026-09-14 14:03:10'),(4,'hehe','1234',NULL,'2026-09-14 15:01:31'),(5,'hihi','123',NULL,'2026-09-14 15:42:46'),(6,'Kh├ính Chi','0987',NULL,'2026-09-14 15:59:15'),(7,'─É─âng Linh','09876',NULL,'2026-09-14 16:09:30'),(8,'─Éß╗⌐c Qu├╜','0988',NULL,'2026-09-14 16:13:50'),(9,'Quang Bui','096',NULL,'2026-09-14 19:30:59'),(10,'Nhß║¡t Anh','090',NULL,'2026-09-14 19:32:06'),(11,'Ninh','0999',NULL,'2026-09-15 04:22:09'),(12,'Payment','09999',NULL,'2026-09-15 06:21:35'),(13,'Tets payment','111',NULL,'2026-09-15 06:55:56'),(14,'fix payment','1111',NULL,'2026-09-15 07:06:23');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` int unsigned NOT NULL,
  `payment_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_code` (`payment_code`),
  KEY `idx_payments_booking` (`booking_id`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,11,'MOJEN-11',1000000.00,'pending',NULL,NULL,'2026-09-15 04:03:06'),(2,17,'MOJEN-17',2000000.00,'pending',NULL,NULL,'2026-09-15 04:22:09'),(3,18,'MOJEN-18',2400000.00,'paid','6aa8cc3d278d1','2026-09-15 04:42:43','2026-09-15 04:24:49'),(4,19,'MOJEN-19',2000000.00,'paid','6aa8e376a6dd6','2026-09-15 06:21:48','2026-09-15 06:21:35'),(5,21,'MOJEN-21',500000.00,'pending',NULL,NULL,'2026-09-15 07:06:23'),(6,20,'MOJEN-20',500000.00,'pending',NULL,NULL,'2026-09-15 07:26:27');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sites`
--

DROP TABLE IF EXISTS `sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sites` (
  `id` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Camping','Glamping','Lodge','RV') COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int unsigned NOT NULL,
  `price_per_night` decimal(12,2) NOT NULL,
  `status` enum('available','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sites`
--

LOCK TABLES `sites` WRITE;
/*!40000 ALTER TABLE `sites` DISABLE KEYS */;
INSERT INTO `sites` VALUES ('C1','Camping','Rß╗½ng th├┤ng','Lß╗üu',2,500000.00,'available','2026-09-13 17:55:09'),('C2','Camping','Rß╗½ng th├┤ng','Lß╗üu',2,500000.00,'available','2026-09-13 17:55:09'),('C3','Camping','Ven hß╗ô','Lß╗üu',4,500000.00,'available','2026-09-13 17:55:09'),('C4','Camping','Ven hß╗ô','Lß╗üu',4,500000.00,'available','2026-09-13 17:55:09'),('G1','Glamping','Ven suß╗æi','Glamping',2,1200000.00,'available','2026-09-13 17:55:09'),('G2','Glamping','Ven suß╗æi','Glamping',2,1200000.00,'available','2026-09-13 17:55:09'),('G3','Glamping','Rß╗½ng th├┤ng','Glamping',4,1200000.00,'available','2026-09-13 17:55:09'),('L1','Lodge','Khu v╞░ß╗¥n','Bungalow',10,10000000.00,'available','2026-09-13 17:55:09'),('L2','Lodge','Khu v╞░ß╗¥n','Bungalow',10,10000000.00,'available','2026-09-13 17:55:09'),('RV1','RV','Ven hß╗ô','RV',5,1500000.00,'available','2026-09-13 17:55:09'),('RV2','RV','Ven hß╗ô','RV',5,1500000.00,'available','2026-09-13 17:55:09');
/*!40000 ALTER TABLE `sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$oTO6cTMBSAVFcP5JjEAsxed5mwUijMr42Q.ZecnZYzM9spphEMUwq','admin','2026-09-14 13:09:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 16:40:54
