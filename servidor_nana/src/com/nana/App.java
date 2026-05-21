package com.nana;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.nana.dao.UsuarioDAO;
import com.nana.model.Usuario;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class App {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // ==========================================
        // 1. RUTA DEL LOGIN
        // ==========================================
        server.createContext("/servidor_nana/login", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                // Usamos SET en lugar de ADD para asegurar que se sobreescriban los permisos
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

                // CORRECCIÓN CRUCIAL: Cerrar el intercambio en OPTIONS para liberar la respuesta
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    exchange.close(); 
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    byte[] requestBody = exchange.getRequestBody().readAllBytes();
                    String json = new String(requestBody);

                    String email = extraerJson(json, "emailUsuario");
                    String contrasenia = extraerJson(json, "contraseniaUsuario");

                    UsuarioDAO usuarioDAO = new UsuarioDAO();
                    Usuario usuarioValido = usuarioDAO.validarIngreso(email, contrasenia);

                    String respuestaJson;
                    int codigoEstado;

                    if (usuarioValido != null) {
                        respuestaJson = "{\"mensaje\": \"Login exitoso\", \"id\": " + usuarioValido.getIdUsuario() + "}";
                        codigoEstado = 200;
                    } else {
                        respuestaJson = "{\"mensaje\": \"Credenciales incorrectas\"}";
                        codigoEstado = 401;
                    }

                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(codigoEstado, respuestaJson.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuestaJson.getBytes());
                    os.close();
                }
            }
        });

        // ==========================================
        // 2. RUTA DEL REGISTRO
        // ==========================================
        server.createContext("/servidor_nana/registro", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

                // CORRECCIÓN CRUCIAL: Cerrar el intercambio en OPTIONS para liberar la respuesta
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    exchange.close(); 
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    byte[] requestBody = exchange.getRequestBody().readAllBytes();
                    String json = new String(requestBody);
                    String nombre = extraerJson(json, "nombre");
                    String apellido = extraerJson(json, "apellido");
                    String cedula = extraerJson(json, "cedula");
                    String fechaNacimiento = extraerJson(json, "fechaNacimiento");
                    if(fechaNacimiento.equals("")) {
                        fechaNacimiento = extraerJson(json, "fecha_nacimiento"); // Por si Vue la manda con guion bajo
                    }
                    String email = extraerJson(json, "email");
                    String celular = extraerJson(json, "celular");
                    String direccion = extraerJson(json, "direccion");
                    String ciudad = extraerJson(json, "ciudad");
                    String departamento = extraerJson(json, "departamento");

                    Usuario nuevoUsuario = new Usuario(nombre, apellido, cedula, fechaNacimiento, email, celular, direccion, ciudad, departamento);
                    UsuarioDAO usuarioDAO = new UsuarioDAO();
                    boolean exito = usuarioDAO.registrarUsuario(nuevoUsuario);

                    String respuestaJson;
                    int codigoEstado;

                    if (exito) {
                        respuestaJson = "{\"mensaje\": \"Se envió a su email la confirmación\"}";
                        codigoEstado = 200;
                    } else {
                        respuestaJson = "{\"error\": \"Error al guardar en la base de datos\"}";
                        codigoEstado = 500;
                    }

                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(codigoEstado, respuestaJson.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuestaJson.getBytes());
                    os.close();
                }
            }
        });

        server.setExecutor(null);
        System.out.println("Servidor de Cachivachez NANA corriendo en http://localhost:8080/");
        server.start();
    }

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
