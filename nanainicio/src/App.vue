<script setup>
import nana_registro from './components/nana_registro.vue'

import { ref } from 'vue'

// Variables reactivas para capturar los datos del formulario
const pantallaActual = ref('inicio')
const email = ref('')
const contrasenia = ref('')
const mensajeError = ref('')

// Función para enviar los datos al servidor de Java
const manejarInicioSesion = async () => {
  // Limpiar mensajes previos
  mensajeError.value = ''

  if (!email.value || !contrasenia.value) {
    mensajeError.value = 'Por favor, complete todos los campos.'
    return
  }

  try {
    // Apunta al puerto de tu servidor_nana (por defecto suele ser 8080)
    const respuesta = await fetch('http://localhost:8080/servidor_nana/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailUsuario: email.value,
        contraseniaUsuario: contrasenia.value
      })
    })

    if (respuesta.ok) {
      const datos = await respuesta.json()
      alert('¡Bienvenido a Cachivachez NANA!')
      // Aquí manejarás la redirección al módulo de productos más adelante
    } else {
      mensajeError.value = 'Credenciales inválidas. El usuario debe realizar el Registro.'
    }
  } catch (error) {
    mensajeError.value = 'Error al conectar con el servidor backend.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#c8d695] font-sans text-gray-800">
    <!-- 1. BARRA DE NAVEGACIÓN (Permanente) -->
    <nav class="flex items-center justify-between px-8 py-4 bg-white/30 backdrop-blur-sm">
      <div class="flex gap-8 items-center">
        <!-- Evento click para regresar al Inicio de Sesión -->
        <a href="#" @click.prevent="pantallaActual = 'inicio'" class="flex items-center gap-1 font-bold hover:text-green-800">
          <span class="text-xl">🏠</span> Inicio
        </a>
        <div class="group relative cursor-pointer font-semibold">
          Productos <span>∨</span>
        </div>
        <div class="group relative cursor-pointer font-semibold">
          Acerca de nosotros <span>∨</span>
        </div>
      </div>
      
      <!-- Buscador -->
      <div class="relative">
        <input type="text" placeholder="Buscador" class="rounded-full px-4 py-1 border-none focus:ring-2 focus:ring-green-600 outline-none w-64 shadow-sm" />
        <span class="absolute right-3 top-1">🔍</span>
      </div>
    </nav>

    <!-- 2. SECCIÓN CENTRAL (LOGO REDONDEADO CON SOMBRA Y LEMA - Permanente) -->
    <header class="flex flex-col items-center justify-center py-12 text-center">
      <div class="max-w-md mx-auto mb-4 p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
        <img 
          src="./assets/logo_tienda.jpg" 
          alt="Cachivachez Nana Logo" 
          class="w-full h-auto object-contain rounded-xl" 
        />
      </div>
      <p class="text-2xl italic font-serif text-gray-700 mt-2">
        Lo que Sueñas a Precio Justo
      </p>
    </header>

    <!-- 3. CONTENIDO DINÁMICO (Intercambia entre Login y Registro) -->
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <!-- VISTA A: MÓDULO DE INICIO DE SESIÓN (Se muestra si pantallaActual es 'inicio') -->
      <div v-if="pantallaActual === 'inicio'">
        <h2 class="text-3xl font-bold mb-6">Inicio de Sesión</h2>
        
        <!-- Mensaje de Alerta/Error dinámico -->
        <div v-if="mensajeError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
          {{ mensajeError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <!-- Campo Email -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold">Iniciar sesión con su email</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="email@email.com" 
              class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner" 
            />
          </div>

          <!-- Campo Contraseña -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold">Ingrese su contraseña</label>
            <input 
              v-model="contrasenia"
              type="password" 
              placeholder="contraseña alfanumérica" 
              class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner" 
            />
          </div>

          <!-- Botón y Registro -->
          <div class="flex flex-col gap-2">
            <button 
              @click="manejarInicioSesion"
              class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Inicio de sesión
            </button>
            <!-- Evento click en la palabra Registro para saltar al nuevo componente -->
            <p class="text-sm text-center font-medium">
              El usuario debe realizar el 
              <span @click="pantallaActual = 'registro'" class="font-bold underline cursor-pointer hover:text-purple-900">
                Registro
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- VISTA B: MÓDULO DE REGISTRO (Se muestra si pantallaActual es 'registro') -->
      <div v-else-if="pantallaActual === 'registro'">
        <nana_registro />
      </div>

    </main>

    <!-- 4. FOOTER (Permanente) -->
    <footer class="mt-20 border-t border-black/10 py-6 px-10 flex flex-col md:flex-row justify-between items-center text-sm">
      <p>©2025 Cachivachez NANA. Todos los derechos reservados</p>
      <div class="flex flex-col gap-1 text-right">
        <p>📧 contacto@cachivacheznana.com</p>
        <p>📞 300 010203</p>
        <p>📍 Bello - Antioquia</p>
      </div>
    </footer>
  </div>
</template>
