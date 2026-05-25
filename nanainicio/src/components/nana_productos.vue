<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12">
    <!-- Título Principal -->
    <h2 class="text-3xl font-bold mb-8 text-gray-800 text-left">Productos</h2>

    <!-- Contenedor de Tarjetas (Grid de 3 columnas) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- Producto dinámico usando v-for -->
      <div v-for="producto in listaProductos" :key="producto.id" class="bg-white rounded-[2rem] shadow-xl overflow-hidden p-5 flex flex-col items-center border border-gray-100 transition-all hover:scale-[1.03] duration-300">
        
        <!-- Contenedor Blanco para la Imagen (Fiel a tu prototipo) -->
        <div class="w-full bg-white rounded-2xl p-4 flex items-center justify-center border border-gray-100 mb-4 h-64 shadow-inner">
          <img 
            :src="obtenerImagenLocal(producto.imagen_url)" 
            :alt="producto.nombre" 
            class="max-h-full max-w-full object-contain rounded-xl"
          />
        </div>

        <!-- Información del Producto -->
        <div class="w-full px-2 text-center flex flex-col flex-grow justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ producto.categoria }}</p>
            <h3 class="text-2xl font-black text-gray-800 my-1">{{ producto.nombre }}</h3>
            <p class="text-xs font-semibold text-gray-400 mb-3">Código: {{ producto.codigo }}</p>
            
            <!-- Selectores Desplegables Reales (Talla y Color de tu dibujo) -->
            <div class="flex justify-center gap-3 my-4">
              <select class="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-2 rounded-full border border-gray-200 outline-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-green-600">
                <option value="">Talla ∨</option>
                <option value="S">Talla S</option>
                <option value="M">Talla M</option>
                <option value="L">Talla L</option>
                <option value="XL">Talla XL</option>
              </select>

              <select class="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-2 rounded-full border border-gray-200 outline-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-green-600">
                <option value="">Color ∨</option>
                <option value="negro">Negro</option>
                <option value="blanco">Blanco</option>
                <option value="gris">Gris</option>
              </select>
            </div>
          </div>

          <div>
            <!-- Precio Destacado con formato de moneda colombiana -->
            <p class="text-3xl font-black text-gray-800 my-3">
              ${{ Number(producto.precio).toLocaleString('es-CO') }}
            </p>

            <!-- Botón Morado de Compra -->
            <button 
              @click="props.onAgregar(producto)" 
              class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 mt-3 text-sm tracking-wide uppercase"
            >
               Agregar al Carrito
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';

// Definición correcta de propiedades recibidas desde App.vue
const props = defineProps({
  onAgregar: Function
});

// Lista reactiva de productos
const listaProductos = ref([]);

// CORRECCIÓN DE RUTA: Uso de ruta absoluta compatible con Vite para evitar pérdidas de imágenes
const obtenerImagenLocal = (nombreImagen) => {
  if (!nombreImagen) return 'https://placeholder.com';
  return new URL(`/src/assets/${nombreImagen}`, import.meta.url).href;
};

const cargarProductos = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/productos');
    if (respuesta.ok) {
      listaProductos.value = await respuesta.json();
    }
  } catch (error) {
    console.error("Error conectando al catálogo:", error);
  }
};

onMounted(() => {
  // Datos de respaldo estáticos combinados con los nombres de tu carpeta assets
  listaProductos.value = [
    { id: 1, codigo: '001', nombre: 'Buso', categoria: 'Oakley', precio: 190000, imagen_url: 'buso.jpg' },
    { id: 2, codigo: '002', nombre: 'Camiseta', categoria: 'Oakley', precio: 90000, imagen_url: 'camiseta.jpg' },
    { id: 3, codigo: '003', nombre: 'Pantalón', categoria: 'Oakley', precio: 250000, imagen_url: 'pantalon.jpg' }
  ];
  cargarProductos();
});
</script>
