-- Eliminar las tablas existentes
DROP TABLE IF EXISTS Watchlists;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Movies;

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS mimomovies;

-- Usar la base de datos
USE mimomovies;

-- Crear la tabla 'Movies' si no existe
CREATE TABLE IF NOT EXISTS `Movies` (`id` INT AUTO_INCREMENT, `title` VARCHAR(255) NOT NULL, `genre` VARCHAR(255) NOT NULL, `duration` INT NOT NULL, `rating` FLOAT NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

-- Crear la tabla 'Users' si no existe
CREATE TABLE IF NOT EXISTS `Users` (`id` INT AUTO_INCREMENT, `username` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

-- Crear la tabla 'Ratings' si no existe
CREATE TABLE IF NOT EXISTS `Ratings` (`id` INT AUTO_INCREMENT, `userId` INT NOT NULL, `movieId` INT NOT NULL, `rating` FLOAT NOT NULL, `comment` VARCHAR(500), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`movieId`) REFERENCES `Movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;

-- Crear la tabla 'Watchlists' si no existe
CREATE TABLE IF NOT EXISTS `Watchlists` (`id` INT AUTO_INCREMENT, `movieId` INT, `userId` INT NOT NULL, `watched` TINYINT(1) DEFAULT false, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`movieId`) REFERENCES `Movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;

-- OK