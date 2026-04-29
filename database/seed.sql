-- StoreManager — seed.sql
-- Datos de prueba realistas — mínimo 25 registros por tabla

-- 1. CATEGORÍAS (10 registros)

INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica',         'Dispositivos electrónicos, gadgets y accesorios tecnológicos'),
('Ropa y Calzado',      'Prendas de vestir, zapatos y accesorios de moda'),
('Alimentos y Bebidas', 'Productos alimenticios, snacks, bebidas y conservas'),
('Hogar y Decoración',  'Muebles, lámparas, adornos y artículos para el hogar'),
('Deportes',            'Equipos, ropa y accesorios deportivos'),
('Juguetes',            'Juguetes, juegos de mesa y artículos recreativos'),
('Salud y Belleza',     'Medicamentos sin receta, cosméticos y cuidado personal'),
('Libros y Papelería',  'Libros, útiles escolares y artículos de oficina'),
('Automotriz',          'Accesorios y repuestos para vehículos'),
('Herramientas',        'Herramientas manuales, eléctricas y equipos de construcción');

-- 2. PROVEEDORES (15 registros)
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('TecnoDistri S.A.',        'Carlos Morales',    '2255-1001', 'ventas@tecnodistri.gt',    'Zona 10, Guatemala City'),
('Moda Express Ltda.',      'Ana Cifuentes',     '2255-1002', 'compras@modaexpress.gt',   'Zona 4, Guatemala City'),
('AgroAlimentos del Norte', 'Pedro Xicará',      '7755-2001', 'pedidos@agroalim.gt',      'Cobán, Alta Verapaz'),
('HogarTotal Corp.',        'Sandra López',      '2255-1003', 'info@hogartotal.gt',       'Zona 12, Guatemala City'),
('SportLine Guatemala',     'Roberto Pérez',     '2255-1004', 'ventas@sportline.gt',      'Zona 15, Guatemala City'),
('JuguetesAlegría S.A.',    'María Gómez',       '2255-1005', 'contacto@juguetesaleg.gt', 'Zona 7, Guatemala City'),
('FarmaDistrib Central',    'Luis Monterroso',   '2255-1006', 'pedidos@farmadist.gt',     'Zona 1, Guatemala City'),
('Editorial Ixchel',        'Claudia Hernández', '2255-1007', 'ventas@ixchel.gt',         'Zona 3, Guatemala City'),
('AutoPartes del Sur',      'Diego Castillo',    '7755-3001', 'ventas@autopartessur.gt',  'Escuintla'),
('FerreMax S.A.',           'Tomás Ajú',         '2255-1008', 'info@ferremax.gt',         'Zona 11, Guatemala City'),
('GlobalTech Import',       'Elena Barrios',     '2255-1009', 'import@globaltech.gt',     'Zona 13, Guatemala City'),
('Textiles Maya',           'José Curruchich',   '7955-4001', 'textiles@maya.gt',         'Chichicastenango, Quiché'),
('NaturFood Export',        'Rosa Sis',          '7755-2002', 'export@naturfood.gt',      'Antigua Guatemala'),
('DiseñoHogar Premium',     'Patricia Veliz',    '2255-1010', 'info@disenohogarprem.gt',  'Zona 14, Guatemala City'),
('MegaHerramientas',        'Óscar Salguero',    '2255-1011', 'ventas@megaherram.gt',     'Zona 5, Guatemala City');


-- 3. EMPLEADOS (15 registros)

