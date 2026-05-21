package com.nana.controller;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.nana.dao.UsuarioDAO;
import com.nana.model.Usuario;
import java.io.IOException;
import java.io.OutputStream;

public class UsuarioController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // 1. CONFIGURACIÓN DE SEGURIDAD CORS (Igual que en tu login)
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // 2. PROCESAR LA PETICIÓN POST DE REGISTRO
        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            byte[] requestBody = exchange.getRequestBody().readAllBytes();
            String json = new String(requestBody);

            // Extraer de manera nativa cada campo enviado por Vue
            String nombre = extraerJson(json, "nombre");
            String apellido = extraerJson(json, "apellido");
            String cedula = extraerJson(json, "cedula");
            String fechaNacimiento = extraerJson(json, "fechaNacimiento");
            String email = extraerJson(json, "email");
            String celular = extraerJson(json, "celular");
            String direccion = extraerJson(json, "direccion");
            String ciudad = extraerJson(json, "ciudad");
            String departamento = extraerJson(json, "departamento");

            // Crear el objeto Usuario con los datos capturados
            Usuario nuevoUsuario = new Usuario(nombre, apellido, cedula, fechaNacimiento, email, celular, direccion, ciudad, departamento);

            // Instanciar el DAO para insertar en la Base de Datos MySQL
            UsuarioDAO usuarioDAO = new UsuarioDAO();
            boolean exito = usuarioDAO.registrarUsuario(nuevoUsuario);

            String respuestaJson;
            int codigoEstado;

            if (exito) {
                respuestaJson = "{\"mensaje\": \"Se envió a su email la confirmación\"}";
                codigoEstado = 200; // Éxito
            } else {
                respuestaJson = "{\"error\": \"Error al guardar los datos en la base de datos\"}";
                codigoEstado = 500; // Error de Servidor
            }

            // Enviar la respuesta JSON final a la interfaz de Vue
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(codigoEstado, respuestaJson.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(respuestaJson.getBytes());
            os.close();
        }
    }

    // El mismo extractor manual de JSON que ya usas y te funciona
    private static String extraerJson(String json, String llave) {
        try {
            int inicio = json.indexOf("\"" + llave + "\"") + llave.length() + 4;
            int fin = json.indexOf("\"", inicio);
            return json.substring(inicio, fin);
        } catch (Exception e) {
            return "";
        }
    }
}
