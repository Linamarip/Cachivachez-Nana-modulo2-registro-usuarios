<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16">
    <!-- Título Principal -->
    <div class="max-w-6xl mx-auto mb-6 text-left">
      <h2 class="text-3xl font-black text-gray-800">Carrito de Compras</h2>
      <p class="text-sm text-gray-700 font-medium">Revisa tus artículos seleccionados y confirma la dirección de envío</p>
    </div>

    <!-- Contenedor Principal en Dos Columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: LISTA DE PRODUCTOS (Ocupa 2 columnas de ancho) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        
        <!-- Mensaje si el carrito está vacío -->
        <div v-if="items.length === 0" class="bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100 flex flex-col items-center gap-4">
          <span class="text-5xl">🛒</span>
          <h3 class="text-xl font-bold text-gray-800">Tu carrito de compras está vacío</h3>
          <p class="text-sm text-gray-500 max-w-sm">
            Aún no has agregado ninguna prenda. Visita nuestro catálogo multimarca y encuentra las mejores ofertas.
          </p>
          <button 
            type="button"
            @click="emit('regresarAlCatalogo')" 
            class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wide shadow-md transition-all active:scale-95 cursor-pointer mt-2"
          >
            Ir al Catálogo de Productos
          </button>
        </div>

        <!-- Tarjeta de Producto en el Carrito -->
        <div 
          v-for="item in items" 
          :key="item.id" 
          class="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between border border-gray-100 hover:shadow-2xl transition-all"
        >
          <!-- Imagen del Producto -->
          <div class="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100 shadow-inner shrink-0 overflow-hidden">
            <img 
              :src="obtenerRutaImagen(item)" 
              :alt="item.nombre" 
              @error="manejarErrorImagen"
              class="max-h-full max-w-full object-contain rounded-lg" 
            />
          </div>

          <!-- Detalles del Producto -->
          <div class="flex-grow px-4 text-left">
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
              {{ item.categoria || 'Oakley' }}
            </span>
            <h3 class="text-base sm:text-lg font-extrabold text-gray-800 mt-1 leading-snug">{{ item.nombre }}</h3>
            <p class="text-xs text-gray-400 font-mono">Cód: {{ item.codigo }}</p>
            <p class="text-lg font-black text-[#6b4e8b] mt-1">${{ Number(item.precio).toLocaleString('es-CO') }}</p>
          </div>

          <!-- Controles de Cantidad (+ / -) -->
          <div class="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 font-bold shrink-0">
            <button 
              type="button"
              @click="disminuirCantidad(item)" 
              class="text-gray-600 hover:text-black px-1.5 text-lg cursor-pointer transition-colors active:scale-90"
              title="Disminuir cantidad"
            >
              -
            </button>
            <span class="text-gray-800 text-sm px-1 min-w-[18px] text-center font-bold">{{ item.cantidad }}</span>
            <button 
              type="button"
              @click="item.cantidad++" 
              class="text-gray-600 hover:text-black px-1.5 text-lg cursor-pointer transition-colors active:scale-90"
              title="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <!-- Botón de Eliminar (Basura 🗑️) -->
          <button 
            type="button"
            @click="eliminarItem(item.id)" 
            class="text-red-500 hover:text-red-700 text-xl ml-3 p-2 cursor-pointer transition-transform active:scale-90"
            title="Eliminar del carrito"
          >
            🗑️
          </button>
        </div>

      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN Y RESUMEN DE TOTALES -->
      <div class="flex flex-col gap-6 text-left">
        
        <!-- Cuadro de Dirección Dinámico -->
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📍</span> Dirección de Envío
          </h3>
          
          <!-- Selector de Opciones (Radio Buttons) -->
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

          <!-- CONDICIÓN A: Datos reales extraídos de la sesión / base de datos -->
          <div v-if="tipoDireccion === 'registrada'" class="bg-[#8fa15b]/20 p-3.5 rounded-xl border border-[#8fa15b]/30 mb-4">
            <p class="font-bold text-gray-800 text-sm">👤 Destinatario: {{ correoActivo }}</p>
            <p class="text-xs text-gray-600 mt-1">🏠 Dirección Base: {{ direccionBase }}</p>
            <p class="text-xs text-gray-600 font-semibold">📍 {{ ciudadBase }} - {{ deptoBase }}</p>
          </div>

          <!-- CONDICIÓN B: Mini-formulario de dirección alternativa -->
          <div v-else class="bg-purple-50 p-3.5 rounded-xl border border-purple-200 flex flex-col gap-2 mb-4">
            <p class="text-xs text-purple-900 font-bold">✏️ Digite la dirección alternativa de entrega:</p>
            <input 
              type="text" 
              v-model="direccionNueva" 
              placeholder="Ej: Carrera 50 # 45-20, Apto 301" 
              class="border border-purple-300 p-2.5 rounded-lg text-xs w-full outline-purple-700 bg-white shadow-inner"
            >
          </div>

          <!-- Botón de retorno al catálogo -->
          <button 
            type="button"
            @click="emit('regresarAlCatalogo')" 
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition-all text-xs active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⬅️</span> Seguir Comprando / Catálogo
          </button>
        </div>

        <!-- Cuadro de Resumen de Totales -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-4">Resumen del Pedido</h3>
            
            <div class="flex justify-between py-2 border-b border-gray-100 text-sm font-medium text-gray-600">
              <span>Subtotal prendas ({{ items.reduce((sum, i) => sum + i.cantidad, 0) }}):</span>
              <span class="font-bold text-gray-800">${{ calcularSubtotal().toLocaleString('es-CO') }}</span>
            </div>

            <div class="flex justify-between py-2 border-b border-gray-100 text-sm font-medium text-gray-600">
              <span>Costo de Envío:</span>
              <span class="font-bold text-gray-800">
                {{ items.length > 0 ? '$' + (15000).toLocaleString('es-CO') : '$0' }}
              </span>
            </div>

            <div class="flex justify-between py-4 text-lg font-black text-gray-800">
              <span>Total a Pagar:</span>
              <span class="text-2xl text-[#6b4e8b] font-black">${{ calcularTotal().toLocaleString('es-CO') }}</span>
            </div>
          </div>

          <!-- Botón de Continuar al Pago (CORREGIDO DE class="...") -->
          <button 
            type="button"
            @click="procesarDespachoYAvance" 
            :disabled="items.length === 0" 
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm uppercase tracking-wide cursor-pointer mt-4 flex items-center justify-center gap-2"
          >
            <span>💳</span> Continuar al Pago
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  onIrAPagar: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['regresarAlCatalogo']);

