<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12">
    <!-- Título Principal -->
    <h2 class="text-3xl font-bold mb-8 text-gray-800 text-left">Carrito de Compras</h2>

    <!-- Contenedor Principal en Dos Columnas (Fiel a tu prototipo) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: LISTA DE PRODUCTOS (Ocupa 2 columnas de ancho) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        
        <!-- Mensaje si el carrito está vacío -->
        <div v-if="items.length === 0" class="bg-white rounded-3xl p-8 text-center shadow-md font-semibold text-gray-500">
          Tu carrito está vacío. ¡Ve al catálogo y agrega tus prendas favoritas!
        </div>

        <!-- Tarjeta de Producto en el Carrito -->
        <div v-for="item in items" :key="item.id" class="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between border border-gray-100">
          
          <!-- Imagen del Producto -->
          <div class="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100 shadow-inner">
            <img :src="obtenerRutaImagen(item.nombre)" :alt="item.nombre" class="max-h-full object-contain rounded-lg" />
          </div>

          <!-- Detalles del Producto -->
          <div class="flex-grow px-4">
            <h3 class="text-lg font-extrabold text-gray-800">{{ item.nombre }}</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">{{ item.categoria || 'Oakley' }}</p>
            <p class="text-xl font-black text-gray-700 mt-1">${{ Number(item.precio).toLocaleString('es-CO') }}</p>
          </div>

          <!-- Controles de Cantidad (+ / -) -->
          <div class="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 font-bold">
            <button @click="disminuirCantidad(item)" class="text-gray-600 hover:text-black px-1 text-lg cursor-pointer">-</button>
            <span class="text-gray-800 text-sm px-1">{{ item.cantidad }}</span>
            <button @click="item.cantidad++" class="text-gray-600 hover:text-black px-1 text-lg cursor-pointer">+</button>
          </div>

          <!-- Botón de Eliminar (Basura 🗑️) -->
          <button @click="eliminarItem(item.id)" class="text-red-500 hover:text-red-700 text-xl ml-4 p-2 cursor-pointer">
            🗑️
          </button>
        </div>
      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN Y RESUMEN DE TOTALES -->
      <div class="flex flex-col gap-6">
        
                <!-- 🔥 CORRECCIÓN CP-004 y CP-008: Cuadro de Dirección Dinámico con Botón de Retorno -->
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">📍 Dirección de Envío</h3>
          
          <!-- Selector Interactivo de Opciones (Radio Buttons) -->
          <div class="flex flex-col gap-2 text-sm mb-4 border-b border-gray-100 pb-3">
            <label class="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input type="radio" v-model="tipoDireccion" value="registrada" class="accent-[#8fa15b]">
              <span>Usar dirección registrada en mi cuenta</span>
            </label>
            
            <label class="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input type="radio" v-model="tipoDireccion" value="alternativa" class="accent-[#8fa15b]">
              <span>Enviar a una ubicación diferente</span>
            </label>
          </div>

          <!-- CONDICIÓN A: Muestra los datos 100% reales extraídos de tu base de datos -->
          <div v-if="tipoDireccion === 'registrada'" class="bg-[#8fa15b]/20 p-3 rounded-xl border border-[#8fa15b]/30 mb-4">
            <p class="font-bold text-gray-800">👤 Destinatario: {{ correoActivo }}</p>
            <p class="text-sm text-gray-600 mt-1">🏠 Dirección Base: {{ direccionBase }}</p>
            <!-- 🚀 Pinta dinámicamente la ciudad y departamento del usuario activo -->
            <p class="text-sm text-gray-600">📍 {{ ciudadBase }} - {{ deptoBase }}</p>
          </div>

          <!-- CONDICIÓN B: Abre una caja de texto limpia para ingresar un domicilio nuevo -->
          <div v-else class="bg-purple-50 p-3 rounded-xl border border-purple-200 flex flex-col gap-2 mb-4">
            <p class="text-xs text-purple-900 font-bold">✏ Mini-formulario: Digite la nueva dirección:</p>
            <input 
              type="text" 
              v-model="direccionNueva" 
              placeholder="Ej: Avenida Siempre Viva 742" 
              class="border border-purple-300 p-2 rounded-lg text-sm w-full outline-purple-700 bg-white"
            >
          </div>

          <!-- 🔥 CORRECCIÓN CP-008: Botón físico de regreso para no quedarse atrapado en el carrito -->
          <button 
            type="button"
            @click="emit('regresarAlCatalogo')" 
            class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl shadow transition-all text-sm mt-2 active:scale-95 cursor-pointer"
          >
            ⬅️ Seguir Comprando / Regresar al Catálogo
          </button>
        </div>


        <!-- Cuadro de Resumen de Totales (Cálculos automáticos) -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-4">Resumen del Pedido</h3>
            
            <div class="flex justify-between py-2 border-b border-gray-100 text-sm font-medium text-gray-600">
              <span>Subtotal:</span>
              <span class="font-bold text-gray-800">${{ calcularSubtotal().toLocaleString('es-CO') }}</span>
            </div>

            <div class="flex justify-between py-2 border-b border-gray-100 text-sm font-medium text-gray-600">
              <span>Costo de Envío:</span>
              <span class="font-bold text-gray-800">${{ items.length > 0 ? (15000).toLocaleString('es-CO') : '0' }}</span>
            </div>

            <div class="flex justify-between py-4 text-lg font-black text-gray-800">
              <span>Total:</span>
              <span class="text-2xl text-[#6b4e8b]">${{ calcularTotal().toLocaleString('es-CO') }}</span>
            </div>
          </div>

          <!-- Botón de Continuar a Pagos -->
           <!-- 🚀 BOTÓN CORREGIDO: Ahora procesa la dirección de forma dinámica antes de saltar a pagos -->
          <button @click="procesarDespachoYAvance" :disabled="items.length === 0" class="...">
            Continuar al Pago
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: Array,
  onIrAPagar: Function
})

