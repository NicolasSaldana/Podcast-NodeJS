CREATE DATABASE  IF NOT EXISTS `laburar` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `laburar`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: laburar
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contacto`
--

DROP TABLE IF EXISTS `contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto` (
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `tema` varchar(255) DEFAULT NULL,
  `mensaje` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacto`
--

LOCK TABLES `contacto` WRITE;
/*!40000 ALTER TABLE `contacto` DISABLE KEYS */;
INSERT INTO `contacto` VALUES ('benito','tridella','testcorreo@gmail.com','testing','45346456'),('cench','apelldio','testcorreo@gmail.com','testing','45346456'),('benito','tridella','asdsadas@gmail.com','testing','roling'),('cench','pep','testcorreo@gmail.com','testing','56757'),('','','','',''),('','','','',''),('benito','tridella','1@gmail.com','testing','5675687'),('benito','tridella','1@yopmail.com','testing','5675687'),('benito','tridella','1@yopmail.com','testing','5675687'),('head','','asdsadas@gmail.com','4KT','BR'),('yeah','','asdsadas@gmail.com','4KT','BR'),('yeah2','','asdsadas@gmail.com','4KT','BR'),('gg','','asdsadas@gmail.com','testing','Baton Rouge'),('benito','gg','asdsadas@gmail.com','testing','BR'),('GEGE','','asdsadas@gmail.com','testing','top'),('ggy','','asdsadas@gmail.com','IDK','IDK'),('benito','','asdsadas@gmail.com','testing','f'),('ggu','','asdsadas@gmail.com','testing','PAP'),('gg','','19@yopmail.com','take','take'),('benito','','asdsadas@gmail.com','testing','BR'),('benito','','asdsadas@gmail.com','testing','hfg'),('morocco','','asdsadas@yopmail.com','testing','br'),('thug','','asdsadas@gmail.com','testing','fgh'),('eyrtyrtytryrt','','19@yopmail.com','testing','sfds'),('qweasdrf','','asdsadas@gmail.com','testing','fgf'),('benito','','asdsadas@gmail.com','job','job'),('38609099','','asdsadas@gmail.com','TOPSOUNd','soud'),('38609099','','asdsadas@gmail.com','testing','fsdf'),('benito5','','asdsadas@gmail.com','testing','fsdf'),('benito','','asdsadas@gmail.com','job','sfsfsg'),('benito','','asdsadas@gmail.com','job','sfsfsg'),('twoclicks','','asdsadas@gmail.com','testing','fghgfh'),('benito','','19@yopmail.com','job','rock'),('benito','','19@yopmail.com','testing','sfdsf'),('benito','','asdsadas@gmail.com','testing','sdfdsg..'),('benito','','asdsadas@gmail.com','testing','tyh'),('benito','','asdsadas@gmail.com','testing','hola'),('chains','','asdsadas@gmail.com','testing','hola'),('twoclicks','','asdsadas@gmail.com','testing','chains'),('benito','','asdsadas@gmail.com','testing','dsf'),('test','','asdsadas@gmail.com','RCccccc','cccccccccc'),('benito','','cuevanaaccount@gmail.com','testing','hol'),('benito','tridella','bitch123@gmail.com','Funciona ','Test tema.'),('twoclicks','','benilorenzo007op@gmail.com','testing','sds');
/*!40000 ALTER TABLE `contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuentas`
--

DROP TABLE IF EXISTS `cuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuentas` (
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `recontraseña` varchar(255) NOT NULL,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuentas`
--

LOCK TABLES `cuentas` WRITE;
/*!40000 ALTER TABLE `cuentas` DISABLE KEYS */;
INSERT INTO `cuentas` VALUES ('benito5','asdsadas@gmail.com','$2b$10$k6EJn7mlaendRztN7PU6TOYqR/v03.cVCnpo2RBrYxu27GlA.3YRG','$2b$10$k6EJn7mlaendRztN7PU6TOYqR/v03.cVCnpo2RBrYxu27GlA.3YRG',NULL),('benito','benilorenzo007op@gmail.com','$2b$10$4VCM0WEV4xmN7gR3VujsZelXGVIDF8RX3ett6nQJxySHFYo7bUXZm','$2b$10$4VCM0WEV4xmN7gR3VujsZelXGVIDF8RX3ett6nQJxySHFYo7bUXZm','ImagenesGuardadas/1698329785473-ee0d96379d1e7db56ad6229ef2c01615.png'),('NBAYB','bitch123@gmail.com','$2b$10$SxSpPeZxL3sggAHE.jfYOOdXSe5PZKgqCxyLmLFQQHzsEXwxRHp8a','$2b$10$SxSpPeZxL3sggAHE.jfYOOdXSe5PZKgqCxyLmLFQQHzsEXwxRHp8a',NULL);
/*!40000 ALTER TABLE `cuentas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `email` varchar(255) NOT NULL,
  `podcast_id` int NOT NULL,
  PRIMARY KEY (`email`,`podcast_id`),
  KEY `podcast_id` (`podcast_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`email`) REFERENCES `cuentas` (`email`),
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`podcast_id`) REFERENCES `podcast` (`ID`),
  CONSTRAINT `favoritos_ibfk_3` FOREIGN KEY (`email`) REFERENCES `cuentas` (`email`),
  CONSTRAINT `favoritos_ibfk_4` FOREIGN KEY (`podcast_id`) REFERENCES `podcast` (`ID`),
  CONSTRAINT `favoritos_ibfk_5` FOREIGN KEY (`email`) REFERENCES `cuentas` (`email`),
  CONSTRAINT `favoritos_ibfk_6` FOREIGN KEY (`podcast_id`) REFERENCES `podcast` (`ID`),
  CONSTRAINT `favoritos_ibfk_7` FOREIGN KEY (`email`) REFERENCES `cuentas` (`email`),
  CONSTRAINT `favoritos_ibfk_8` FOREIGN KEY (`podcast_id`) REFERENCES `podcast` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES ('benilorenzo007op@gmail.com',1);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos2`
--

DROP TABLE IF EXISTS `favoritos2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos2` (
  `email` varchar(255) NOT NULL,
  `ruta_audio` varchar(255) NOT NULL,
  `nombre_audio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`,`ruta_audio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos2`
--

LOCK TABLES `favoritos2` WRITE;
/*!40000 ALTER TABLE `favoritos2` DISABLE KEYS */;
INSERT INTO `favoritos2` VALUES ('asdsadas@gmail.com','Audios/primero capo.m4a','Episodio 01: Primer podcast.'),('benilorenzo007op@gmail.com','Audios/segundo capo.m4a','Episodio 02: Hablemos de Independiente.');
/*!40000 ALTER TABLE `favoritos2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `podcast`
--

DROP TABLE IF EXISTS `podcast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podcast` (
  `ID` int NOT NULL,
  `ruta_audio` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podcast`
--

LOCK TABLES `podcast` WRITE;
/*!40000 ALTER TABLE `podcast` DISABLE KEYS */;
INSERT INTO `podcast` VALUES (1,'test','testaduio');
/*!40000 ALTER TABLE `podcast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subemail`
--

DROP TABLE IF EXISTS `subemail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subemail` (
  `subemail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subemail`
--

LOCK TABLES `subemail` WRITE;
/*!40000 ALTER TABLE `subemail` DISABLE KEYS */;
INSERT INTO `subemail` VALUES ('Subscríbete'),('Subscríbete'),('test'),('test@gmail.com'),('test2@gmail.com'),('correo@gmail.com'),('test6@gmail.com'),('correo23@gmail.com'),('correo2@gmail.com'),('testtest@correo.com'),('op@correo.com'),('tyu'),('ts'),('es@gmail.com'),(''),('@gmail.com'),('te@gmila.ocm'),('director@yopmail.com'),('cur@yopmmail.com'),('te@yopmail.com'),('20@yopmail.com'),('bk@yopmail.com'),('never@yopmail.com'),('yb@gmial.com'),('mane@yopmail.com'),('lando@gmail.com'),('dark@yopmail.com'),('ty@gmail.com'),('top@gmail.com'),('top@gmail.com.'),('top3@gmail.com'),('topYB@gmail.com'),('NBA@gmail.com'),('YB2043@gmail.com'),('asdsadasFUCK@gmail.com'),('bitch123@gmail.com');
/*!40000 ALTER TABLE `subemail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'laburar'
--

--
-- Dumping routines for database 'laburar'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-26 11:35:30
