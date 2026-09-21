const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuraciones de seguridad y lectura de datos
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Conexión mediante Pool a la base de datos de XAMPP (Auto-reconexión y estabilidad)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'cachivachez_nana_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0
});

// Verificación inicial de conexión con el Pool
db.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Error conectando a MySQL de XAMPP:', err.message);
        return;
    }
    console.log('=======================================');
    console.log('¡Conexión exitosa a MySQL (cachivachez_nana_db) con Pool!');
    console.log('=======================================');
    conn.release();
});

// ==========================================
// RUTA 1: LOGIN (Inicio de Sesión Real y Dinámico)
// ==========================================
app.post('/servidor_nana/login', (req, res) => {
    const { emailUsuario, contraseniaUsuario } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND contrasenia = ?';
    db.query(sql, [emailUsuario, contraseniaUsuario], (err, results) => {
        if (err) {
            console.error('❌ Error en login:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ 
                mensaje: 'Login exitoso', 
                usuario: {
                    id: results[0].id || results[0].id_usuario,
                    nombre: results[0].nombre,
                    apellido: results[0].apellido,
                    direccion: results[0].direccion,
                    ciudad: results[0].ciudad,
                    departamento: results[0].departamento
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
    
    const nombre = (datos.nombre || '').trim();
    const apellido = (datos.apellido || '').trim();
    const cedula = (datos.cedula || '').trim();
    const fechaNacimiento = datos.fechaNacimiento || datos.fecha_nacimiento || null;
    const email = (datos.email || datos.emailUsuario || '').trim();
    const celular = (datos.celular || '').trim();
    const direccion = (datos.direccion || '').trim();
    const ciudad = (datos.ciudad || '').trim();
    const departamento = (datos.departamento || '').trim();
    const claveFinal = datos.contraseniaUsuario || datos.contrasenia || datos.contrasena || datos.password || '';

    if (!nombre || !email || !claveFinal) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
    }

    const sql = `INSERT INTO usuarios 
    (nombre, apellido, cedula, fecha_nacimiento, email, celular, direccion, ciudad, departamento, contrasenia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [nombre, apellido, cedula, fechaNacimiento, email, celular, direccion, ciudad, departamento, claveFinal];
   
    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error("❌ ERROR DE MYSQL EN REGISTRO:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ 
                    error: 'El correo electrónico o la cédula ya se encuentra registrado en el sistema.' 
                });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Se envió a su email la confirmación', id: result.insertId });
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
            ciudad: user.ciudad,
            departamento: user.departamento,
            direccion: user.direccion
        }));
        
        res.json(usuariosFormateados);
    });
});

// ==========================================
// RUTA 4: ELIMINAR UN USUARIO POR ID (CRUD: Eliminación)
// ==========================================
app.delete('/servidor_nana/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar usuario:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente de la base de datos' });
    });
});

// ==========================================
// RUTA 5: OBTENER PRODUCTOS (Catálogo con Filtros)
// ==========================================
app.get('/servidor_nana/productos', (req, res) => {
    const { categoria, busqueda } = req.query;

    let sql = 'SELECT * FROM productos';
    const params = [];

    if (categoria && categoria.toLowerCase() !== 'todas' && categoria.toLowerCase() !== 'todos') {
        sql += ' WHERE LOWER(categoria) = LOWER(?)';
        params.push(categoria);
    }

    if (busqueda) {
        const prefix = params.length > 0 ? ' AND' : ' WHERE';
        sql += `${prefix} (LOWER(nombre) LIKE ? OR LOWER(categoria) LIKE ? OR codigo LIKE ?)`;
        params.push(`%${busqueda.toLowerCase()}%`, `%${busqueda.toLowerCase()}%`, `%${busqueda}%`);
    }

    sql += ' ORDER BY id ASC';

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error al consultar productos:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`[API /productos] Filtro: '${categoria || 'Todas'}' | Encontrados: ${results.length}`);
        res.json(results);
    });
});

// ==========================================
// RUTA 6: AGREGAR CALIFICACIÓN (CRUD: Inserción)
// ==========================================
app.post('/servidor_nana/calificaciones', (req, res) => {
    const { nombre, comentario, estrellas } = req.body;
    const sql = 'INSERT INTO calificaciones (nombre_usuario, comentario, estrellas) VALUES (?, ?, ?)';
    db.query(sql, [nombre, comentario, estrellas || 5], (err) => {
        if (err) {
            console.error('Error al insertar calificación:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: '¡Gracias por tu opinión!' });
    });
});

// ==========================================
// RUTA 7: OBTENER CALIFICACIONES (CRUD: Consulta)
// ==========================================
app.get('/servidor_nana/calificaciones', (req, res) => {
    const sql = 'SELECT * FROM calificaciones ORDER BY creado_en DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al consultar calificaciones:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ==========================================
// RUTA 8: AGREGAR NUEVO PRODUCTO (CRUD: Inserción)
// ==========================================
app.post('/servidor_nana/productos', (req, res) => {
    const { codigo, nombre, categoria, precio, imagen_url } = req.body;
    const sql = 'INSERT INTO productos (codigo, nombre, categoria, precio, imagen_url) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [codigo, nombre, categoria, precio, imagen_url], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: '¡Producto registrado exitosamente en el catálogo!', id: result.insertId });
    });
});

// ==========================================
// RUTA 9: ELIMINAR PRODUCTO (CRUD: Eliminación)
// ==========================================
app.delete('/servidor_nana/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Producto removido del catálogo correctamente' });
    });
});

// ==========================================
// ENCENDIDO DEL SERVIDOR
// ==========================================
const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`=======================================`);
    console.log(`Servidor Cachivachez NANA corriendo en http://localhost:${PUERTO}/`);
    console.log(`=======================================`);
});
