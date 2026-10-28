<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16">
    <!-- Título Principal -->
    <div class="max-w-6xl mx-auto mb-6 text-left">
      <h2 class="text-3xl font-black text-gray-800">Carrito de Compras</h2>
      <p class="text-sm text-gray-700 font-medium">Revisa tus prendas seleccionadas y verifica la dirección de entrega</p>
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
            Aún no has agregado ninguna prenda. Visita nuestro catálogo multimarca y encuentra lo que sueñas a precio justo.
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
          :key="item.id + (item.tallaSeleccionada || '') + (item.colorSeleccionado || '')" 
          class="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between border border-gray-100 hover:shadow-2xl transition-all"
        >
          <!-- Imagen del Producto -->
          <div class="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100 shadow-inner shrink-0 overflow-hidden">
            <img 
              :src="obtenerImagenProducto(item.imagen_url || item.nombre, item.categoria)" 
              :alt="item.nombre" 
              @error="manejarErrorImagen"
              class="max-h-full max-w-full object-contain rounded-lg" 
            />
          </div>

          <!-- Detalles del Producto con Talla y Color Dinámicos -->
          <div class="flex-grow px-4 text-left">
            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
              {{ item.categoria || 'Multimarca' }}
            </span>
            <h3 class="text-base sm:text-lg font-extrabold text-gray-800 mt-1 leading-snug">{{ item.nombre }}</h3>
            <p class="text-xs text-gray-400 font-mono">Cód: {{ item.codigo || 'REF-' + item.id }}</p>
            
            <!-- Talla y Color Seleccionados de forma dinámica -->
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span class="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                Talla: <strong>{{ item.tallaSeleccionada || 'M' }}</strong>
              </span>
              <span class="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-200">
                Color: <strong>{{ item.colorSeleccionado || 'Original' }}</strong>
              </span>
            </div>

            <p class="text-lg font-black text-[#6b4e8b] mt-1.5">${{ Number(item.precio).toLocaleString('es-CO') }} COP</p>
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
            @click="eliminarItem(item.id, item.tallaSeleccionada, item.colorSeleccionado)" 
            class="text-red-500 hover:text-red-700 text-xl ml-3 p-2 cursor-pointer transition-transform active:scale-90"
            title="Eliminar del carrito"
          >
            🗑️
          </button>
        </div>

      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN REAL DEL USUARIO Y RESUMEN DE TOTALES -->
      <div class="flex flex-col gap-6 text-left">
        
        <!-- Cuadro de Dirección Dinámico (Requiere Inicio de Sesión) -->
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <h3 class="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
            <span>📍</span> Dirección de Envío
          </h3>
          
          <!-- Si el cliente ha iniciado sesión -->
          <div v-if="estaAutenticado" class="bg-[#8fa15b]/20 p-4 rounded-2xl border border-[#8fa15b]/30 mb-3">
            <p class="font-extrabold text-gray-900 text-sm">👤 Destinatario: {{ usuarioNombreActual }}</p>
            <p class="text-xs text-gray-700 mt-1 font-medium">🏠 {{ usuarioDireccionActual || 'Cl. 12a #71c-60' }}</p>
            <p class="text-xs text-purple-900 font-bold mt-0.5">📍 {{ usuarioCiudadActual || 'Pasto' }} - {{ usuarioDeptoActual || 'Nariño' }}</p>
            <p class="text-[11px] text-gray-500 mt-1">📧 {{ usuarioEmailActual }}</p>
          </div>

          <!-- Si el cliente NO ha iniciado sesión (Alerta y bloqueo de compra anónima) -->
          <div v-else class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 text-amber-900 mb-3 shadow-sm">
            <p class="font-black text-xs flex items-center gap-1.5 text-amber-900">
              <span>🔒</span> Inicio de sesión obligatorio
            </p>
            <p class="text-[11px] mt-1 text-amber-800 leading-snug">
              Para garantizar el despacho seguro y la factura de tu pedido, debes iniciar sesión o registrarte.
            </p>
            <button 
              type="button" 
              @click="emit('solicitarLogin')" 
              class="mt-3 w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white text-xs font-bold py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>🔑</span> Iniciar Sesión / Registrarme
            </button>
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
              <span class="font-bold text-gray-800">${{ calcularSubtotal().toLocaleString('es-CO') }} COP</span>
            </div>

            <div class="flex justify-between py-2 border-b border-gray-100 text-sm font-medium text-gray-600">
              <span>Costo de Envío Nacional:</span>
              <span class="font-bold text-gray-800">
                {{ items.length > 0 ? '$15.000 COP' : '$0 COP' }}
              </span>
            </div>

            <div class="flex justify-between py-4 text-lg font-black text-gray-800">
              <span>Total a Pagar:</span>
              <span class="text-2xl text-[#6b4e8b] font-black">${{ calcularTotal().toLocaleString('es-CO') }} COP</span>
            </div>
          </div>

          <!-- Botón de Continuar al Pago (Solo se activa si el usuario ha iniciado sesión) -->
          <button 
            type="button"
            @click="procesarDespachoYAvance" 
            :disabled="items.length === 0 || !estaAutenticado" 
            :class="!estaAutenticado ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-[#6b4e8b] hover:bg-[#5a3f75] cursor-pointer active:scale-95 shadow-md'"
            class="w-full text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm uppercase tracking-wide mt-4 flex items-center justify-center gap-2"
          >
            <span v-if="estaAutenticado">💳 Continuar al Pago</span>
            <span v-else>🔒 Inicia Sesión para Comprar</span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { obtenerImagenProducto, imagenPorDefecto } from '../utils/imagenes.js';

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

const emit = defineEmits(['regresarAlCatalogo', 'solicitarLogin']);

// Extracción reactiva de datos del usuario activo desde localStorage
const usuarioEmailActual = computed(() => localStorage.getItem('usuarioEmail') || '');
const usuarioNombreActual = computed(() => localStorage.getItem('usuarioNombre') || '');
const usuarioDireccionActual = computed(() => localStorage.getItem('usuarioDireccion') || '');
const usuarioCiudadActual = computed(() => localStorage.getItem('usuarioCiudad') || '');
const usuarioDeptoActual = computed(() => localStorage.getItem('usuarioDepartamento') || '');

// Comprobar autenticación real: solo se puede ordenar si ha iniciado sesión
const estaAutenticado = computed(() => {
  return !!usuarioEmailActual.value && usuarioEmailActual.value.trim().length > 0;
});

// Avanzar a la pantalla de pagos
const procesarDespachoYAvance = () => {
  if (!estaAutenticado.value) {
    alert('🔒 Para realizar tu pedido debes iniciar sesión con tu cuenta registrada.');
    emit('solicitarLogin');
    return;
  }

  const direccionFinal = `${usuarioDireccionActual.value || 'Cl. 12a #71c-60'}, ${usuarioCiudadActual.value || 'Pasto'} - ${usuarioDeptoActual.value || 'Nariño'}`;
  localStorage.setItem('direccionPedidoActual', direccionFinal);
  
  if (props.onIrAPagar) {
    props.onIrAPagar();
  }
};

// Fallback si la imagen no carga
const manejarErrorImagen = (evento) => {
  evento.target.src = imagenPorDefecto;
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

const eliminarItem = (id, talla, color) => {
  const index = props.items.findIndex(item => 
    item.id === id && 
    (item.tallaSeleccionada || '') === (talla || '') && 
    (item.colorSeleccionado || '') === (color || '')
  );
  if (index !== -1) {
    props.items.splice(index, 1);
  }
};
</script>
