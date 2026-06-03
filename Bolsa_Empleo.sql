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
  `foto_perfil` VARCHAR(300) DEFAULT NULL,
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

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



USE bolsa_empleo;

DELETE FROM caracteristica_oferente;
DELETE FROM puesto_caracteristica;
DELETE FROM puesto;
DELETE FROM oferente;
DELETE FROM empresa;
DELETE FROM administrador;
DELETE FROM caracteristica;
DELETE FROM usuario;

ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE caracteristica AUTO_INCREMENT = 1;
ALTER TABLE puesto AUTO_INCREMENT = 1;
ALTER TABLE puesto_caracteristica AUTO_INCREMENT = 1;
ALTER TABLE caracteristica_oferente AUTO_INCREMENT = 1;

-- =====================================================
-- USUARIOS
-- =====================================================

INSERT INTO usuario (correo, password, rol, activo, nombre) VALUES
('admin1@bolsa.com',   '$2a$12$F11aMox1ufFPogyCM7H3SuNkzpLFrIUVHUcgF894.BcuXT991my0y', 'ADMIN', 1, 'Administrador 1'),
('admin2@bolsa.com',   '$2a$12$gEDMpn13zunfp3jfoDCdVu3Chb/QHfoV7TVo/WSO9V2.Ujib/X3Hi', 'ADMIN', 1, 'Administrador 2'),
('admin3@bolsa.com',   '$2a$12$0T2GwTXXEKyizu4K3SVNoO7IiUGvP9KwBy4SZM3rJTgk64FMZG896', 'ADMIN', 1, 'Administrador 3'),
('admin4@bolsa.com',   '$2a$12$nrE9NCTf5hNQ317rJO6J5edALvokbhoCwl3bu6p.CBuw7fkVMs6DG', 'ADMIN', 1, 'Administrador 4'),
('admin5@bolsa.com',   '$2a$12$WuInGBxMGSNVOCSwmkaYGueTe/05QwJT55wv1l3VF38T9DH9HNoY6', 'ADMIN', 1, 'Administrador 5'),
('admin6@bolsa.com',   '$2a$12$j4zTwDaTCYcgU1sT06VgDunaaTYVRcJ3LMYVoytd7KlgXLFsibZG6', 'ADMIN', 1, 'Administrador 6'),
('admin7@bolsa.com',   '$2a$12$2YmU5wSBx2FbIFGbqPEsguFPVxxmPfc5a/ZYpCjf99zv06us7ltne', 'ADMIN', 1, 'Administrador 7'),
('admin8@bolsa.com',   '$2a$12$IewZlrg1BZFRQNgbPC.J/OVUSbYqM64/7YbEVdp4owBo4nKSXncaK', 'ADMIN', 1, 'Administrador 8'),
('admin9@bolsa.com',   '$2a$12$0f74zna5UvTlWChMaqGdtuhVehMkbXpFEwhHRFCRaqxHtNwZAiMwy', 'ADMIN', 1, 'Administrador 9'),
('admin10@bolsa.com',  '$2a$12$ljYfdbTDvSkkhOSEWbMkLe4me1NKkkVDAozZbYQkHe/LqhjZejG2i', 'ADMIN', 1, 'Administrador 10'),

