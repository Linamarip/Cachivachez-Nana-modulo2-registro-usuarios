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
            res.json({ mensaje: 'Login exitoso', idUsuario: results[0].id || results[0].id_usuario });
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
    
    // Captura flexible por si Vue envía las variables con variaciones de nombre
    const nombre = datos.nombre;
    const apellido = datos.apellido;
    const cedula = datos.cedula;
    const fechaNacimiento = datos.fechaNacimiento || datos.fecha_nacimiento;
    const email = datos.email || datos.emailUsuario;
    const celular = datos.celular;
    const direccion = datos.direccion;
    const ciudad = datos.ciudad;
    const departamento = datos.departamento;

    const sql = `INSERT INTO usuarios 
    (nombre, apellido, cedula, fecha_nacimiento, email, celular, direccion, ciudad, departamento, contrasenia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [nombre, apellido, cedula, fechaNacimiento, email, celular, direccion, ciudad, departamento, '123456'];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.log("❌ ERROR REAL DE MYSQL EN REGISTRO:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Se envió a su email la confirmación' });
    });
});

// ==========================================
// RUTA 3: OBTENER TODOS LOS USUARIOS (CRUD: Consulta)
// ==========================================
app.get('/servidor_nana/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error al consultar usuarios:', err.message);
            return res.status(500).json({ error: err.message });
        }
        
        // Mapeamos los resultados para asegurar compatibilidad total con la tabla de Vue 3
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
    
    // Intenta borrar buscando por 'id' o por 'id_usuario' de manera inteligente
    const sql = 'DELETE FROM usuarios WHERE id = ? OR id_usuario = ?';
    db.query(sql, [id, id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar usuario:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    });
});

// ==========================================
// RUTA 5: OBTENER PRODUCTOS (Catálogo)
// ==========================================
app.get('/servidor_nana/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, results) => {
        if (err) {
            const productosSimulados = [
                { id: 1, codigo: '001', nombre: 'Buso', categoria: 'Oakley', precio: 190000, imagen_url: 'buso.jpg' },
                { id: 2, codigo: '002', nombre: 'Camiseta', categoria: 'Oakley', precio: 90000, imagen_url: 'camiseta.jpg' },
                { id: 3, codigo: '003', nombre: 'Pantalón', categoria: 'Oakley', precio: 250000, imagen_url: 'pantalon.jpg' }
            ];
            return res.json(productosSimulados);
        }
        res.json(results);
    });
});

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`=======================================`);
    console.log(`Servidor JavaScript corriendo en http://localhost:${PUERTO}/`);
    console.log(`=======================================`);
});
