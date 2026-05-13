ALTER TABLE puesto
DROP
FOREIGN KEY idEmpresa;

ALTER TABLE administrador
DROP
FOREIGN KEY id_admin;

ALTER TABLE caracteristicaoferente
DROP
FOREIGN KEY id_carac;

ALTER TABLE empresa
DROP
FOREIGN KEY id_emp;

ALTER TABLE oferente
DROP
FOREIGN KEY id_ofer;

ALTER TABLE caracteristicaoferente
DROP
FOREIGN KEY id_oferente;

ALTER TABLE caracteristica
DROP
FOREIGN KEY padreID;

ALTER TABLE puestocaracteristica
DROP
FOREIGN KEY puestoCar_id;

ALTER TABLE puestocaracteristica
DROP
FOREIGN KEY puestoCarac_id;

ALTER TABLE empresa
    ADD aprobado_emp BIT(1) DEFAULT 0 NULL;

ALTER TABLE empresa
    ADD descripcion_emp VARCHAR(300) NULL;

ALTER TABLE empresa
    ADD id_emp INT NULL;

ALTER TABLE empresa
    ADD telefono_emp VARCHAR(20) NULL;

ALTER TABLE empresa
    ADD ubicacion_emp VARCHAR(40) NULL;

ALTER TABLE empresa
    MODIFY aprobado_emp BIT (1) NOT NULL;

ALTER TABLE oferente
    ADD aprobado_oferente BIT(1) DEFAULT 1 NULL;

ALTER TABLE oferente
    ADD id_oferente INT NULL;

ALTER TABLE oferente
    ADD identif_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD nacion_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD residencia_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD tel_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    MODIFY aprobado_oferente BIT (1) NOT NULL;

ALTER TABLE puesto
    ADD descripcion_puesto VARCHAR(300) NULL;

ALTER TABLE puesto
    ADD id_empresa INT NULL;

ALTER TABLE puesto
    ADD id_puesto INT NULL;

ALTER TABLE puesto
    ADD salario_puesto DOUBLE NULL;

ALTER TABLE administrador
    ADD id_administrador INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_carac_ofer INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_caracteristica INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_oferente INT NULL;

ALTER TABLE caracteristica
    ADD id_caracteristica INT NULL;

ALTER TABLE caracteristica
    ADD id_padre INT NULL;

ALTER TABLE caracteristica
    ADD nom_caracteristica VARCHAR(45) NULL;

ALTER TABLE caracteristicaoferente
    MODIFY id_caracteristica INT NOT NULL;

ALTER TABLE puestocaracteristica
    ADD id_caracteristica INT NULL;

ALTER TABLE puestocaracteristica
    ADD id_puesto INT NULL;

ALTER TABLE puestocaracteristica
    ADD id_puesto_carac INT NULL;

ALTER TABLE puestocaracteristica
    MODIFY id_caracteristica INT NOT NULL;

ALTER TABLE puesto
    MODIFY id_empresa INT NOT NULL;

ALTER TABLE caracteristicaoferente
    MODIFY id_oferente INT NOT NULL;

ALTER TABLE puestocaracteristica
    MODIFY id_puesto INT NOT NULL;

ALTER TABLE usuario
    ADD id_usuario INT NULL;

ALTER TABLE oferente
    MODIFY identif_oferente VARCHAR (45) NOT NULL;

ALTER TABLE puesto
    MODIFY salario_puesto DOUBLE NOT NULL;

ALTER TABLE administrador
    ADD CONSTRAINT FK_ADMINISTRADOR_ON_IDADMINISTRADOR FOREIGN KEY (id_administrador) REFERENCES usuario (id_usuario);

ALTER TABLE caracteristicaoferente
    ADD CONSTRAINT FK_CARACTERISTICAOFERENTE_ON_IDCARACTERISTICA FOREIGN KEY (id_caracteristica) REFERENCES caracteristica (id_caracteristica);

ALTER TABLE caracteristicaoferente
    ADD CONSTRAINT FK_CARACTERISTICAOFERENTE_ON_IDOFERENTE FOREIGN KEY (id_oferente) REFERENCES oferente (id_oferente);

ALTER TABLE caracteristica
    ADD CONSTRAINT FK_CARACTERISTICA_ON_IDPADRE FOREIGN KEY (id_padre) REFERENCES caracteristica (id_caracteristica) ON DELETE SET NULL;