('empresa1@bolsa.com',  '$2a$12$gfX6zgr2tuuuEGZFXg4YZubnqst1LO4CCmqd4FPVll8J3K2cFmMpK', 'EMPRESA', 1, 'Tech Solutions CR'),
('empresa2@bolsa.com',  '$2a$12$yh3/rQcOJLWnUAHdfEhtv.HLjqGe6aLt7ZpAk20m0FAI1aWTnViGe', 'EMPRESA', 1, 'DataSoft Latinoamerica'),
('empresa3@bolsa.com',  '$2a$12$AmE26Mm6byeqrlf1o8x.FuD4cDZ0sdImRosQ95MLmqh48VwbZQufq', 'EMPRESA', 1, 'CloudNet Systems'),
('empresa4@bolsa.com',  '$2a$12$rU6PHDUIIptIb9z7fiI3/eGfLPtqxxC4AnEkRe1HhKIyc8XBEHyOG', 'EMPRESA', 1, 'Innovatech S.A.'),
('empresa5@bolsa.com',  '$2a$12$3PcCByEILi7YcWIFhkYIK.dTdIo9.Lq5cATEk6LSZ00167.i/fale', 'EMPRESA', 1, 'CyberSec Corp'),
('empresa6@bolsa.com',  '$2a$12$xgpEZKSKwtRBhKF472cWZuZdk0HYly3UDIle1ApCFe..VkCqUDFgK', 'EMPRESA', 1, 'Global Apps CR'),
('empresa7@bolsa.com',  '$2a$12$1nuYfRtMU8TE1oKdPuNobOtbgarlChZgdP.yC1A9LWAnMj7wg9zmS', 'EMPRESA', 1, 'VisionWare'),
('empresa8@bolsa.com',  '$2a$12$kC1kXX.3/t9hRmXpykVD4.zXpo4R3xVOdTn7nv6ZGTLApapNmvHEK', 'EMPRESA', 1, 'Smart Business Group'),
('empresa9@bolsa.com',  '$2a$12$nTjMIjBJ..dnvbxj1QBPae9Mgon4h.O/9uDjDXp3TSELuXlv8N79i', 'EMPRESA', 1, 'Nova Digital'),
('empresa10@bolsa.com', '$2a$12$e0/7meY09rqLC04P/DfKe.M2iRRwkieM7K4S.Jh6zLWk2JxEd.dta', 'EMPRESA', 1, 'NextGen Software'),

('oferente1@bolsa.com',  '$2a$12$VCECZ8tc8LTLvoLu0NCvJub2DHrNt37ODI3jdEPKVVQhebcJHRNNO', 'OFERENTE', 1, 'Carlos Ramirez'),
('oferente2@bolsa.com',  '$2a$12$PcvZQs9HCSUiRPrHUHhg8ug8zwD6HxwmJzwNe2092gt.Wpbt8EytS', 'OFERENTE', 1, 'Mariana Lopez'),
('oferente3@bolsa.com',  '$2a$12$wJs.rLW/ZWLc626kflk8ReHffjK.7.K9bFPc2E36N032J5pilkET6', 'OFERENTE', 1, 'Jose Fernandez'),
('oferente4@bolsa.com',  '$2a$12$ekzL/aVOvLN2KXNCcwWhju9cgHDH6lkA.YXTVQ5fdTJvKIlSUxM7m', 'OFERENTE', 1, 'Laura Gomez'),
('oferente5@bolsa.com',  '$2a$12$EjTD7DascOYFRuYj0oSBLOJypfEiMpjw.GxOi4giFwMgdZ3zw.Qbq', 'OFERENTE', 1, 'Daniel Vargas'),
('oferente6@bolsa.com',  '$2a$12$lnQvN0pSEr2M5gd14.Eb2ObD9UZ28Vc88WMIuxD9yRnXuj95N6ihq', 'OFERENTE', 1, 'Sofia Morales'),
('oferente7@bolsa.com',  '$2a$12$YAdStgYhKsvrLTZYpVYTKeDsAUGcXGdO4OpE/hb7hZSTnAY3T3ePa', 'OFERENTE', 1, 'Andres Castillo'),
('oferente8@bolsa.com',  '$2a$12$1v7OIBuQB043oZ5IeStGNu/RsP1Y5XXLLUabDdDC79F0GygF9uDIe', 'OFERENTE', 1, 'Valeria Rojas'),
('oferente9@bolsa.com',  '$2a$12$h5SZdczGfQ9UKLxdJWjKP.3BMPIsnutZP8AhySVXvTb0hy9O2zZAy', 'OFERENTE', 1, 'Esteban Solis'),
('oferente10@bolsa.com', '$2a$12$JfCS452opSK4qCHmLRiijOHMXeT4fpt3o75jxj4VNG.0zIxQJE1RK', 'OFERENTE', 1, 'Fernanda Chaves');