INSERT INTO empleados (nombre, apellido, cargo, telefono, email, salario) VALUES
('María',     'González',  'Administrador',    '5501-1001', 'mgonzalez@store.gt',   8500.00),
('Jorge',     'Ramírez',   'Supervisor',       '5501-1002', 'jramirez@store.gt',    6500.00),
('Andrea',    'Fuentes',   'Vendedor',         '5501-1003', 'afuentes@store.gt',    3500.00),
('Luis',      'Castañeda', 'Vendedor',         '5501-1004', 'lcastaneda@store.gt',  3500.00),
('Carmen',    'Solís',     'Vendedor',         '5501-1005', 'csolis@store.gt',      3500.00),
('Roberto',   'Herrera',   'Bodeguero',        '5501-1006', 'rherrera@store.gt',    3200.00),
('Paola',     'Méndez',    'Cajero',           '5501-1007', 'pmendez@store.gt',     3000.00),
('Fernando',  'Cruz',      'Vendedor',         '5501-1008', 'fcruz@store.gt',       3500.00),
('Sofía',     'Álvarez',   'Supervisor',       '5501-1009', 'salvarezgr@store.gt',  6500.00),
('Diego',     'Morales',   'Vendedor',         '5501-1010', 'dmorales@store.gt',    3500.00),
('Alejandra', 'Rivas',     'Cajero',           '5501-1011', 'arivas@store.gt',      3000.00),
('Héctor',    'Barrios',   'Bodeguero',        '5501-1012', 'hbarrios@store.gt',    3200.00),
('Valeria',   'Pineda',    'Vendedor',         '5501-1013', 'vpineda@store.gt',     3500.00),
('Manuel',    'Xicará',    'Vendedor',         '5501-1014', 'mxicara@store.gt',     3500.00),
('Gloria',    'Tzoc',      'Recepcionista',    '5501-1015', 'gtzoc@store.gt',       2800.00);


-- 4. CLIENTES (30 registros)

INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES
('Ana',        'López',       'ana.lopez@gmail.com',      '5502-0001', 'Zona 1, Guatemala City'),
('Marco',      'Hernández',   'marco.hdz@gmail.com',      '5502-0002', 'Zona 2, Guatemala City'),
('Lucía',      'Pérez',       'lucia.perez@gmail.com',    '5502-0003', 'Mixco, Guatemala'),
('Carlos',     'Gómez',       'carlos.g@gmail.com',       '5502-0004', 'Zona 7, Guatemala City'),
('Fernanda',   'Martínez',    'fer.mtz@gmail.com',        '5502-0005', 'Villa Nueva, Guatemala'),
('Andrés',     'Juárez',      'andres.j@gmail.com',       '5502-0006', 'Zona 11, Guatemala City'),
('Patricia',   'Orellana',    'paty.ore@gmail.com',       '5502-0007', 'Zona 15, Guatemala City'),
('Ricardo',    'Estrada',     'rick.est@gmail.com',       '5502-0008', 'Amatitlán, Guatemala'),
('Daniela',    'Sánchez',     'dani.sanchez@gmail.com',   '5502-0009', 'Zona 5, Guatemala City'),
('Eduardo',    'Lima',        'edu.lima@gmail.com',       '5502-0010', 'Chimaltenango'),
('Gabriela',   'Torres',      'gaby.torres@gmail.com',   '5502-0011', 'Zona 9, Guatemala City'),
('Pablo',      'Recinos',     'pablo.rec@gmail.com',      '5502-0012', 'Zona 6, Guatemala City'),
('Valeria',    'Cojulún',     'vale.cojulun@gmail.com',   '5502-0013', 'Zona 14, Guatemala City'),
('Javier',     'Acabal',      'javi.acabal@gmail.com',    '5502-0014', 'Quetzaltenango'),
('Isabel',     'Maldonado',   'isa.maldo@gmail.com',      '5502-0015', 'Zona 13, Guatemala City'),
('Diego',      'Chávez',      'diego.chavez@gmail.com',   '5502-0016', 'Zona 10, Guatemala City'),
('Mónica',     'Velásquez',   'moni.vela@gmail.com',      '5502-0017', 'Antigua Guatemala'),
('Sebastián',  'Arriola',     'seba.arriola@gmail.com',   '5502-0018', 'Zona 12, Guatemala City'),
('Claudia',    'Prado',       'clau.prado@gmail.com',     '5502-0019', 'San Marcos'),
('Miguel',     'Polanco',     'miguel.pol@gmail.com',     '5502-0020', 'Zona 3, Guatemala City'),
('Laura',      'Xinico',      'laura.xinico@gmail.com',   '5502-0021', 'Cobán, Alta Verapaz'),
('Héctor',     'Culajay',     'hector.culajay@gmail.com', '5502-0022', 'Huehuetenango'),
('Brenda',     'Ajú',         'brenda.aju@gmail.com',     '5502-0023', 'Zona 8, Guatemala City'),
('Samuel',     'Noriega',     'samuel.nor@gmail.com',     '5502-0024', 'Escuintla'),
('Lorena',     'Sajvin',      'lorena.saj@gmail.com',     '5502-0025', 'Zona 18, Guatemala City'),
('Alejandro',  'Curruchich',  'ale.curruchich@gmail.com', '5502-0026', 'Chichicastenango, Quiché'),
('Sofía',      'Mendoza',     'sofi.mendo@gmail.com',     '5502-0027', 'Petén'),
('Rodrigo',    'Batres',      'rodri.bat@gmail.com',      '5502-0028', 'Zona 16, Guatemala City'),
('Natalia',    'Tezén',       'nati.tezen@gmail.com',     '5502-0029', 'Zona 4, Guatemala City'),
('Ernesto',    'Barrientos',  'ernesto.bar@gmail.com',    '5502-0030', 'Villa Canales, Guatemala');


