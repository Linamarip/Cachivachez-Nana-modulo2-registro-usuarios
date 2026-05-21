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
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conexion exitosa a MySQL de XAMPP desde JavaScript!');
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
            res.json({ mensaje: 'Login exitoso', idUsuario: results[0].id });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    });
});

// ==========================================
// RUTA 2: REGISTRO DE USUARIOS
// ==========================================
app.post('/servidor_nana/registro', (req, res) => {
    const datos = req.body;
    const sql = `INSERT INTO usuarios 
    (nombre, apellido, cedula, fecha_nacimiento, email, celular, direccion, ciudad, departamento, contrasenia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const valores = [
        datos.nombre, datos.apellido, datos.cedula, datos.fechaNacimiento,
        datos.email, datos.celular, datos.direccion, datos.ciudad, datos.departamento, '123456'
    ];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Se envió a su email la confirmación' });
    });
});

// ==========================================
// RUTA 3: OBTENER PRODUCTOS (Módulo 3)
// ==========================================
app.get('/servidor_nana/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, results) => {
        if (err) {
            // Si la tabla aún no existe en MySQL, devolvemos datos de prueba simulados
            console.log('Enviando productos simulados del prototipo...');
            const productosSimulados = [
                { id: 1, codigo: '001', nombre: 'Buso', categoria: 'Oakley', precio: 190000, imagen_url: '' },
                { id: 2, codigo: '002', nombre: 'Camiseta', categoria: 'Oakley', precio: 90000, imagen_url: '' },
                { id: 3, codigo: '003', nombre: 'Pantalón', categoria: 'Oakley', precio: 250000, imagen_url: '' }
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