-- =====================================================
-- ADMINISTRADORES
-- =====================================================

INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-001', 1 FROM usuario WHERE correo = 'admin1@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-002', 1 FROM usuario WHERE correo = 'admin2@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-003', 1 FROM usuario WHERE correo = 'admin3@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-004', 1 FROM usuario WHERE correo = 'admin4@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-005', 1 FROM usuario WHERE correo = 'admin5@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-006', 1 FROM usuario WHERE correo = 'admin6@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-007', 1 FROM usuario WHERE correo = 'admin7@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-008', 1 FROM usuario WHERE correo = 'admin8@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-009', 1 FROM usuario WHERE correo = 'admin9@bolsa.com';
INSERT INTO administrador (id_administrador, identificacion, activo)
SELECT id_usuario, 'ADM-010', 1 FROM usuario WHERE correo = 'admin10@bolsa.com';

-- =====================================================
-- CARACTERISTICAS
-- =====================================================

INSERT INTO caracteristica (nombre, id_padre) VALUES
('Programacion', NULL),
('Bases de Datos', NULL),
('Redes', NULL),
('Seguridad Informatica', NULL);

INSERT INTO caracteristica (nombre, id_padre)
SELECT 'Java', id_caracteristica FROM caracteristica WHERE nombre = 'Programacion';
INSERT INTO caracteristica (nombre, id_padre)
SELECT 'Python', id_caracteristica FROM caracteristica WHERE nombre = 'Programacion';
INSERT INTO caracteristica (nombre, id_padre)
SELECT 'JavaScript', id_caracteristica FROM caracteristica WHERE nombre = 'Programacion';
INSERT INTO caracteristica (nombre, id_padre)
SELECT 'MySQL', id_caracteristica FROM caracteristica WHERE nombre = 'Bases de Datos';
INSERT INTO caracteristica (nombre, id_padre)
SELECT 'PostgreSQL', id_caracteristica FROM caracteristica WHERE nombre = 'Bases de Datos';
INSERT INTO caracteristica (nombre, id_padre)
SELECT 'Cisco', id_caracteristica FROM caracteristica WHERE nombre = 'Redes';

-- =====================================================
-- EMPRESAS
-- =====================================================

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'San Jose', '2201-1101', 'Empresa especializada en desarrollo de software empresarial.', 1
FROM usuario WHERE correo = 'empresa1@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Heredia', '2201-1102', 'Consultora de analitica de datos y soluciones BI.', 1
FROM usuario WHERE correo = 'empresa2@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Alajuela', '2201-1103', 'Servicios de infraestructura cloud y soporte TI.', 1
FROM usuario WHERE correo = 'empresa3@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Cartago', '2201-1104', 'Innovacion tecnologica para pymes y startups.', 1
FROM usuario WHERE correo = 'empresa4@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Puntarenas', '2201-1105', 'Firma orientada a ciberseguridad y auditorias.', 1
FROM usuario WHERE correo = 'empresa5@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Limon', '2201-1106', 'Desarrollo de aplicaciones web y moviles.', 1
FROM usuario WHERE correo = 'empresa6@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Guanacaste', '2201-1107', 'Automatizacion de procesos y software a medida.', 1
FROM usuario WHERE correo = 'empresa7@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'San Carlos', '2201-1108', 'Soluciones ERP y plataformas empresariales.', 1
FROM usuario WHERE correo = 'empresa8@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Perez Zeledon', '2201-1109', 'Servicios digitales y comercio electronico.', 1
FROM usuario WHERE correo = 'empresa9@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Grecia', '2201-1110', 'Empresa de transformacion digital y soporte tecnico.', 1
FROM usuario WHERE correo = 'empresa10@bolsa.com';