ALTER TABLE empresa
    ADD CONSTRAINT FK_EMPRESA_ON_IDEMP FOREIGN KEY (id_emp) REFERENCES usuario (id_usuario) ON DELETE CASCADE;

ALTER TABLE oferente
    ADD CONSTRAINT FK_OFERENTE_ON_IDOFERENTE FOREIGN KEY (id_oferente) REFERENCES usuario (id_usuario) ON DELETE CASCADE;

ALTER TABLE puestocaracteristica
    ADD CONSTRAINT FK_PUESTOCARACTERISTICA_ON_IDCARACTERISTICA FOREIGN KEY (id_caracteristica) REFERENCES caracteristica (id_caracteristica);

ALTER TABLE puestocaracteristica
    ADD CONSTRAINT FK_PUESTOCARACTERISTICA_ON_IDPUESTO FOREIGN KEY (id_puesto) REFERENCES puesto (id_puesto) ON DELETE CASCADE;

ALTER TABLE puesto
    ADD CONSTRAINT FK_PUESTO_ON_IDEMPRESA FOREIGN KEY (id_empresa) REFERENCES empresa (id_emp) ON DELETE CASCADE;

ALTER TABLE administrador
DROP
COLUMN idAdministrador;

ALTER TABLE caracteristicaoferente
DROP
COLUMN idCaracOfer;

ALTER TABLE caracteristicaoferente
DROP
COLUMN idCaracteristica;

ALTER TABLE caracteristicaoferente
DROP
COLUMN idOferente;

ALTER TABLE caracteristica
DROP
COLUMN idCaracteristica;

ALTER TABLE caracteristica
DROP
COLUMN idPadre;

ALTER TABLE caracteristica
DROP
COLUMN nomCaracteristica;

ALTER TABLE empresa
DROP
COLUMN idEmp;

ALTER TABLE empresa
DROP
COLUMN aprobadoEmp;

ALTER TABLE empresa
DROP
COLUMN descripcionEmp;

ALTER TABLE empresa
DROP
COLUMN telefonoEmp;

ALTER TABLE empresa
DROP
COLUMN ubicacionEmp;

ALTER TABLE puestocaracteristica
DROP
COLUMN idPuestoCarac;

ALTER TABLE puestocaracteristica
DROP
COLUMN idCaracteristica;

ALTER TABLE puestocaracteristica
DROP
COLUMN idPuesto;

ALTER TABLE oferente
DROP
COLUMN idoferente;

ALTER TABLE oferente
DROP
COLUMN aprobadoOferente;

ALTER TABLE oferente
DROP
COLUMN identifOferente;

ALTER TABLE oferente
DROP
COLUMN nacionOferente;

ALTER TABLE oferente
DROP
COLUMN residenciaOferente;

ALTER TABLE oferente
DROP
COLUMN telOferente;

ALTER TABLE puesto
DROP
COLUMN idpuesto;

ALTER TABLE puesto
DROP
COLUMN descripcionPuesto;

ALTER TABLE puesto
DROP
COLUMN idEmpresa;

ALTER TABLE puesto
DROP
COLUMN salarioPuesto;

ALTER TABLE puesto
DROP
COLUMN tipo;

ALTER TABLE usuario
DROP
COLUMN idusuario;

ALTER TABLE usuario
DROP
COLUMN rol;

ALTER TABLE usuario
    ADD rol LONGTEXT NOT NULL;

ALTER TABLE puesto
    ADD tipo LONGTEXT NOT NULL;

ALTER TABLE administrador
    ADD PRIMARY KEY (id_administrador);

ALTER TABLE caracteristica
    ADD PRIMARY KEY (id_caracteristica);

ALTER TABLE caracteristicaoferente
    ADD PRIMARY KEY (id_carac_ofer);

ALTER TABLE empresa
    ADD PRIMARY KEY (id_emp);

ALTER TABLE oferente
    ADD PRIMARY KEY (id_oferente);

ALTER TABLE puesto
    ADD PRIMARY KEY (id_puesto);

ALTER TABLE puestocaracteristica
    ADD PRIMARY KEY (id_puesto_carac);

ALTER TABLE usuario
    ADD PRIMARY KEY (id_usuario);
ALTER TABLE puesto
    DROP FOREIGN KEY idEmpresa;