-- 5. PRODUCTOS (40 registros)
INSERT INTO productos (categoria_id, proveedor_id, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo) VALUES
-- Electrónica (cat 1)
(1,  1,  'Smartphone Samsung A15',        'Teléfono Android 64GB',                 950.00,  1350.00,  45, 10),
(1,  1,  'Audífonos Bluetooth JBL',       'Audífonos inalámbricos 20h batería',    180.00,   320.00,  60, 10),
(1, 11,  'Tablet Lenovo M10',             'Tablet 10 pulgadas 4GB RAM',            750.00,  1100.00,  30,  8),
(1,  1,  'Cargador USB-C 65W',            'Cargador rápido compatible multipuerto',  55.00,   110.00, 100, 15),
(1, 11,  'Smartwatch Xiaomi Band 8',      'Pulsera inteligente deportiva',          230.00,   420.00,  40, 10),
-- Ropa (cat 2)
(2,  2,  'Camiseta básica algodón M',     'Camiseta 100% algodón talla M',          35.00,    75.00, 120, 20),
(2,  2,  'Jeans slim fit hombre 32',      'Pantalón de mezclilla corte slim',        95.00,   199.00,  80, 15),
(2, 12,  'Blusa floral mujer S',          'Blusa con estampado floral talla S',      55.00,   120.00,  70, 15),
(2,  2,  'Tenis deportivos Nike #42',     'Calzado deportivo talla 42',             280.00,   550.00,  35, 10),
(2, 12,  'Vestido casual mujer M',        'Vestido de algodón para uso diario',      90.00,   195.00,  50, 10),
-- Alimentos (cat 3)
(3,  3,  'Café molido premium 500g',      'Café guatemalteco de altura',             45.00,    95.00, 200, 30),
(3,  3,  'Miel de abeja pura 500ml',      'Miel artesanal de Las Verapaces',         60.00,   120.00, 150, 25),
(3, 13,  'Granola artesanal 400g',        'Mezcla de avena, nueces y frutas secas',  38.00,    80.00, 100, 20),
(3,  3,  'Chocolate negro 70% 100g',      'Tableta de cacao guatemalteco',           18.00,    42.00, 250, 40),
(3, 13,  'Aceite de oliva extra virgen',  'Botella 500ml importado España',          85.00,   175.00,  80, 15),
-- Hogar (cat 4)
(4,  4,  'Lámpara LED escritorio',        'Lámpara de mesa con USB 12W',             88.00,   180.00,  55, 10),
(4,  4,  'Almohada memory foam',          'Almohada ergonómica para cuello',         95.00,   220.00,  40, 8),
(4, 14,  'Portarretrato madera 5x7',      'Marco de madera natural 5x7 pulgadas',    22.00,    55.00, 150, 25),
(4,  4,  'Juego de toallas 4 piezas',     'Toallas de algodón egipcio',              75.00,   165.00,  60, 12),
(4, 14,  'Vela aromática lavanda',        'Vela de soja con aroma a lavanda 200g',   25.00,    65.00, 200, 30),
-- Deportes (cat 5)
(5,  5,  'Pelota de fútbol #5',           'Balón profesional FIFA quality',          85.00,   180.00,  45, 10),
(5,  5,  'Colchoneta yoga 6mm',           'Mat antideslizante 183x61cm',             75.00,   160.00,  50, 10),
(5,  5,  'Mancuernas 5kg par',            'Pesas de hierro fundido 5kg c/u',        120.00,   260.00,  30,  8),
(5,  5,  'Botella deportiva 750ml',       'Botella Tritan libre BPA',                28.00,    65.00, 120, 20),
(5,  5,  'Cuerda de saltar profesional',  'Cuerda con rodamientos de acero',         35.00,    80.00,  90, 15),
-- Juguetes (cat 6)
(6,  6,  'LEGO Classic 500 piezas',       'Set de construcción creativa',           180.00,   380.00,  25,  5),
(6,  6,  'Muñeca interactiva',            'Muñeca que habla y canta',                95.00,   210.00,  30,  8),
(6,  6,  'Auto control remoto',           'Auto RC recargable 2.4GHz',               85.00,   195.00,  40, 10),
(6,  6,  'Juego de mesa UNO',             'Baraja original Mattel',                  22.00,    55.00, 100, 20),
(6,  6,  'Rompecabezas 1000 piezas',      'Paisaje guatemalteco alta calidad',        38.00,    90.00,  60, 12),
-- Salud (cat 7)
(7,  7,  'Multivitamínico adulto x60',    'Complejo vitamínico diario',              75.00,   150.00, 100, 20),
(7,  7,  'Protector solar SPF50 200ml',   'Bloqueador solar resistente al agua',      55.00,   120.00,  80, 15),
(7,  7,  'Termómetro digital',            'Termómetro infrarrojo frente',             88.00,   195.00,  50, 10),
-- Libros (cat 8)
(8,  8,  'Cien años de soledad',          'García Márquez — edición especial',        65.00,   140.00,  40, 10),
(8,  8,  'Aprendiendo SQL Avanzado',      'Libro técnico bases de datos',             80.00,   175.00,  30,  8),
-- Automotriz (cat 9)
(9,  9,  'Limpia vidrios 500ml',          'Líquido limpiador para parabrisas',        22.00,    50.00, 150, 25),
(9,  9,  'Aromatizante auto pino',        'Ambientador colgante pino forestal',        8.00,    22.00, 300, 50),
-- Herramientas (cat 10)
(10, 10, 'Taladro eléctrico 600W',        'Taladro percutor 2 velocidades',          350.00,   720.00,  20,  5),
(10, 10, 'Juego de llaves mixtas 8pz',    'Llaves cromo-vanadio 8-19mm',              95.00,   210.00,  35, 8),
(10, 15, 'Nivel de burbuja 60cm',         'Nivel de aluminio 3 burbujas',             42.00,    95.00,  45, 10);