-- =====================================================
-- OFERENTES
-- =====================================================

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1111', 'Costarricense', '7000-0001', 'San Jose', 1, '21.pdf', NULL
FROM usuario WHERE correo = 'oferente1@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1112', 'Costarricense', '7000-0002', 'Heredia', 1, '22.pdf', NULL
FROM usuario WHERE correo = 'oferente2@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1113', 'Costarricense', '7000-0003', 'Alajuela', 1, '23.pdf', NULL
FROM usuario WHERE correo = 'oferente3@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1114', 'Costarricense', '7000-0004', 'Cartago', 1, '24.pdf', NULL
FROM usuario WHERE correo = 'oferente4@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1115', 'Costarricense', '7000-0005', 'Puntarenas', 1, '25.pdf', NULL
FROM usuario WHERE correo = 'oferente5@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1116', 'Costarricense', '7000-0006', 'Limon', 1, '26.pdf', NULL
FROM usuario WHERE correo = 'oferente6@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1117', 'Costarricense', '7000-0007', 'Guanacaste', 1, '27.pdf', NULL
FROM usuario WHERE correo = 'oferente7@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1118', 'Costarricense', '7000-0008', 'San Carlos', 1, '28.pdf', NULL
FROM usuario WHERE correo = 'oferente8@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1119', 'Costarricense', '7000-0009', 'Perez Zeledon', 1, '29.pdf', NULL
FROM usuario WHERE correo = 'oferente9@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1120', 'Costarricense', '7000-0010', 'Grecia', 1, '30.pdf', NULL
FROM usuario WHERE correo = 'oferente10@bolsa.com';

-- =====================================================
-- PUESTOS
-- =====================================================

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Desarrollador Java Junior', 850000, 'PUBLICO', 1, '2026-03-01'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa1@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Analista de Datos', 950000, 'PUBLICO', 1, '2026-03-02'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa2@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Administrador de Infraestructura Cloud', 1200000, 'PRIVADO', 1, '2026-03-03'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa3@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Desarrollador Full Stack', 1100000, 'PUBLICO', 1, '2026-03-04'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa4@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Especialista en Ciberseguridad', 1300000, 'PRIVADO', 1, '2026-03-05'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa5@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Programador Web', 900000, 'PUBLICO', 1, '2026-03-06'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa6@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Ingeniero de Software Backend', 1250000, 'PUBLICO', 1, '2026-03-07'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa7@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Administrador de Base de Datos', 1150000, 'PRIVADO', 1, '2026-03-08'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa8@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Tecnico en Redes', 800000, 'PUBLICO', 1, '2026-03-09'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa9@bolsa.com');

INSERT INTO puesto (id_empresa, descripcion, salario, tipo, activo, fecha)
SELECT id_empresa, 'Soporte Tecnico TI', 750000, 'PUBLICO', 1, '2026-03-10'
FROM empresa WHERE id_empresa = (SELECT id_usuario FROM usuario WHERE correo = 'empresa10@bolsa.com');

-- =====================================================
-- PUESTO_CARACTERISTICA
-- =====================================================

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 3
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Desarrollador Java Junior' AND c.nombre = 'Java';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 3
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Analista de Datos' AND c.nombre = 'MySQL';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 4
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Administrador de Infraestructura Cloud' AND c.nombre = 'Seguridad Informatica';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 4
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Desarrollador Full Stack' AND c.nombre = 'JavaScript';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 5
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Especialista en Ciberseguridad' AND c.nombre = 'Seguridad Informatica';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 3
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Programador Web' AND c.nombre = 'JavaScript';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 4
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Ingeniero de Software Backend' AND c.nombre = 'Java';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 4
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Administrador de Base de Datos' AND c.nombre = 'PostgreSQL';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 3
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Tecnico en Redes' AND c.nombre = 'Cisco';