// Variables reactivas de dirección
const tipoDireccion = ref('registrada');
const direccionNueva = ref('');

// Extracción reactiva de datos del usuario activo en localStorage
const correoActivo = computed(() => localStorage.getItem('usuarioNombre') || localStorage.getItem('usuarioEmail') || 'Cliente Activo');
const direccionBase = computed(() => localStorage.getItem('usuarioDireccion') || 'No Registrada');
const ciudadBase = computed(() => localStorage.getItem('usuarioCiudad') || '');
const deptoBase = computed(() => localStorage.getItem('usuarioDepartamento') || '');

// Avanzar a la pantalla de pagos
const procesarDespachoYAvance = () => {
  const direccionFinal = tipoDireccion.value === 'registrada' 
    ? (direccionBase.value !== 'No Registrada' ? `${direccionBase.value}, ${ciudadBase.value} - ${deptoBase.value}` : 'Dirección por confirmar')
    : (direccionNueva.value || 'Dirección por confirmar');
  
  localStorage.setItem('direccionPedidoActual', direccionFinal);
  
  if (props.onIrAPagar) {
    props.onIrAPagar();
  }
};

// Mapeo seguro de imágenes compatible con Vite
const obtenerRutaImagen = (item) => {
  if (item && item.imagen_url) {
    try {
      return new URL(`/src/assets/${item.imagen_url}`, import.meta.url).href;
    } catch (e) {
      // Fallback
    }
  }
  return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
};

// Fallback si la imagen falla
const manejarErrorImagen = (evento) => {
  evento.target.src = new URL('/src/assets/camiseta.jpg', import.meta.url).href;
};

// Cálculos matemáticos
const calcularSubtotal = () => {
  return props.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
};

const calcularTotal = () => {
  if (props.items.length === 0) return 0;
  return calcularSubtotal() + 15000;
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