-- 6. USUARIOS (5 registros — contraseña: admin123 para todos)
INSERT INTO usuarios (empleado_id, email, password_hash, rol) VALUES
(1, 'admin@store.com',      '$2b$10$2XNjdMOE0OIORyzZpGjPNO77KWas6CSvqP105dXAu3hKuZabx73Du', 'admin'),
(2, 'supervisor@store.com', '$2b$10$2XNjdMOE0OIORyzZpGjPNO77KWas6CSvqP105dXAu3hKuZabx73Du', 'supervisor'),
(3, 'andrea@store.com',     '$2b$10$2XNjdMOE0OIORyzZpGjPNO77KWas6CSvqP105dXAu3hKuZabx73Du', 'vendedor'),
(4, 'luis@store.com',       '$2b$10$2XNjdMOE0OIORyzZpGjPNO77KWas6CSvqP105dXAu3hKuZabx73Du', 'vendedor'),
(9, 'sofia@store.com',      '$2b$10$2XNjdMOE0OIORyzZpGjPNO77KWas6CSvqP105dXAu3hKuZabx73Du', 'supervisor');


-- 7. VENTAS Y DETALLE (35 ventas con múltiples líneas)

INSERT INTO ventas (cliente_id, empleado_id, fecha, estado) VALUES
( 1,  3, NOW() - INTERVAL '30 days', 'completada'),  -- venta 1
( 2,  4, NOW() - INTERVAL '29 days', 'completada'),  -- venta 2
( 3,  5, NOW() - INTERVAL '28 days', 'completada'),  -- venta 3
( 4,  8, NOW() - INTERVAL '27 days', 'completada'),  -- venta 4
( 5, 10, NOW() - INTERVAL '26 days', 'completada'),  -- venta 5
( 6,  3, NOW() - INTERVAL '25 days', 'completada'),  -- venta 6
( 7,  4, NOW() - INTERVAL '24 days', 'completada'),  -- venta 7
( 8,  5, NOW() - INTERVAL '23 days', 'completada'),  -- venta 8
( 9,  8, NOW() - INTERVAL '22 days', 'completada'),  -- venta 9
(10, 13, NOW() - INTERVAL '21 days', 'completada'),  -- venta 10
(11,  3, NOW() - INTERVAL '20 days', 'completada'),  -- venta 11
(12,  4, NOW() - INTERVAL '19 days', 'completada'),  -- venta 12
(13,  5, NOW() - INTERVAL '18 days', 'completada'),  -- venta 13
(14,  8, NOW() - INTERVAL '17 days', 'completada'),  -- venta 14
(15, 10, NOW() - INTERVAL '16 days', 'completada'),  -- venta 15
(16, 13, NOW() - INTERVAL '15 days', 'completada'),  -- venta 16
(17,  3, NOW() - INTERVAL '14 days', 'completada'),  -- venta 17
(18,  4, NOW() - INTERVAL '13 days', 'completada'),  -- venta 18
(19,  5, NOW() - INTERVAL '12 days', 'completada'),  -- venta 19
(20,  8, NOW() - INTERVAL '11 days', 'completada'),  -- venta 20
(21, 10, NOW() - INTERVAL '10 days', 'completada'),  -- venta 21
(22, 13, NOW() - INTERVAL '9 days',  'completada'),  -- venta 22
(23,  3, NOW() - INTERVAL '8 days',  'completada'),  -- venta 23
(24,  4, NOW() - INTERVAL '7 days',  'completada'),  -- venta 24
(25,  5, NOW() - INTERVAL '6 days',  'completada'),  -- venta 25
(26,  8, NOW() - INTERVAL '5 days',  'completada'),  -- venta 26
(27, 10, NOW() - INTERVAL '4 days',  'completada'),  -- venta 27
(28, 13, NOW() - INTERVAL '3 days',  'completada'),  -- venta 28
(29,  3, NOW() - INTERVAL '2 days',  'completada'),  -- venta 29
(30,  4, NOW() - INTERVAL '1 day',   'completada'),  -- venta 30
( 1,  5, NOW() - INTERVAL '12 hours','completada'),  -- venta 31
( 2,  8, NOW() - INTERVAL '10 hours','completada'),  -- venta 32
( 3, 10, NOW() - INTERVAL '8 hours', 'completada'),  -- venta 33
( 4, 13, NOW() - INTERVAL '5 hours', 'anulada'),     -- venta 34 (anulada para poder ver)
( 5,  3, NOW() - INTERVAL '2 hours', 'completada');  -- venta 35