INSERT INTO puesto_caracteristica (id_puesto, id_caracteristica, nivel)
SELECT p.id_puesto, c.id_caracteristica, 2
FROM puesto p, caracteristica c
WHERE p.descripcion = 'Soporte Tecnico TI' AND c.nombre = 'Redes';

-- =====================================================
-- CARACTERISTICA_OFERENTE
-- =====================================================

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 4
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1111' AND c.nombre = 'Java';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 3
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1112' AND c.nombre = 'MySQL';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 4
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1113' AND c.nombre = 'Python';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 5
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1114' AND c.nombre = 'JavaScript';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 4
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1115' AND c.nombre = 'Seguridad Informatica';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 3
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1116' AND c.nombre = 'PostgreSQL';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 4
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1117' AND c.nombre = 'Cisco';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 3
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1118' AND c.nombre = 'Java';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 3
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1119' AND c.nombre = 'Redes';

INSERT INTO caracteristica_oferente (id_oferente, id_caracteristica, nivel)
SELECT o.id_oferente, c.id_caracteristica, 4
FROM oferente o, caracteristica c
WHERE o.identificacion = '1-1111-1120' AND c.nombre = 'JavaScript';


INSERT INTO usuario (correo, password, rol, activo, nombre) VALUES
('empresa11@bolsa.com', '$2a$12$gfX6zgr2tuuuEGZFXg4YZubnqst1LO4CCmqd4FPVll8J3K2cFmMpK', 'EMPRESA', 1, 'SoftCR Pendiente'),
('empresa12@bolsa.com', '$2a$12$yh3/rQcOJLWnUAHdfEhtv.HLjqGe6aLt7ZpAk20m0FAI1aWTnViGe', 'EMPRESA', 1, 'Innovacion Tica S.A.'),
('empresa13@bolsa.com', '$2a$12$AmE26Mm6byeqrlf1o8x.FuD4cDZ0sdImRosQ95MLmqh48VwbZQufq', 'EMPRESA', 1, 'Servicios Digitales del Norte'),

('oferente11@bolsa.com', '$2a$12$VCECZ8tc8LTLvoLu0NCvJub2DHrNt37ODI3jdEPKVVQhebcJHRNNO', 'OFERENTE', 1, 'Kevin Mora'),
('oferente12@bolsa.com', '$2a$12$PcvZQs9HCSUiRPrHUHhg8ug8zwD6HxwmJzwNe2092gt.Wpbt8EytS', 'OFERENTE', 1, 'Natalia Brenes'),
('oferente13@bolsa.com', '$2a$12$wJs.rLW/ZWLc626kflk8ReHffjK.7.K9bFPc2E36N032J5pilkET6', 'OFERENTE', 1, 'Diego Quesada');

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'San Jose', '2201-1111', 'Empresa pendiente de revision administrativa.', 0
FROM usuario WHERE correo = 'empresa11@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Heredia', '2201-1112', 'Startup en proceso de aprobacion dentro del sistema.', 0
FROM usuario WHERE correo = 'empresa12@bolsa.com';

INSERT INTO empresa (id_empresa, ubicacion, telefono, descripcion, aprobado)
SELECT id_usuario, 'Alajuela', '2201-1113', 'Consultora tecnologica aun no validada por administrador.', 0
FROM usuario WHERE correo = 'empresa13@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1121', 'Costarricense', '7000-0011', 'San Jose', 0, '31.pdf', NULL
FROM usuario WHERE correo = 'oferente11@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1122', 'Costarricense', '7000-0012', 'Heredia', 0, '32.pdf', NULL
FROM usuario WHERE correo = 'oferente12@bolsa.com';

INSERT INTO oferente (id_oferente, identificacion, nacionalidad, telefono, residencia, aprobado, cv, foto_perfil)
SELECT id_usuario, '1-1111-1123', 'Costarricense', '7000-0013', 'Cartago', 0, '33.pdf', NULL
FROM usuario WHERE correo = 'oferente13@bolsa.com';