// 🚀 NUEVA LÍNEA: Declaramos el emisor de eventos para comunicarnos de forma segura con App.vue
const emit = defineEmits(['regresarAlCatalogo'])

// Variables interactivas de opción
const tipoDireccion = ref('registrada') 
const direccionNueva = ref('')

// 🌟 EXTRACCIÓN 100% REAL DE LA BASE DE DATOS MÓVIL
const correoActivo = localStorage.getItem('usuarioNombre') || 'Cliente Activo'
const direccionBase = localStorage.getItem('usuarioDireccion') || 'No Registrada'
const ciudadBase = localStorage.getItem('usuarioCiudad') || ''
const deptoBase = localStorage.getItem('usuarioDepartamento') || ''

// Función para enviar la dirección seleccionada o la modificada a la pantalla de pago
const procesarDespachoYAvance = () => {
  // Si elige 'registrada' toma la de MySQL, si elige 'alternativa' toma lo que escribió en la caja limpia
  const direccionFinal = tipoDireccion.value === 'registrada' 
    ? `${direccionBase}, ${ciudadBase} - ${deptoBase}` 
    : direccionNueva.value;
  
  localStorage.setItem('direccionPedidoActual', direccionFinal || 'Dirección de Envío');
  
  if (props.onIrAPagar) {
    props.onIrAPagar();
  }
}

// Función para mapear las imágenes locales de assets (Mismos enlaces que tu catálogo)
// Reemplaza tu función obtenerRutaImagen vieja por esta versión exacta:
const obtenerRutaImagen = (nombreProducto) => {
  if (!nombreProducto) return 'https://placeholder.com';
  
  const nombreCambiado = nombreProducto.toLowerCase();
  
  // Usamos rutas directas compatibles con el empaquetador Vite
  if (nombreCambiado.includes('buso')) {
    return new URL('/src/assets/buso.jpg', import.meta.url).href;
  }
  if (nombreCambiado.includes('camise')) {
    return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  }
  if (nombreCambiado.includes('pantala') || nombreCambiado.includes('pantaló')) {
    return new URL('/src/assets/pantalon.jpg', import.meta.url).href;
  }
  
  return 'https://placeholder.com';
};

// Funciones matemáticas reactivas
const calcularSubtotal = () => {
  return props.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
};

const calcularTotal = () => {
  if (props.items.length === 0) return 0;
  return calcularSubtotal() + 15000; // Sumamos los $15.000 de envío de tu prototipo
};

const disminuirCantidad = (item) => {
  if (item.cantidad > 1) {
    item.cantidad--;
  }
};

const eliminarItem = (id) => {
  const index = props.items.findIndex(item => item.id === id);
  if (index !== -1) {
    props.items.splice(index, 1);
  }
};
</script>
