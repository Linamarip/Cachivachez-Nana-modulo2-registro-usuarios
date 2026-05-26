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
        
        <!-- Cuadro de Dirección de Envío (De tu dibujo) -->
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">📍 Dirección de Envío</h3>
          <div class="bg-[#8fa15b]/20 p-3 rounded-xl border border-[#8fa15b]/30">
            <p class="font-bold text-gray-800">Lina María Rincón</p>
            <p class="text-sm text-gray-600 mt-1">Calle 45 #12-34, Apt 402</p>
            <p class="text-sm text-gray-600">Bello - Antioquia</p>
          </div>
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
          <button 
            @click="props.onIrAPagar"
            :disabled="items.length === 0" 
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm tracking-wide uppercase mt-4 cursor-pointer"
            >            
            Continuar al Pago
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

// Recibe la lista de productos agregados desde App.vue
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  onIrAPagar: Function // <-- NUEVA PROPIEDAD: Recibe la orden de cambiar de pantalla
});

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
