package com.nana.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {
    // Constantes en mayúsculas según estándares
    private static final String URL = "jdbc:mysql://localhost:3306/cachivachez_nana_db";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // En XAMPP viene vacío por defecto

    // Método en minúscula camelCase
    public static Connection getConexion() {
        Connection conexion = null;
        try {
            // Cargar el driver del conector que pusimos en lib
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexion = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Conexión exitosa a MySQL de XAMPP");
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Error de conexión: " + e.getMessage());
        }
        return conexion;
    }
}
