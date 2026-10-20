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
          :key="item.id" 
          class="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between border border-gray-100 hover:shadow-2xl transition-all"
        >
          <!-- Imagen del Producto con mapeo exacto de Tenis y demás prendas -->
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
            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
              {{ item.categoria || 'Oakley' }}
            </span>
            <h3 class="text-base sm:text-lg font-extrabold text-gray-800 mt-1 leading-snug">{{ item.nombre }}</h3>
            <p class="text-xs text-gray-400 font-mono">Cód: {{ item.codigo || 'REF-' + item.id }}</p>
            <p class="text-lg font-black text-[#6b4e8b] mt-1">${{ Number(item.precio).toLocaleString('es-CO') }} COP</p>
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

      <!-- COLUMNA DERECHA: DIRECCIÓN REAL DEL USUARIO Y RESUMEN DE TOTALES -->
      <div class="flex flex-col gap-6 text-left">
        
        <!-- Cuadro de Dirección Dinámico (Vinculado a los datos de la sesión del usuario) -->
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <h3 class="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
            <span>📍</span> Dirección de Envío
          </h3>
          
          <div class="bg-[#8fa15b]/20 p-4 rounded-2xl border border-[#8fa15b]/30 mb-3">
            <p class="font-extrabold text-gray-900 text-sm">👤 Destinatario: {{ usuarioNombreActual }}</p>
            <p class="text-xs text-gray-700 mt-1 font-medium">🏠 {{ usuarioDireccionActual }}</p>
            <p class="text-xs text-purple-900 font-bold mt-0.5">📍 {{ usuarioCiudadActual }} - {{ usuarioDeptoActual }}</p>
            <p class="text-[11px] text-gray-500 mt-1">📧 {{ usuarioEmailActual }}</p>
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

          <!-- Botón de Continuar al Pago -->
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
import { computed } from 'vue';

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

// Extracción reactiva de datos del usuario activo desde localStorage
const usuarioNombreActual = computed(() => localStorage.getItem('usuarioNombre') || 'Mercedes Calpa');
const usuarioEmailActual = computed(() => localStorage.getItem('usuarioEmail') || 'mercedes01@gmail.com');
const usuarioDireccionActual = computed(() => localStorage.getItem('usuarioDireccion') || 'Cl. 12a #71c-60');
const usuarioCiudadActual = computed(() => localStorage.getItem('usuarioCiudad') || 'Pasto');
const usuarioDeptoActual = computed(() => localStorage.getItem('usuarioDepartamento') || 'Nariño');

// Avanzar a la pantalla de pagos
const procesarDespachoYAvance = () => {
  const direccionFinal = `${usuarioDireccionActual.value}, ${usuarioCiudadActual.value} - ${usuarioDeptoActual.value}`;
  localStorage.setItem('direccionPedidoActual', direccionFinal);
  
  if (props.onIrAPagar) {
    props.onIrAPagar();
  }
};

// Mapeo exhaustivo y seguro de imágenes de assets de Vite
const obtenerRutaImagen = (item) => {
  if (!item) return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  
  // 1. Si el producto tiene imagen_url registrada
  if (item.imagen_url) {
    try {
      return new URL(`/src/assets/${item.imagen_url}`, import.meta.url).href;
    } catch (e) {
      // Continúa a búsqueda por palabras clave
    }
  }

  // 2. Mapeo inteligente por nombre o categoría
  const nombre = (item.nombre || '').toLowerCase();
  const categoria = (item.categoria || '').toLowerCase();

  // TENIS (Soluciona el error específico de visualización de calzado tenis)
  if (nombre.includes('tenis')) {
    if (nombre.includes('puma') || categoria.includes('puma')) {
      return new URL('/src/assets/tenis_puma.jpg', import.meta.url).href;
    }
    return new URL('/src/assets/tenis_adidas.jpg', import.meta.url).href;
  }

  // OTRAS PRENDAS
  if (nombre.includes('buso') || nombre.includes('hoodie')) {
    if (nombre.includes('puma') || categoria.includes('puma')) {
      return new URL('/src/assets/hoodie_puma.jpg', import.meta.url).href;
    }
    return new URL('/src/assets/buso.jpg', import.meta.url).href;
  }
  if (nombre.includes('chaqueta')) {
    return new URL('/src/assets/chaqueta_adidas.jpg', import.meta.url).href;
  }
  if (nombre.includes('sudadera')) {
    return new URL('/src/assets/sudadera_adidas.jpg', import.meta.url).href;
  }
  if (nombre.includes('jogger')) {
    return new URL('/src/assets/jogger_puma.jpg', import.meta.url).href;
  }
  if (nombre.includes('pantalon') || nombre.includes('pantalón')) {
    return new URL('/src/assets/pantalon.jpg', import.meta.url).href;
  }
  if (nombre.includes('camisa') || nombre.includes('polo')) {
    if (nombre.includes('classic')) return new URL('/src/assets/polo_classic.jpg', import.meta.url).href;
    return new URL('/src/assets/camisa_polo.jpg', import.meta.url).href;
  }
  if (nombre.includes('camiseta')) {
    if (nombre.includes('adidas') || categoria.includes('adidas')) {
      return new URL('/src/assets/camiseta_adidas.jpg', import.meta.url).href;
    }
    return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  }
  if (nombre.includes('pijama')) {
    return new URL('/src/assets/pijama_vs.jpg', import.meta.url).href;
  }
  if (nombre.includes('locion') || nombre.includes('loción')) {
    return new URL('/src/assets/locion_vs.jpg', import.meta.url).href;
  }
  if (nombre.includes('splash')) {
    return new URL('/src/assets/splash_vs.jpg', import.meta.url).href;
  }
  if (nombre.includes('bolso')) {
    return new URL('/src/assets/bolso_vs.jpg', import.meta.url).href;
  }
  if (nombre.includes('mochila')) {
    return new URL('/src/assets/mochila_puma.jpg', import.meta.url).href;
  }
  if (nombre.includes('rinonera') || nombre.includes('riñonera')) {
    return new URL('/src/assets/rinonera_varios.jpg', import.meta.url).href;
  }
  if (nombre.includes('billetera')) {
    return new URL('/src/assets/billetera_polo.jpg', import.meta.url).href;
  }
  if (nombre.includes('gafas')) {
    return new URL('/src/assets/gafas_oakley.jpg', import.meta.url).href;
  }
  if (nombre.includes('gorra')) {
    if (nombre.includes('polo') || categoria.includes('polo')) {
      return new URL('/src/assets/gorra_polo.jpg', import.meta.url).href;
    }
    return new URL('/src/assets/gorra_oakley.jpg', import.meta.url).href;
  }
  if (nombre.includes('reloj')) {
    return new URL('/src/assets/reloj_varios.jpg', import.meta.url).href;
  }
  if (nombre.includes('termo')) {
    return new URL('/src/assets/termo_varios.jpg', import.meta.url).href;
  }
  if (nombre.includes('cinturon') || nombre.includes('cinturón')) {
    return new URL('/src/assets/cinturon_varios.jpg', import.meta.url).href;
  }

  return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
};

// Fallback si la imagen no carga
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
