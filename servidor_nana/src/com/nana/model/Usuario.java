package com.nana.model;

public class Usuario {
    // 1. Atributos privados encapsulados
    private int idUsuario;
    private String emailUsuario;
    private String contraseniaUsuario;
    
    private String nombre;
    private String apellido;
    private String cedula;
    private String fechaNacimiento;
    private String email;
    private String celular;
    private String direccion;
    private String ciudad;
    private String departamento;

    // 2. Constructor vacío (Requerido para el Login)
    public Usuario() {}

    // 3. Constructor Largo (Requerido por App.java y UsuarioController.java)
    public Usuario(String nombre, String apellido, String cedula, String fechaNacimiento, 
                   String email, String celular, String direccion, String ciudad, String departamento) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.fechaNacimiento = fechaNacimiento;
        this.email = email;
        this.celular = celular;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.departamento = departamento;
    }

    // 4. Métodos Getter y Setter (Los que le hacían falta a UsuarioDAO.java)
    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }

    public String getContraseniaUsuario() { return contraseniaUsuario; }
    public void setContraseniaUsuario(String contraseniaUsuario) { this.contraseniaUsuario = contraseniaUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public String getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCelular() { return celular; }
    public void setCellular(String celular) { this.celular = celular; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
}
