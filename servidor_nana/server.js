const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuraciones de seguridad y lectura de datos
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Conexión a tu base de datos de XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'cachivachez_nana_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conexión exitosa a MySQL de XAMPP desde JavaScript!');
});

// ==========================================
// RUTA 1: LOGIN (Inicio de Sesión)
// ==========================================
app.post('/servidor_nana/login', (req, res) => {
    const { emailUsuario, contraseniaUsuario } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND contrasenia = ?';
    db.query(sql, [emailUsuario, contraseniaUsuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            const user = results[0];
            res.json({ 
                mensaje: 'Login exitoso', 
                idUsuario: user.id || user.id_usuario,
                usuario: {
                    id: user.id || user.id_usuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    cedula: user.cedula,
                    email: user.email,
                    celular: user.celular,
                    direccion: user.direccion,
                    ciudad: user.ciudad,
                    departamento: user.departamento
                }
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    });
});

// ==========================================
// RUTA 2: REGISTRO DE USUARIOS (CRUD: Inserción)
// ==========================================
app.post('/servidor_nana/registro', (req, res) => {
    const datos = req.body;
    
    const nombre = datos.nombre;
    const apellido = datos.apellido;
    const cedula = datos.cedula;
    const fechaNacimiento = datos.fechaNacimiento || datos.fecha_nacimiento;
    const email = datos.email || datos.emailUsuario;
    const celular = datos.celular;
    const direccion = datos.direccion;
    const ciudad = datos.ciudad;
    const departamento = datos.departamento;
    const contrasenia = datos.contrasenia || datos.contrasena || datos.password || '123456';

    const sql = `INSERT INTO usuarios 
    (nombre, apellido, cedula, fecha_nacimiento, email, celular, direccion, ciudad, departamento, contrasenia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [nombre, apellido, cedula, fechaNacimiento, email, celular, direccion, ciudad, departamento, contrasenia];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.log("❌ ERROR REAL DE MYSQL EN REGISTRO:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            mensaje: 'Se envió a su email la confirmación',
            usuario: {
                id: result.insertId,
                nombre,
                apellido,
                cedula,
                email,
                celular,
                direccion,
                ciudad,
                departamento
            }
        });
    });
});

// ==========================================
// RUTA 3: OBTENER TODOS LOS USUARIOS (CRUD: Consulta)
// ==========================================
app.get('/servidor_nana/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error al consultar usuarios:', err.message);
            return res.status(500).json({ error: err.message });
        }
        
        const usuariosFormateados = results.map(user => ({
            id: user.id || user.id_usuario, 
            nombre: user.nombre,
            apellido: user.apellido,
            cedula: user.cedula,
            email: user.email || user.email_usuario,
            celular: user.celular,
            ciudad: user.ciudad
        }));
        
        res.json(usuariosFormateados);
    });
});

// ==========================================
// RUTA 4: ELIMINAR UN USUARIO POR ID (CRUD: Eliminación)
// ==========================================
app.delete('/servidor_nana/usuarios/:id', (req, res) => {
    const { id } = req.params;
    
    // Eliminación limpia usando exclusivamente el id de la tabla usuarios
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar usuario:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Usuario #${id} eliminado con éxito de MySQL`);
        res.json({ mensaje: 'Usuario eliminado exitosamente de la base de datos' });
    });
});