ALTER TABLE administrador
    DROP FOREIGN KEY id_admin;

ALTER TABLE caracteristicaoferente
    DROP FOREIGN KEY id_carac;

ALTER TABLE empresa
    DROP FOREIGN KEY id_emp;

ALTER TABLE oferente
    DROP FOREIGN KEY id_ofer;

ALTER TABLE caracteristicaoferente
    DROP FOREIGN KEY id_oferente;

ALTER TABLE caracteristica
    DROP FOREIGN KEY padreID;

ALTER TABLE puestocaracteristica
    DROP FOREIGN KEY puestoCar_id;

ALTER TABLE puestocaracteristica
    DROP FOREIGN KEY puestoCarac_id;

ALTER TABLE empresa
    ADD aprobado_emp BIT(1) DEFAULT 0 NULL;

ALTER TABLE empresa
    ADD descripcion_emp VARCHAR(300) NULL;

ALTER TABLE empresa
    ADD id_emp INT NULL;

ALTER TABLE empresa
    ADD telefono_emp VARCHAR(20) NULL;

ALTER TABLE empresa
    ADD ubicacion_emp VARCHAR(40) NULL;

ALTER TABLE empresa
    MODIFY aprobado_emp BIT(1) NOT NULL;

ALTER TABLE oferente
    ADD aprobado_oferente BIT(1) DEFAULT 1 NULL;

ALTER TABLE oferente
    ADD id_oferente INT NULL;

ALTER TABLE oferente
    ADD identif_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD nacion_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD residencia_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    ADD tel_oferente VARCHAR(45) NULL;

ALTER TABLE oferente
    MODIFY aprobado_oferente BIT(1) NOT NULL;

ALTER TABLE puesto
    ADD descripcion_puesto VARCHAR(300) NULL;

ALTER TABLE puesto
    ADD id_empresa INT NULL;

ALTER TABLE puesto
    ADD id_puesto INT NULL;

ALTER TABLE puesto
    ADD salario_puesto DOUBLE NULL;

ALTER TABLE administrador
    ADD id_administrador INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_carac_ofer INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_caracteristica INT NULL;

ALTER TABLE caracteristicaoferente
    ADD id_oferente INT NULL;

ALTER TABLE caracteristica
    ADD id_caracteristica INT NULL;

ALTER TABLE caracteristica
    ADD id_padre INT NULL;

ALTER TABLE caracteristica
    ADD nom_caracteristica VARCHAR(45) NULL;

ALTER TABLE caracteristicaoferente
    MODIFY id_caracteristica INT NOT NULL;

ALTER TABLE puestocaracteristica
    ADD id_caracteristica INT NULL;

ALTER TABLE puestocaracteristica
    ADD id_puesto INT NULL;

ALTER TABLE puestocaracteristica
    ADD id_puesto_carac INT NULL;

ALTER TABLE puestocaracteristica
    MODIFY id_caracteristica INT NOT NULL;

ALTER TABLE puesto
    MODIFY id_empresa INT NOT NULL;

ALTER TABLE caracteristicaoferente
    MODIFY id_oferente INT NOT NULL;

ALTER TABLE puestocaracteristica
    MODIFY id_puesto INT NOT NULL;

ALTER TABLE usuario
    ADD id_usuario INT NULL;

ALTER TABLE oferente
    MODIFY identif_oferente VARCHAR(45) NOT NULL;

ALTER TABLE puesto
    MODIFY salario_puesto DOUBLE NOT NULL;

ALTER TABLE administrador
    ADD CONSTRAINT FK_ADMINISTRADOR_ON_IDADMINISTRADOR FOREIGN KEY (id_administrador) REFERENCES usuario (id_usuario);

ALTER TABLE caracteristicaoferente
    ADD CONSTRAINT FK_CARACTERISTICAOFERENTE_ON_IDCARACTERISTICA FOREIGN KEY (id_caracteristica) REFERENCES caracteristica (id_caracteristica);

ALTER TABLE caracteristicaoferente
    ADD CONSTRAINT FK_CARACTERISTICAOFERENTE_ON_IDOFERENTE FOREIGN KEY (id_oferente) REFERENCES oferente (id_oferente);

