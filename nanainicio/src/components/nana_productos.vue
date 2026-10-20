<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16">
    <!-- Encabezado y Barra de Filtro de Marcas -->
    <div class="max-w-6xl mx-auto mb-8 text-left">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span class="bg-white/80 text-[#6b4e8b] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Catálogo Multimarca Oficial
          </span>
          <h2 class="text-3xl font-black text-gray-800 mt-2">Nuestros Productos</h2>
          <p class="text-sm text-gray-700 font-medium">
            Selecciona una marca para filtrar o busca directamente tu prenda favorita
          </p>
        </div>

        <!-- Filtros Rápidos / Búsqueda local y Ordenamiento -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <input 
              v-model="terminoBusqueda"
              type="text" 
              placeholder="Buscar prenda..." 
              class="bg-white text-gray-800 text-xs font-semibold rounded-full px-4 py-2.5 pl-8 border border-gray-200 outline-none focus:ring-2 focus:ring-green-600 shadow-sm w-48 sm:w-56"
            />
            <span class="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
            <button 
              v-if="terminoBusqueda" 
              @click="terminoBusqueda = ''" 
              class="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <select 
            v-model="ordenPrecio"
            class="bg-white text-gray-700 text-xs font-bold px-3 py-2.5 rounded-full border border-gray-200 outline-none cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-green-600 shadow-sm"
          >
            <option value="defecto">Ordenar por: Relevancia</option>
            <option value="menor">Precio: Menor a Mayor</option>
            <option value="mayor">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      <!-- BOTONES DE FILTRO POR MARCA -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          v-for="m in listaMarcas" 
          :key="m.id"
          @click="seleccionarMarca(m.nombre)"
          :class="marcaSeleccionada.toLowerCase() === m.nombre.toLowerCase() 
            ? 'bg-[#6b4e8b] text-white shadow-md scale-105' 
            : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-100'"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 active:scale-95"
        >
          <span>{{ m.icono }}</span>
          <span>{{ m.nombre }}</span>
          <span 
            v-if="conteoPorMarca[m.nombre.toLowerCase()]" 
            :class="marcaSeleccionada.toLowerCase() === m.nombre.toLowerCase() ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'"
            class="text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5"
          >
            {{ conteoPorMarca[m.nombre.toLowerCase()] }}
          </span>
        </button>
      </div>

      <!-- Barra de Estado de Filtro -->
      <div class="mt-4 flex justify-between items-center text-xs font-semibold text-gray-700 px-1">
        <span>
          Mostrando <strong class="text-purple-900">{{ productosFiltrados.length }}</strong> prendas
          <span v-if="marcaSeleccionada !== 'Todas'"> de la marca <strong class="text-purple-900">{{ marcaSeleccionada }}</strong></span>
        </span>
        <button 
          v-if="marcaSeleccionada !== 'Todas' || terminoBusqueda"
          @click="restablecerFiltros" 
          class="text-xs text-purple-900 underline font-bold hover:text-purple-700 cursor-pointer"
        >
          Limpiar filtros ↺
        </button>
      </div>
    </div>

    <!-- ESTADO VACÍO (Si no hay resultados para el filtro) -->
    <div v-if="productosFiltrados.length === 0" class="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl text-center my-12 border border-gray-100">
      <span class="text-4xl mb-3 block">🛍️</span>
      <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron prendas</h3>
      <p class="text-xs text-gray-500 mb-4">
        No hay productos que coincidan con la marca "{{ marcaSeleccionada }}" o el término "{{ terminoBusqueda }}".
      </p>
      <button 
        @click="restablecerFiltros"
        class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase shadow transition-all cursor-pointer"
      >
        Ver Todos los Productos
      </button>
    </div>

    <!-- GRID DE PRODUCTOS (3 Columnas responsivas) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <div 
        v-for="producto in productosFiltrados" 
        :key="producto.id" 
        class="bg-white rounded-[2rem] shadow-xl overflow-hidden p-5 flex flex-col items-center border border-gray-100 transition-all hover:scale-[1.02] hover:shadow-2xl duration-300 relative group text-left"
      >
        <!-- Badge de Marca Flotante -->
        <span 
          :class="obtenerColorBadge(producto.categoria)"
          class="absolute top-7 left-7 z-10 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider"
        >
          {{ producto.categoria }}
        </span>

        <!-- Contenedor Blanco para la Imagen -->
        <div class="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-100 mb-4 h-64 shadow-inner overflow-hidden relative">
          <img 
            :src="obtenerImagenLocal(producto.imagen_url)" 
            :alt="producto.nombre" 
            @error="manejarErrorImagen($event, producto)"
            class="max-h-full max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <!-- Información del Producto -->
        <div class="w-full px-2 text-center flex flex-col flex-grow justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ producto.categoria }}</p>
            <h3 class="text-xl font-black text-gray-800 my-1 line-clamp-1" :title="producto.nombre">
              {{ producto.nombre }}
            </h3>
            <p class="text-xs font-semibold text-gray-400 mb-3 font-mono">Cód: {{ producto.codigo }}</p>
            
            <!-- Selectores Desplegables de Talla y Color -->
            <div class="flex justify-center gap-3 my-3">
              <select class="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 outline-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-green-600">
                <option value="">Talla ∨</option>
                <option value="S">Talla S</option>
                <option value="M">Talla M</option>
                <option value="L">Talla L</option>
                <option value="XL">Talla XL</option>
                <option value="UNICA">Talla Única</option>
              </select>

              <select class="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 outline-none cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-green-600">
                <option value="">Color ∨</option>
                <option value="negro">Negro</option>
                <option value="blanco">Blanco</option>
                <option value="gris">Gris</option>
                <option value="azul">Azul</option>
                <option value="original">Original</option>
              </select>
            </div>
          </div>

          <div>
            <!-- Precio Destacado en Pesos Colombianos -->
            <p class="text-2xl font-black text-gray-800 my-2">
              ${{ Number(producto.precio).toLocaleString('es-CO') }}
            </p>

            <!-- Botón de Compra -->
            <button 
              @click="props.onAgregar(producto)" 
              class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs tracking-wide uppercase cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛒</span> Agregar al Carrito
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  onAgregar: {
    type: Function,
    default: () => {}
  },
  marcaFiltroInicial: {
    type: String,
    default: 'Todas'
  }
});

