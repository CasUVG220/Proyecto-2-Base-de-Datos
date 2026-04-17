
-- StoreManager — init.sql
-- DDL: tablas, vistas, índices, funciones y triggers
-- DBMS: PostgreSQL 15
-- Usuario: proy2 | Base de datos: storemanager


-- 0. Extensiones

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- 1. TABLAS PRINCIPALES


-- 1.1 Categorías de productos
CREATE TABLE categorias (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.2 Proveedores
CREATE TABLE proveedores (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(150)    NOT NULL,
    contacto    VARCHAR(100),
    telefono    VARCHAR(20),
    email       VARCHAR(150),
    direccion   TEXT,
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.3 Productos
CREATE TABLE productos (
    id              SERIAL          PRIMARY KEY,
    categoria_id    INT             NOT NULL REFERENCES categorias(id),
    proveedor_id    INT             NOT NULL REFERENCES proveedores(id),
    nombre          VARCHAR(150)    NOT NULL,
    descripcion     TEXT,
    precio_compra   NUMERIC(10,2)   NOT NULL CHECK (precio_compra >= 0),
    precio_venta    NUMERIC(10,2)   NOT NULL CHECK (precio_venta >= 0),
    stock           INT             NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo    INT             NOT NULL DEFAULT 5,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.4 Empleados
CREATE TABLE empleados (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL,
    apellido    VARCHAR(100)    NOT NULL,
    cargo       VARCHAR(100)    NOT NULL,
    telefono    VARCHAR(20),
    email       VARCHAR(150)    UNIQUE,
    salario     NUMERIC(10,2)   NOT NULL CHECK (salario >= 0),
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.5 Clientes
CREATE TABLE clientes (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL,
    apellido    VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    UNIQUE,
    telefono    VARCHAR(20),
    direccion   TEXT,
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.6 Ventas (cabecera)
CREATE TABLE ventas (
    id              SERIAL          PRIMARY KEY,
    cliente_id      INT             NOT NULL REFERENCES clientes(id),
    empleado_id     INT             NOT NULL REFERENCES empleados(id),
    fecha           TIMESTAMP       NOT NULL DEFAULT NOW(),
    subtotal        NUMERIC(10,2)   NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    impuesto        NUMERIC(10,2)   NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
    total           NUMERIC(10,2)   NOT NULL DEFAULT 0 CHECK (total >= 0),
    estado          VARCHAR(20)     NOT NULL DEFAULT 'completada'
                                    CHECK (estado IN ('completada','anulada','pendiente')),
    notas           TEXT,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 1.7 Detalle de ventas (líneas)
CREATE TABLE detalle_ventas (
    id              SERIAL          PRIMARY KEY,
    venta_id        INT             NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id     INT             NOT NULL REFERENCES productos(id),
    cantidad        INT             NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2)   NOT NULL CHECK (precio_unitario >= 0),
    subtotal        NUMERIC(10,2)   NOT NULL CHECK (subtotal >= 0)
);

-- 1.8 Usuarios de la aplicación (autenticación)
CREATE TABLE usuarios (
    id              SERIAL          PRIMARY KEY,
    empleado_id     INT             REFERENCES empleados(id),
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    rol             VARCHAR(20)     NOT NULL DEFAULT 'vendedor'
                                    CHECK (rol IN ('admin','vendedor','supervisor')),
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_login    TIMESTAMP,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 2. ÍNDICES EXPLÍCITOS (CREATE INDEX)
-- Justificación: columnas usadas frecuentemente en WHERE, JOIN y ORDER BY


-- Búsqueda de productos por nombre (búsqueda en UI)
CREATE INDEX idx_productos_nombre
    ON productos USING gin(to_tsvector('spanish', nombre));

-- Búsqueda rápida de ventas por fecha (reportes)
CREATE INDEX idx_ventas_fecha
    ON ventas(fecha DESC);

-- Filtrado de ventas por empleado (reporte de desempeño)
CREATE INDEX idx_ventas_empleado_id
    ON ventas(empleado_id);

-- Filtrado de ventas por cliente
CREATE INDEX idx_ventas_cliente_id
    ON ventas(cliente_id);

-- Filtrado de detalle por venta (carga de líneas)
CREATE INDEX idx_detalle_venta_id
    ON detalle_ventas(venta_id);

-- Filtrado de productos por categoría
CREATE INDEX idx_productos_categoria_id
    ON productos(categoria_id);

-- Filtrado de productos con stock bajo (alerta inventario)
CREATE INDEX idx_productos_stock
    ON productos(stock) WHERE stock <= stock_minimo;

-- Búsqueda de clientes por email
CREATE INDEX idx_clientes_email
    ON clientes(email);


-- 3. VISTAS (VIEW)
-- Usadas por el backend para alimentar la UI


-- Vista 1: Catálogo completo con nombre de categoría y proveedor
CREATE VIEW v_productos_completo AS
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        c.nombre        AS categoria,
        pr.nombre       AS proveedor,
        p.precio_compra,
        p.precio_venta,
        p.stock,
        p.stock_minimo,
        p.activo,
        ROUND(((p.precio_venta - p.precio_compra) / NULLIF(p.precio_compra, 0)) * 100, 2) AS margen_pct
    FROM  productos p
    JOIN  categorias  c  ON c.id  = p.categoria_id
    JOIN  proveedores pr ON pr.id = p.proveedor_id;

-- Vista 2: Resumen de ventas con nombres de cliente y empleado
CREATE VIEW v_ventas_resumen AS
    SELECT
        v.id,
        v.fecha,
        v.estado,
        CONCAT(c.nombre, ' ', c.apellido)    AS cliente,
        CONCAT(e.nombre, ' ', e.apellido)    AS empleado,
        v.subtotal,
        v.impuesto,
        v.total,
        COUNT(dv.id)                         AS num_lineas
    FROM  ventas v
    JOIN  clientes   c  ON c.id  = v.cliente_id
    JOIN  empleados  e  ON e.id  = v.empleado_id
    LEFT JOIN detalle_ventas dv ON dv.venta_id = v.id
    GROUP BY v.id, v.fecha, v.estado, c.nombre, c.apellido, e.nombre, e.apellido,
             v.subtotal, v.impuesto, v.total;

-- Vista 3: Productos con stock bajo (para alertas)
CREATE VIEW v_stock_bajo AS
    SELECT
        p.id,
        p.nombre,
        c.nombre    AS categoria,
        pr.nombre   AS proveedor,
        p.stock,
        p.stock_minimo,
        (p.stock_minimo - p.stock) AS unidades_faltantes
    FROM  productos p
    JOIN  categorias  c  ON c.id  = p.categoria_id
    JOIN  proveedores pr ON pr.id = p.proveedor_id
    WHERE p.stock <= p.stock_minimo
      AND p.activo = TRUE
    ORDER BY unidades_faltantes DESC;

-- Vista 4: Reporte de ventas por empleado (JOIN múltiple)
CREATE VIEW v_ventas_por_empleado AS
    SELECT
        e.id                                    AS empleado_id,
        CONCAT(e.nombre, ' ', e.apellido)       AS empleado,
        e.cargo,
        COUNT(DISTINCT v.id)                    AS total_ventas,
        COALESCE(SUM(v.total), 0)               AS ingresos_totales,
        COALESCE(AVG(v.total), 0)               AS ticket_promedio,
        MAX(v.fecha)                            AS ultima_venta
    FROM  empleados e
    LEFT JOIN ventas v ON v.empleado_id = e.id
                       AND v.estado = 'completada'
    GROUP BY e.id, e.nombre, e.apellido, e.cargo;

-- Vista 5: Top productos más vendidos (usada por el CTE del reporte)
CREATE VIEW v_productos_vendidos AS
    SELECT
        p.id                        AS producto_id,
        p.nombre                    AS producto,
        c.nombre                    AS categoria,
        SUM(dv.cantidad)            AS unidades_vendidas,
        SUM(dv.subtotal)            AS ingresos_totales,
        COUNT(DISTINCT dv.venta_id) AS num_ventas
    FROM  detalle_ventas dv
    JOIN  productos   p ON p.id = dv.producto_id
    JOIN  categorias  c ON c.id = p.categoria_id
    JOIN  ventas      v ON v.id = dv.venta_id
    WHERE v.estado = 'completada'
    GROUP BY p.id, p.nombre, c.nombre;


-- 4. FUNCIÓN + TRIGGER: actualizar stock automáticamente
-- Disminuye stock cuando se inserta una línea de detalle

CREATE OR REPLACE FUNCTION fn_actualizar_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
       SET stock          = stock - NEW.cantidad,
           actualizado_en = NOW()
     WHERE id = NEW.producto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_stock();

-- Función para restaurar stock al anular una venta
CREATE OR REPLACE FUNCTION fn_restaurar_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'anulada' AND OLD.estado != 'anulada' THEN
        UPDATE productos p
           SET stock          = stock + dv.cantidad,
               actualizado_en = NOW()
          FROM detalle_ventas dv
         WHERE dv.venta_id = NEW.id
           AND p.id        = dv.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_restaurar_stock
AFTER UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION fn_restaurar_stock();

-- Trigger para actualizar campo actualizado_en de productos
CREATE OR REPLACE FUNCTION fn_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_updated_at();

-- FIN DEL SCRIPT DDL