ALTER TABLE caracteristica
    ADD CONSTRAINT FK_CARACTERISTICA_ON_IDPADRE FOREIGN KEY (id_padre) REFERENCES caracteristica (id_caracteristica) ON DELETE SET NULL;

ALTER TABLE empresa
    ADD CONSTRAINT FK_EMPRESA_ON_IDEMP FOREIGN KEY (id_emp) REFERENCES usuario (id_usuario) ON DELETE CASCADE;

ALTER TABLE oferente
    ADD CONSTRAINT FK_OFERENTE_ON_IDOFERENTE FOREIGN KEY (id_oferente) REFERENCES usuario (id_usuario) ON DELETE CASCADE;

ALTER TABLE puestocaracteristica
    ADD CONSTRAINT FK_PUESTOCARACTERISTICA_ON_IDCARACTERISTICA FOREIGN KEY (id_caracteristica) REFERENCES caracteristica (id_caracteristica);

ALTER TABLE puestocaracteristica
    ADD CONSTRAINT FK_PUESTOCARACTERISTICA_ON_IDPUESTO FOREIGN KEY (id_puesto) REFERENCES puesto (id_puesto) ON DELETE CASCADE;

ALTER TABLE puesto
    ADD CONSTRAINT FK_PUESTO_ON_IDEMPRESA FOREIGN KEY (id_empresa) REFERENCES empresa (id_emp) ON DELETE CASCADE;

ALTER TABLE administrador
    DROP COLUMN idAdministrador;

ALTER TABLE caracteristicaoferente
    DROP COLUMN idCaracOfer;

ALTER TABLE caracteristicaoferente
    DROP COLUMN idCaracteristica;

ALTER TABLE caracteristicaoferente
    DROP COLUMN idOferente;

ALTER TABLE caracteristica
    DROP COLUMN idCaracteristica;

ALTER TABLE caracteristica
    DROP COLUMN idPadre;

ALTER TABLE caracteristica
    DROP COLUMN nomCaracteristica;

ALTER TABLE empresa
    DROP COLUMN idEmp;

ALTER TABLE empresa
    DROP COLUMN aprobadoEmp;

ALTER TABLE empresa
    DROP COLUMN descripcionEmp;

ALTER TABLE empresa
    DROP COLUMN telefonoEmp;

ALTER TABLE empresa
    DROP COLUMN ubicacionEmp;

ALTER TABLE puestocaracteristica
    DROP COLUMN idPuestoCarac;

ALTER TABLE puestocaracteristica
    DROP COLUMN idCaracteristica;

ALTER TABLE puestocaracteristica
    DROP COLUMN idPuesto;

ALTER TABLE oferente
    DROP COLUMN idoferente;

ALTER TABLE oferente
    DROP COLUMN aprobadoOferente;

ALTER TABLE oferente
    DROP COLUMN identifOferente;

ALTER TABLE oferente
    DROP COLUMN nacionOferente;

ALTER TABLE oferente
    DROP COLUMN residenciaOferente;

ALTER TABLE oferente
    DROP COLUMN telOferente;

ALTER TABLE puesto
    DROP COLUMN idpuesto;

ALTER TABLE puesto
    DROP COLUMN descripcionPuesto;

ALTER TABLE puesto
    DROP COLUMN idEmpresa;

ALTER TABLE puesto
    DROP COLUMN salarioPuesto;

ALTER TABLE puesto
    DROP COLUMN tipo;

ALTER TABLE usuario
    DROP COLUMN idusuario;

ALTER TABLE usuario
    DROP COLUMN rol;

ALTER TABLE usuario
    ADD rol LONGTEXT NOT NULL;

ALTER TABLE puesto
    ADD tipo LONGTEXT NOT NULL;

ALTER TABLE administrador
    ADD PRIMARY KEY (id_administrador);

ALTER TABLE caracteristica
    ADD PRIMARY KEY (id_caracteristica);

ALTER TABLE caracteristicaoferente
    ADD PRIMARY KEY (id_carac_ofer);

ALTER TABLE empresa
    ADD PRIMARY KEY (id_emp);

ALTER TABLE oferente
    ADD PRIMARY KEY (id_oferente);

ALTER TABLE puesto
    ADD PRIMARY KEY (id_puesto);

ALTER TABLE puestocaracteristica
    ADD PRIMARY KEY (id_puesto_carac);

ALTER TABLE usuario
    ADD PRIMARY KEY (id_usuario);