// Lista reactiva de marcas configuradas
const listaMarcas = [
  { id: 'todas', nombre: 'Todas', icono: '🔥' },
  { id: 'oakley', nombre: 'Oakley', icono: '🕶️' },
  { id: 'adidas', nombre: 'Adidas', icono: '👟' },
  { id: 'victoria_secret', nombre: 'Victoria Secret', icono: '🌸' },
  { id: 'puma', nombre: 'Puma', icono: '🐆' },
  { id: 'polo', nombre: 'Polo', icono: '🐎' },
  { id: 'varios', nombre: 'Varios', icono: '🎒' }
];

// Estados reactivos
const listaProductos = ref([]);
const marcaSeleccionada = ref(props.marcaFiltroInicial || 'Todas');
const terminoBusqueda = ref('');
const ordenPrecio = ref('defecto');

// Escuchar cambios en la propiedad marcaFiltroInicial si proviene de App.vue
watch(() => props.marcaFiltroInicial, (nuevaMarca) => {
  if (nuevaMarca) {
    marcaSeleccionada.value = nuevaMarca;
  }
});

// Conteo dinámico de productos por marca
const conteoPorMarca = computed(() => {
  const conteo = {};
  listaProductos.value.forEach(p => {
    const cat = (p.categoria || '').toLowerCase();
    conteo[cat] = (conteo[cat] || 0) + 1;
  });
  conteo['todas'] = listaProductos.value.length;
  return conteo;
});

// Filtrado y ordenamiento computado
const productosFiltrados = computed(() => {
  let resultado = [...listaProductos.value];

  // Filtro por marca
  if (marcaSeleccionada.value && marcaSeleccionada.value.toLowerCase() !== 'todas') {
    resultado = resultado.filter(p => 
      (p.categoria || '').toLowerCase().trim() === marcaSeleccionada.value.toLowerCase().trim()
    );
  }

  // Filtro por término de búsqueda (nombre, categoría, código)
  if (terminoBusqueda.value.trim()) {
    const busq = terminoBusqueda.value.toLowerCase().trim();
    resultado = resultado.filter(p => 
      (p.nombre || '').toLowerCase().includes(busq) ||
      (p.categoria || '').toLowerCase().includes(busq) ||
      (p.codigo || '').toLowerCase().includes(busq)
    );
  }

  // Ordenamiento por precio
  if (ordenPrecio.value === 'menor') {
    resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
  } else if (ordenPrecio.value === 'mayor') {
    resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
  }

  return resultado;
});

// Selección de marca
const seleccionarMarca = (marca) => {
  marcaSeleccionada.value = marca;
};

// Restablecer filtros
const restablecerFiltros = () => {
  marcaSeleccionada.value = 'Todas';
  terminoBusqueda.value = '';
  ordenPrecio.value = 'defecto';
};

// Colores personalizados de Badge según marca
const obtenerColorBadge = (categoria) => {
  const cat = (categoria || '').toLowerCase();
  switch (cat) {
    case 'oakley': return 'bg-gray-900 text-white';
    case 'adidas': return 'bg-black text-white border border-cyan-400';
    case 'victoria secret': return 'bg-pink-100 text-pink-800 border border-pink-300';
    case 'puma': return 'bg-amber-600 text-white';
    case 'polo': return 'bg-blue-900 text-amber-200 border border-amber-300';
    case 'varios': return 'bg-teal-700 text-white';
    default: return 'bg-purple-100 text-purple-900';
  }
};

// Mapeo seguro de imágenes compatible con Vite
const obtenerImagenLocal = (nombreImagen) => {
  if (!nombreImagen) return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  try {
    return new URL(`/src/assets/${nombreImagen}`, import.meta.url).href;
  } catch (e) {
    return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  }
};

// Fallback si la imagen no carga
const manejarErrorImagen = (evento, producto) => {
  evento.target.src = new URL('/src/assets/camiseta.jpg', import.meta.url).href;
};

// Carga asíncrona de productos desde MySQL
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
  cargarProductos();
});
</script>