-- Detalle de ventas (el trigger descuenta stock automáticamente)
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1,  1, 1, 1350.00, 1350.00),
(1,  2, 2,  320.00,  640.00),
(2,  6, 3,   75.00,  225.00),
(2,  7, 1,  199.00,  199.00),
(3, 11, 2,   95.00,  190.00),
(3, 12, 1,  120.00,  120.00),
(3, 14, 3,   42.00,  126.00),
(4, 16, 1,  180.00,  180.00),
(4, 18, 2,   55.00,  110.00),
(5, 21, 1,  180.00,  180.00),
(5, 22, 1,  160.00,  160.00),
(5, 24, 2,   65.00,  130.00),
(6,  1, 1, 1350.00, 1350.00),
(6,  4, 2,  110.00,  220.00),
(7, 26, 1,  380.00,  380.00),
(7, 29, 2,   55.00,  110.00),
(8, 31, 2,  150.00,  300.00),
(8, 32, 1,  120.00,  120.00),
(9,  3, 1, 1100.00, 1100.00),
(9,  5, 1,  420.00,  420.00),
(10, 34, 1,  140.00,  140.00),
(10, 35, 1,  175.00,  175.00),
(11,  8, 2,  120.00,  240.00),
(11, 10, 1,  195.00,  195.00),
(12, 11, 3,   95.00,  285.00),
(12, 13, 2,   80.00,  160.00),
(13, 38, 1,  720.00,  720.00),
(13, 39, 1,  210.00,  210.00),
(14,  9, 1,  550.00,  550.00),
(14,  6, 3,   75.00,  225.00),
(15, 23, 2,  260.00,  520.00),
(15, 25, 1,   80.00,   80.00),
(16, 17, 1,  220.00,  220.00),
(16, 19, 2,  165.00,  330.00),
(17,  2, 1,  320.00,  320.00),
(17,  4, 3,  110.00,  330.00),
(18, 28, 2,  195.00,  390.00),
(18, 30, 1,   90.00,   90.00),
(19, 36, 5,   50.00,  250.00),
(19, 37, 3,   22.00,   66.00),
(20,  1, 1, 1350.00, 1350.00),
(20,  5, 1,  420.00,  420.00),
(21, 33, 1,  195.00,  195.00),
(21, 31, 1,  150.00,  150.00),
(22, 27, 1,  210.00,  210.00),
(22, 29, 3,   55.00,  165.00),
(23, 11, 2,   95.00,  190.00),
(23, 15, 1,  175.00,  175.00),
(24,  7, 2,  199.00,  398.00),
(24,  8, 2,  120.00,  240.00),
(25, 21, 2,  180.00,  360.00),
(25, 22, 1,  160.00,  160.00),
(26, 16, 1,  180.00,  180.00),
(26, 20, 3,   65.00,  195.00),
(27,  3, 1, 1100.00, 1100.00),
(27,  4, 2,  110.00,  220.00),
(28, 26, 1,  380.00,  380.00),
(28, 30, 1,   90.00,   90.00),
(29, 12, 2,  120.00,  240.00),
(29, 13, 1,   80.00,   80.00),
(30,  9, 1,  550.00,  550.00),
(30,  2, 1,  320.00,  320.00),
(31,  6, 2,   75.00,  150.00),
(31, 14, 4,   42.00,  168.00),
(32, 38, 1,  720.00,  720.00),
(32, 40, 1,   95.00,   95.00),
(33, 24, 3,   65.00,  195.00),
(33, 25, 2,   80.00,  160.00),
(34,  1, 1, 1350.00, 1350.00), -- venta anulada (el trigger restaura el stock)
(35, 35, 1,  175.00,  175.00),
(35, 32, 2,  120.00,  240.00);


-- 8. RECALCULAR TOTALES DE VENTAS
-- Subtotal = suma de líneas, Impuesto = 12% IVA Guatemala, Total = subtotal + impuesto

UPDATE ventas v
SET subtotal = agg.suma,
    impuesto = ROUND(agg.suma * 0.12, 2),
    total    = ROUND(agg.suma * 1.12, 2)
FROM (
    SELECT venta_id, SUM(subtotal) AS suma
    FROM detalle_ventas
    GROUP BY venta_id
) agg
WHERE v.id = agg.venta_id;