// ==========================================
// RUTA 5: OBTENER PRODUCTOS (Catálogo)
// ==========================================
app.get('/servidor_nana/productos', (req, res) => {
    const sql = 'SELECT * FROM productos ORDER BY id ASC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error consultando productos:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// --- RUTA: AGREGAR O ACTUALIZAR PRODUCTO (ADMIN: UPSERT SEGURO CON TALLAS Y COLORES) ---
app.post('/servidor_nana/productos', (req, res) => {
    const { codigo, nombre, categoria, precio, imagen_url, tallas, colores } = req.body;
    
    const tallasFinal = tallas && String(tallas).trim() ? String(tallas).trim() : 'S, M, L, XL';
    const coloresFinal = colores && String(colores).trim() ? String(colores).trim() : 'Negro, Blanco, Gris';
    
    const sql = `
        INSERT INTO productos (codigo, nombre, categoria, precio, imagen_url, tallas, colores) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            nombre = VALUES(nombre), 
            categoria = VALUES(categoria), 
            precio = VALUES(precio), 
            imagen_url = VALUES(imagen_url),
            tallas = VALUES(tallas),
            colores = VALUES(colores)
    `;

    db.query(sql, [codigo, nombre, categoria, precio, imagen_url || 'camiseta.jpg', tallasFinal, coloresFinal], (err, result) => {
        if (err) {
            console.error('❌ Error registrando/actualizando producto:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Producto procesado en MySQL: ${codigo} - ${nombre} (Tallas: ${tallasFinal}, Colores: ${coloresFinal})`);
        res.json({ 
            mensaje: 'Prenda registrada y actualizada exitosamente en el catálogo de MySQL', 
            id: result.insertId || 'actualizado',
            codigo: codigo
        });
    });
});

// --- RUTA: ACTUALIZAR / EDITAR PRODUCTO O CAMBIAR IMAGEN/TALLAS/COLORES (ADMIN) ---
app.put('/servidor_nana/productos/:id', (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, categoria, precio, imagen_url, tallas, colores } = req.body;
    
    const tallasFinal = tallas && String(tallas).trim() ? String(tallas).trim() : 'S, M, L, XL';
    const coloresFinal = colores && String(colores).trim() ? String(colores).trim() : 'Negro, Blanco, Gris';

    const sql = 'UPDATE productos SET codigo = ?, nombre = ?, categoria = ?, precio = ?, imagen_url = ?, tallas = ?, colores = ? WHERE id = ?';
    db.query(sql, [codigo, nombre, categoria, precio, imagen_url || 'camiseta.jpg', tallasFinal, coloresFinal, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto actualizado con éxito en la base de datos' });
    });
});

// --- RUTA: ELIMINAR PRODUCTO (ADMIN) ---
app.delete('/servidor_nana/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    });
});

// ====================================================================
// 🚚 MÓDULO DE PEDIDOS Y SEGUIMIENTO EN TIEMPO REAL
// ====================================================================

// --- RUTA 6: CREAR PEDIDO CON NÚMERO SECUENCIAL #YYYY-MM-XXXXX ---
app.post('/servidor_nana/pedidos', (req, res) => {
    const { usuario_email, usuario_nombre, direccion_envio, ciudad, departamento, metodo_pago, total, items } = req.body;
    
    const now = new Date();
    const anio = now.getFullYear();
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    
    // Contar pedidos existentes en el año y mes para generar el consecutivo de 5 dígitos
    const sqlCount = 'SELECT COUNT(*) AS total FROM pedidos WHERE YEAR(fecha_creacion) = ? AND MONTH(fecha_creacion) = ?';
    
    db.query(sqlCount, [anio, now.getMonth() + 1], (errCount, countResults) => {
        const totalMes = (countResults && countResults[0] ? countResults[0].total : 0) + 1;
        const consecutivo = String(totalMes).padStart(5, '0');
        const numeroPedido = `#${anio}-${mes}-${consecutivo}`;
        
        // Número de guía aleatorio pero realista de la transportadora
        const guiaAleatoria = 'CO-' + Math.floor(100000000 + Math.random() * 900000000);
        const transportadora = 'Coordinadora Mercantil';
        const itemsJson = typeof items === 'string' ? items : JSON.stringify(items || []);

        const sqlInsert = `
            INSERT INTO pedidos 
            (numero_pedido, usuario_email, usuario_nombre, direccion_envio, ciudad, departamento, metodo_pago, total, estado, guia_despacho, transportadora, items) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            numeroPedido, 
            usuario_email, 
            usuario_nombre || 'Cliente', 
            direccion_envio || 'Dirección no especificada', 
            ciudad || 'Bello', 
            departamento || 'Antioquia', 
            metodo_pago || 'Contraentrega', 
            total || 0, 
            'En camino', 
            guiaAleatoria, 
            transportadora, 
            itemsJson
        ];

        db.query(sqlInsert, valores, (errInsert, result) => {
            if (errInsert) {
                console.error('❌ Error creando pedido:', errInsert.message);
                return res.status(500).json({ error: errInsert.message });
            }

            console.log(`✅ Pedido ${numeroPedido} registrado con éxito para ${usuario_email}`);
            res.json({
                mensaje: 'Pedido generado exitosamente',
                id: result.insertId,
                numero_pedido: numeroPedido,
                guia_despacho: guiaAleatoria,
                transportadora: transportadora,
                estado: 'En camino'
            });
        });
    });
});

// --- RUTA 7: OBTENER TODOS LOS PEDIDOS (ADMIN) ---
app.get('/servidor_nana/pedidos', (req, res) => {
    const sql = 'SELECT * FROM pedidos ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- RUTA 8: OBTENER PEDIDOS POR EMAIL DE USUARIO (CLIENTE) ---
app.get('/servidor_nana/pedidos/usuario/:email', (req, res) => {
    const { email } = req.params;
    const sql = 'SELECT * FROM pedidos WHERE usuario_email = ? ORDER BY id DESC';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- RUTA 9: ACTUALIZAR ESTADO DEL PEDIDO (ENTREGADO / EN CAMINO) ---
app.put('/servidor_nana/pedidos/estado', (req, res) => {
    const { numero_pedido, id, estado } = req.body;
    const sql = 'UPDATE pedidos SET estado = ? WHERE numero_pedido = ? OR id = ?';
    db.query(sql, [estado || 'Entregado', numero_pedido, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `Estado del pedido ${numero_pedido || id} actualizado a: ${estado}` });
    });
});

// ====================================================================
// 📲 NUEVAS RUTAS: MÓDULO DE CALIFICACIONES Y OPINIONES
// ====================================================================

// --- RUTA 10: AGREGAR CALIFICACIÓN (Inserción CRUD) ---
app.post('/servidor_nana/calificaciones', (req, res) => {
    const { nombre, comentario, estrellas } = req.body;
    const sql = 'INSERT INTO calificaciones (nombre_usuario, comentario, estrellas) VALUES (?, ?, ?)';
    db.query(sql, [nombre, comentario, estrellas], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: '¡Gracias por tu opinión!' });
    });
});

// --- RUTA 11: OBTENER CALIFICACIONES (Consulta CRUD) ---
app.get('/servidor_nana/calificaciones', (req, res) => {
    const sql = 'SELECT * FROM calificaciones ORDER BY creado_en DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ====================================================================
// CONFIGURACIÓN DE ENCENDIDO
// ====================================================================

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`=======================================`);
    console.log(`Servidor JavaScript corriendo en http://localhost:${PUERTO}/`);
    console.log(`=======================================`);
});
