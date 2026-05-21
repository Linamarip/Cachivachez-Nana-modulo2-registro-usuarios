package com.nana.dao;

import com.nana.config.ConexionBD;
import com.nana.model.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioDAO {

    // =======================================================
    // 1. MÉTODO DEL LOGIN
    // =======================================================
    public Usuario validarIngreso(String email, String contrasenia) {
        String sql = "SELECT * FROM usuarios WHERE email = ? AND contrasenia = ?";
        
        try (Connection con = ConexionBD.getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            
            ps.setString(1, email);
            ps.setString(2, contrasenia);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario usuario = new Usuario();
                    usuario.setIdUsuario(rs.getInt("id"));
                    usuario.setEmailUsuario(rs.getString("email"));
                    return usuario;
                }
            }
        } catch (SQLException e) {
            System.out.println("Error en la consulta JDBC (Login): " + e.getMessage());
        }
        return null;
    }

    // =======================================================
    // 2. MÉTODO DEL REGISTRO (Corregido con la columna contrasenia)
    // =======================================================
    public boolean registrarUsuario(Usuario usuario) {
        // Añadimos 'contrasenia' al final de las columnas y un signo de interrogación más (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        String sql = "INSERT INTO usuarios (nombre, apellido, cedula, fecha_nacimiento, email, celular, direccion, ciudad, departamento, contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection con = ConexionBD.getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            
            // Mapeo ordenado de los 10 campos hacia la base de datos
            ps.setString(1, usuario.getNombre());
            ps.setString(2, usuario.getApellido());
            ps.setString(3, usuario.getCedula());
            ps.setString(4, usuario.getFechaNacimiento());
            ps.setString(5, usuario.getEmail());
            ps.setString(6, usuario.getCelular());
            ps.setString(7, usuario.getDireccion());
            ps.setString(8, usuario.getCiudad());
            ps.setString(9, usuario.getDepartamento());
            ps.setString(10, "123456"); // Le mandamos una contraseña por defecto para la prueba
            
            int filasAfectadas = ps.executeUpdate();
            return filasAfectadas > 0; 
            
        } catch (SQLException e) {
            System.out.println("Error en la consulta JDBC (Registro): " + e.getMessage());
            return false;
        }
    }
}
