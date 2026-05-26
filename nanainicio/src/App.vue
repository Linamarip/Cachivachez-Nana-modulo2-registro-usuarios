<script setup>
import nana_registro from './components/nana_registro.vue'
import nana_productos from './components/nana_productos.vue' 
import nana_carrito from './components/nana_carrito.vue'
import nana_pagos from './components/nana_pagos.vue'
import nana_seguimiento from './components/nana_seguimiento.vue'
import nana_calificaciones from './components/nana_calificaciones.vue'


import { ref } from 'vue'

// Variables reactivas para capturar los datos del formulario
const pantallaActual = ref('inicio')
const email = ref('')
const contrasenia = ref('')
const mensajeError = ref('')

// Arreglo global para almacenar los productos seleccionados
const carrito = ref([])

// Función para agregar un producto al carrito o aumentar su cantidad
const agregarAlCarrito = (producto) => {
  const existe = carrito.value.find(item => item.id === producto.id)
  if (existe) {
    existe.cantidad++
  } else {
    // Agregamos el producto con cantidad inicial de 1
    carrito.value.push({ ...producto, cantidad: 1 })
  }
  alert(`¡${producto.nombre} agregado al carrito!`)
}

// Función para enviar los datos al servidor JavaScript
const manejarInicioSesion = async () => {
  mensajeError.value = ''

  if (!email.value || !contrasenia.value) {
    mensajeError.value = 'Por favor, complete todos los campos.'
    return
  }

  try {
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
      alert('¡Bienvenido a Cachivachez NANA!')
      pantallaActual.value = 'productos' 
    } else {
      mensajeError.value = 'Credenciales inválidas. El usuario debe realizar el Registro.'
    }
  } catch (error) {
    mensajeError.value = 'Error al conectar con el servidor backend.'
  }
}

const finalizarPedido = (metodoPago) => {
  alert(`Cachivaches NANA: Su pedido ha sido registrado con método: ${metodoPago}.`);
  carrito.value = []; // Limpiamos el carrito
  pantallaActual.value = 'seguimiento'; // <-- CAMBIA ESTA LÍNEA (Ahora va a seguimiento)
}


const obtenerTotalCarrito = () => {
  if (carrito.value.length === 0) return 0;
  const subtotal = carrito.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  return subtotal + 15000; // Suma los $15.000 de envío de tus prototipos
}

</script>

<template>
  <div class="min-h-screen bg-[#c8d695] font-sans text-gray-800">
    <!-- 1. BARRA DE NAVEGACIÓN -->
    <nav class="flex items-center justify-between px-8 py-4 bg-white/30 backdrop-blur-sm">
      <div class="flex gap-8 items-center">
        <!-- Evento click para regresar al Inicio de Sesión -->
        <a href="#" @click.prevent="pantallaActual = 'inicio'" class="flex items-center gap-1 font-bold hover:text-green-800">
          <span class="text-xl">🏠</span> Inicio
        </a>
        
        <!-- Pestaña de Productos Vinculada sin duplicaciones -->
        <div @click="pantallaActual = 'productos'" class="group relative cursor-pointer font-semibold hover:text-green-800 transition-colors">
          Productos <span>∨</span>
        </div>
        
        <div class="group relative cursor-pointer font-semibold">
          Acerca de nosotros <span>∨</span>
        </div>

        <div @click="pantallaActual = 'calificaciones'" class="group relative cursor-pointer font-semibold hover:text-green-800 transition-colors">
          Opiniones <span>∨</span>
        </div>

      </div>
      
      <!-- Buscador y Botón del Carrito 🛒 -->
      <div class="flex items-center gap-6">
        <div class="relative">
          <input type="text" placeholder="Buscador" class="rounded-full px-4 py-1 border-none focus:ring-2 focus:ring-green-600 outline-none w-64 shadow-sm" />
          <span class="absolute right-3 top-1">🔍</span>
        </div>

        <!-- 🛒 ICONO DEL CARRITO CON CONTADOR DE PRODUCTOS -->
        <button @click="pantallaActual = 'carrito'" class="relative font-bold text-2xl hover:text-purple-800 transition-all active:scale-95">
          🛒
          <!-- Burbuja morada con la cantidad de artículos -->
          <span class="absolute -top-2 -right-2 bg-[#6b4e8b] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
            {{ carrito.reduce((sum, item) => sum + item.cantidad, 0) }}
          </span>
        </button>
      </div>
    </nav>

    <!-- 2. SECCIÓN CENTRAL (LOGO Y LEMA) -->
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

    <!-- 3. CONTENIDO DINÁMICO -->
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <!-- VISTA A: INICIO DE SESIÓN -->
      <div v-if="pantallaActual === 'inicio'">
        <h2 class="text-3xl font-bold mb-6">Inicio de Sesión</h2>
        
        <div v-if="mensajeError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
          {{ mensajeError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div class="flex flex-col gap-2">
            <label class="font-semibold">Iniciar sesión con su email</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="email@email.com" 
              class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner" 
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-semibold">Ingrese su contraseña</label>
            <input 
              v-model="contrasenia"
              type="password" 
              placeholder="contraseña alfanumérica" 
              class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner" 
            />
          </div>

          <div class="flex flex-col gap-2">
            <button 
              @click="manejarInicioSesion"
              class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Inicio de sesión
            </button>
            <p class="text-sm text-center font-medium">
              El usuario debe realizar el 
              <span @click="pantallaActual = 'registro'" class="font-bold underline cursor-pointer hover:text-purple-900">
                Registro
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- VISTA B: MÓDULO DE REGISTRO -->
      <div v-else-if="pantallaActual === 'registro'">
        <nana_registro />
      </div>

      <!-- VISTA C: MÓDULO DE PRODUCTOS -->
      <div v-else-if="pantallaActual === 'productos'">
        <nana_productos :onAgregar="agregarAlCarrito" />
      </div>

      <!-- VISTA D: MÓDULO DE CARRITO DE COMPRAS -->
      <div v-else-if="pantallaActual === 'carrito'">
        <!-- Le inyectamos la orden al carrito para que cambie la variable a 'pagos' -->
        <nana_carrito 
          :items="carrito" 
          :onIrAPagar="() => pantallaActual = 'pagos'" 
        />
      </div>

            <!-- VISTA E: MÓDULO DE PAGOS -->
      <div v-else-if="pantallaActual === 'pagos'">
        <nana_pagos :totalPedido="obtenerTotalCarrito()" :onConfirmarPedido="finalizarPedido" />
      </div>

      <!-- VISTA F: MÓDULO DE SEGUIMIENTO (NUEVA CONDICIÓN) -->
      <div v-else-if="pantallaActual === 'seguimiento'">
        <nana_seguimiento />
      </div>

      <!-- VISTA G: MÓDULO DE CALIFICACIONES (AQUÍ PONES LA NUEVA CONDICIÓN) -->
      <div v-else-if="pantallaActual === 'calificaciones'">
        <nana_calificaciones />
      </div>
      
    </main>

    <!-- 4. FOOTER -->
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
