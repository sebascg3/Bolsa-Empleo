-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bolsa_empleo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bolsa_empleo` DEFAULT CHARACTER SET utf8;
USE `bolsa_empleo`;

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(100) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `rol` ENUM('ADMIN', 'EMPRESA', 'OFERENTE') NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuario_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `administrador` (
  `id_administrador` INT NOT NULL,
  `identificacion` VARCHAR(45) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_administrador`),
  CONSTRAINT `fk_administrador_usuario`
    FOREIGN KEY (`id_administrador`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `caracteristica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `caracteristica` (
  `id_caracteristica` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) DEFAULT NULL,
  `id_padre` INT DEFAULT NULL,
  PRIMARY KEY (`id_caracteristica`),
  KEY `idx_caracteristica_padre` (`id_padre`),
  CONSTRAINT `fk_caracteristica_padre`
    FOREIGN KEY (`id_padre`)
    REFERENCES `caracteristica` (`id_caracteristica`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa` INT NOT NULL,
  `ubicacion` VARCHAR(40) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `descripcion` VARCHAR(300) DEFAULT NULL,
  `aprobado` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_empresa`),
  CONSTRAINT `fk_empresa_usuario`
    FOREIGN KEY (`id_empresa`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `oferente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `oferente` (
  `id_oferente` INT NOT NULL,
  `identificacion` VARCHAR(45) NOT NULL,
  `nacionalidad` VARCHAR(45) DEFAULT NULL,
  `telefono` VARCHAR(45) DEFAULT NULL,
  `residencia` VARCHAR(45) DEFAULT NULL,
  `aprobado` TINYINT(1) NOT NULL DEFAULT 1,
  `cv` VARCHAR(300) DEFAULT NULL,
  PRIMARY KEY (`id_oferente`),
  UNIQUE KEY `uk_oferente_identificacion` (`identificacion`),
  CONSTRAINT `fk_oferente_usuario`
    FOREIGN KEY (`id_oferente`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `puesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `puesto` (
  `id_puesto` INT NOT NULL AUTO_INCREMENT,
  `id_empresa` INT NOT NULL,
  `descripcion` VARCHAR(300) DEFAULT NULL,
  `salario` DOUBLE NOT NULL,
  `tipo` ENUM('PUBLICO', 'PRIVADO') NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`id_puesto`),
  KEY `idx_puesto_empresa` (`id_empresa`),
  CONSTRAINT `fk_puesto_empresa`
    FOREIGN KEY (`id_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `puesto_caracteristica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `puesto_caracteristica` (
  `id_puesto_carac` INT NOT NULL AUTO_INCREMENT,
  `id_puesto` INT NOT NULL,
  `id_caracteristica` INT NOT NULL,
  `nivel` INT NOT NULL,
  PRIMARY KEY (`id_puesto_carac`),
  UNIQUE KEY `uk_puesto_caracteristica` (`id_puesto`, `id_caracteristica`),
  KEY `idx_pc_puesto` (`id_puesto`),
  KEY `idx_pc_caracteristica` (`id_caracteristica`),
  CONSTRAINT `fk_pc_puesto`
    FOREIGN KEY (`id_puesto`)
    REFERENCES `puesto` (`id_puesto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pc_caracteristica`
    FOREIGN KEY (`id_caracteristica`)
    REFERENCES `caracteristica` (`id_caracteristica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `caracteristica_oferente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `caracteristica_oferente` (
  `id_carac_ofer` INT NOT NULL AUTO_INCREMENT,
  `id_oferente` INT NOT NULL,
  `id_caracteristica` INT NOT NULL,
  `nivel` INT DEFAULT NULL,
  PRIMARY KEY (`id_carac_ofer`),
  UNIQUE KEY `uk_oferente_caracteristica` (`id_oferente`, `id_caracteristica`),
  KEY `idx_co_oferente` (`id_oferente`),
  KEY `idx_co_caracteristica` (`id_caracteristica`),
  CONSTRAINT `fk_co_oferente`
    FOREIGN KEY (`id_oferente`)
    REFERENCES `oferente` (`id_oferente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_co_caracteristica`
    FOREIGN KEY (`id_caracteristica`)
    REFERENCES `caracteristica` (`id_caracteristica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE oferente ADD COLUMN apellido VARCHAR(45) NULL AFTER identificacion;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;