<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16 text-left">
    <!-- Encabezado Principal -->
    <div class="max-w-6xl mx-auto mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="bg-purple-900 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Acceso Administrativo
          </span>
          <h2 class="text-3xl font-black text-gray-800 mt-2">Panel de Control General</h2>
          <p class="text-sm text-gray-700 font-medium">Gestión integral de inventario multimarca, cambio de imágenes y clientes en MySQL</p>
        </div>

        <!-- Selector de Pestañas Administrativas -->
        <div class="flex items-center gap-2 bg-white/70 p-1.5 rounded-2xl border border-gray-200">
          <button 
            type="button"
            @click="pestanaActiva = 'inventario'"
            :class="pestanaActiva === 'inventario' ? 'bg-[#6b4e8b] text-white shadow-md' : 'text-gray-700 hover:bg-white/50'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🛍️</span> Inventario de Prendas
          </button>
          <button 
            type="button"
            @click="pestanaActiva = 'usuarios'"
            :class="pestanaActiva === 'usuarios' ? 'bg-[#6b4e8b] text-white shadow-md' : 'text-gray-700 hover:bg-white/50'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>👥</span> Usuarios Registrados
          </button>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- PESTAÑA 1: INVENTARIO DE PRENDAS (PRODUCTOS) -->
    <!-- ==================================================== -->
    <div v-if="pestanaActiva === 'inventario'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: FORMULARIO DE NUEVA PRENDA -->
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-fit">
        <h3 class="text-xl font-black text-gray-800 mb-1 flex items-center gap-2">
          <span>➕</span> Registrar Nueva Prenda
        </h3>
        <p class="text-xs text-gray-500 mb-4">Ingresa los datos para incorporar un producto al catálogo en MySQL.</p>
        
        <form @submit.prevent="guardarNuevoProducto" class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Código Único</label>
            <input 
              v-model="nuevoProducto.codigo" 
              type="text" 
              placeholder="Ej: OAK-006, ADI-004" 
              required 
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre del Producto</label>
            <input 
              v-model="nuevoProducto.nombre" 
              type="text" 
              placeholder="Ej: Camiseta Olivo M-C, Tenis Running" 
              required 
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
          </div>

          <!-- Selector de Marca / Categoría Requerida -->
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Marca / Categoría Oficial</label>
            <select 
              v-model="nuevoProducto.categoria" 
              required
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white font-semibold cursor-pointer"
            >
              <option value="Oakley">Oakley</option>
              <option value="Adidas">Adidas</option>
              <option value="Victoria Secret">Victoria Secret</option>
              <option value="Puma">Puma</option>
              <option value="Polo">Polo</option>
              <option value="Varios">Varios</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Precio (COP $)</label>
            <input 
              v-model.number="nuevoProducto.precio" 
              type="number" 
              placeholder="Ej: 150000" 
              required 
              min="1000"
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
          </div>

          <!-- Nombre de Archivo de Imagen con Autocompletado y Vista Previa -->
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre de Archivo de Imagen</label>
            <input 
              v-model="nuevoProducto.imagen_url" 
              type="text" 
              placeholder="Ej: camiseta_olivo.jpg, tenis_adidas.jpg" 
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
            <span class="text-[10px] text-gray-400">Guarda tu archivo .jpg en la carpeta <strong>src/assets/</strong> y escribe su nombre con .jpg</span>
            
            <!-- Vista previa de imagen en formulario -->
            <div class="mt-2 p-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                <img :src="obtenerImagenLocal(nuevoProducto.imagen_url)" class="max-h-full max-w-full object-contain" @error="$event.target.src = obtenerImagenLocal('camiseta.jpg')" />
              </div>
              <span class="text-[11px] text-gray-500 truncate">Vista previa: {{ nuevoProducto.imagen_url || 'camiseta.jpg (estándar)' }}</span>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wide cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            <span>🚀</span> Subir al Catálogo
          </button>
        </form>
      </div>

      <!-- COLUMNA DERECHA: TABLA DE INVENTARIO -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 class="text-xl font-black text-gray-800">
            Inventario en Base de Datos ({{ listaFiltradaAdmin.length }})
          </h3>
          <!-- Filtro rápido en el panel admin -->
          <div class="flex gap-2 items-center">
            <select 
              v-model="filtroCategoriaAdmin" 
              class="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 outline-none cursor-pointer"
            >
              <option value="">Todas las marcas</option>
              <option value="Oakley">Oakley</option>
              <option value="Adidas">Adidas</option>
              <option value="Victoria Secret">Victoria Secret</option>
              <option value="Puma">Puma</option>
              <option value="Polo">Polo</option>
              <option value="Varios">Varios</option>
            </select>
          </div>
        </div>
        
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-full overflow-hidden">
          <div class="overflow-x-auto rounded-xl border border-gray-100">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="bg-gray-50 text-gray-700 uppercase text-[11px] font-black border-b border-gray-100">
                <tr>
                  <th class="p-3.5">Foto</th>
                  <th class="p-3.5">Código</th>
                  <th class="p-3.5">Prenda</th>
                  <th class="p-3.5">Marca</th>
                  <th class="p-3.5">Precio</th>
                  <th class="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-600">
                <tr v-for="prod in listaFiltradaAdmin" :key="prod.id" class="hover:bg-gray-50 transition-colors">
                  <!-- Miniatura de Imagen en la tabla -->
                  <td class="p-2">
                    <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-0.5">
                      <img :src="obtenerImagenLocal(prod.imagen_url)" class="max-h-full max-w-full object-contain" @error="$event.target.src = obtenerImagenLocal('camiseta.jpg')" />
                    </div>
                  </td>
                  <td class="p-3.5 font-mono font-bold text-purple-900">{{ prod.codigo }}</td>
                  <td class="p-3.5 font-bold text-gray-800">{{ prod.nombre }}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900">
                      {{ prod.categoria }}
                    </span>
                  </td>
                  <td class="p-3.5 font-extrabold text-gray-800">${{ Number(prod.precio).toLocaleString('es-CO') }}</td>
                  <td class="p-3.5 text-center flex items-center justify-center gap-1.5">
                    <!-- BOTÓN CAMBIAR / EDITAR PRODUCTO E IMAGEN -->
                    <button 
                      type="button"
                      @click="abrirModalEdicion(prod)" 
                      class="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Cambiar imagen o editar información de esta prenda"
                    >
                      <span>✏️</span> Editar
                    </button>
                    <!-- BOTÓN ELIMINAR -->
                    <button 
                      type="button"
                      @click="eliminarProductoCatalogo(prod.id)" 
                      class="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
                      title="Eliminar permanentemente de MySQL"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- ==================================================== -->
    <!-- PESTAÑA 2: GESTIÓN DE USUARIOS (MySQL) -->
    <!-- ==================================================== -->
    <div v-else-if="pestanaActiva === 'usuarios'" class="max-w-6xl mx-auto flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-xl font-black text-gray-800">
            Base de Datos de Clientes Registrados
          </h3>
          <p class="text-xs text-gray-600">Total registrados: {{ listaUsuariosAdmin.length }} usuarios</p>
        </div>
        <button 
          type="button" 
          @click="cargarUsuarios" 
          class="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
        >
          Actualizar Lista 🔄
        </button>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto rounded-xl border border-gray-100">
          <table class="w-full text-left border-collapse text-xs">
            <thead class="bg-gray-50 text-gray-700 uppercase text-[11px] font-black border-b border-gray-100">
              <tr>
                <th class="p-3.5">ID</th>
                <th class="p-3.5">Nombre Completo</th>
                <th class="p-3.5">Cédula</th>
                <th class="p-3.5">Correo Electrónico</th>
                <th class="p-3.5">Celular</th>
                <th class="p-3.5">Ciudad</th>
                <th class="p-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-600">
              <tr v-if="listaUsuariosAdmin.length === 0">
                <td colspan="7" class="p-6 text-center text-gray-400 italic">
                  No hay usuarios registrados en la base de datos.
                </td>
              </tr>
              <tr v-for="u in listaUsuariosAdmin" :key="u.id" class="hover:bg-gray-50 transition-colors">
                <td class="p-3.5 font-mono text-gray-400">#{{ u.id }}</td>
                <td class="p-3.5 font-bold text-gray-800">{{ u.nombre }} {{ u.apellido || '' }}</td>
                <td class="p-3.5 font-mono">{{ u.cedula || 'N/A' }}</td>
                <td class="p-3.5 text-purple-900 font-semibold">{{ u.email }}</td>
                <td class="p-3.5">{{ u.celular || 'N/A' }}</td>
                <td class="p-3.5">{{ u.ciudad || 'Bello' }}</td>
                <td class="p-3.5 text-center">
                  <button 
                    type="button"
                    @click="eliminarUsuarioBD(u.id)" 
                    class="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold py-1 px-3 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
                  >
                    Eliminar 🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL DE EDICIÓN Y CAMBIO DE IMAGEN DE PRODUCTO -->
    <!-- ==================================================== -->
    <div v-if="mostrarModalEditar" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-left">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-black text-gray-800 flex items-center gap-2">
            <span>✏️</span> Editar Prenda y Cambiar Imagen
          </h3>
          <button @click="mostrarModalEditar = false" class="text-gray-400 hover:text-gray-600 font-black text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="guardarEdicionProducto" class="flex flex-col gap-3.5">
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="font-bold text-gray-700 text-xs">Código</label>
              <input v-model="productoEnEdicion.codigo" type="text" required class="bg-gray-50 border p-2 rounded-xl text-xs" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-gray-700 text-xs">Marca / Categoría</label>
              <select v-model="productoEnEdicion.categoria" required class="bg-gray-50 border p-2 rounded-xl text-xs font-semibold">
                <option value="Oakley">Oakley</option>
                <option value="Adidas">Adidas</option>
                <option value="Victoria Secret">Victoria Secret</option>
                <option value="Puma">Puma</option>
                <option value="Polo">Polo</option>
                <option value="Varios">Varios</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre de la Prenda</label>
            <input v-model="productoEnEdicion.nombre" type="text" required class="bg-gray-50 border p-2 rounded-xl text-xs" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Precio (COP $)</label>
            <input v-model.number="productoEnEdicion.precio" type="number" required min="1000" class="bg-gray-50 border p-2 rounded-xl text-xs" />
          </div>

          <!-- CAMPO CLAVE: NOMBRE DEL ARCHIVO DE IMAGEN -->
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre de Archivo de Imagen (.jpg)</label>
            <input 
              v-model="productoEnEdicion.imagen_url" 
              type="text" 
              placeholder="Ej: camiseta_olivo.jpg" 
              required 
              class="bg-gray-50 border p-2 rounded-xl text-xs font-mono text-purple-900" 
            />
            <span class="text-[10px] text-gray-400">Debe coincidir con el archivo guardado en <strong>src/assets/</strong></span>
          </div>

          <!-- Vista previa en tiempo real dentro del modal -->
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
              <img :src="obtenerImagenLocal(productoEnEdicion.imagen_url)" class="max-h-full max-w-full object-contain" @error="$event.target.src = obtenerImagenLocal('camiseta.jpg')" />
            </div>
            <div class="text-xs text-gray-600">
              <p class="font-bold text-gray-800">Vista previa en tiempo real</p>
              <p class="text-[11px] text-gray-500 font-mono">{{ productoEnEdicion.imagen_url }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-2">
            <button type="button" @click="mostrarModalEditar = false" class="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2 bg-[#6b4e8b] hover:bg-[#5a3f75] text-white rounded-xl text-xs font-bold shadow cursor-pointer">
              Guardar Cambios 💾
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const pestanaActiva = ref('inventario');
const filtroCategoriaAdmin = ref('');

const listaProductosAdmin = ref([]);
const listaUsuariosAdmin = ref([]);

const nuevoProducto = ref({ 
  codigo: '', 
  nombre: '', 
  categoria: 'Adidas', 
  precio: '', 
  imagen_url: '' 
});

// Estado del Modal de Edición
const mostrarModalEditar = ref(false);
const productoEnEdicion = ref({
  id: null,
  codigo: '',
  nombre: '',
  categoria: 'Adidas',
  precio: 0,
  imagen_url: ''
});

const listaFiltradaAdmin = computed(() => {
  if (!filtroCategoriaAdmin.value) return listaProductosAdmin.value;
  return listaProductosAdmin.value.filter(p => 
    (p.categoria || '').toLowerCase() === filtroCategoriaAdmin.value.toLowerCase()
  );
});

// Función robusta para cargar imágenes de assets compatibles con Vite
const obtenerImagenLocal = (nombreImagen) => {
  if (!nombreImagen) return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
  const limpio = nombreImagen.trim();
  try {
    return new URL(`/src/assets/${limpio}`, import.meta.url).href;
  } catch (e) {
    try {
      if (!limpio.includes('.')) {
        return new URL(`/src/assets/${limpio}.jpg`, import.meta.url).href;
      }
    } catch (e2) {}
  }
  return new URL('/src/assets/camiseta.jpg', import.meta.url).href;
};

// Cargar catálogo de prendas desde MySQL
const cargarInventario = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/productos');
    if (respuesta.ok) {
      listaProductosAdmin.value = await respuesta.json();
    }
  } catch (error) {
    console.error("Error cargando inventario:", error);
  }
};

// Cargar usuarios de MySQL
const cargarUsuarios = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/usuarios');
    if (respuesta.ok) {
      listaUsuariosAdmin.value = await respuesta.json();
    }
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
};

// Sanitizar nombre de archivo de imagen
const sanitizarNombreImagen = (nombre) => {
  if (!nombre) return 'camiseta.jpg';
  let limpio = nombre.trim();
  // Si no tiene extensión, agregar .jpg automáticamente
  if (!limpio.includes('.')) {
    limpio = `${limpio}.jpg`;
  }
  return limpio;
};

// Guardar prenda nueva
const guardarNuevoProducto = async () => {
  try {
    nuevoProducto.value.imagen_url = sanitizarNombreImagen(nuevoProducto.value.imagen_url);

    const respuesta = await fetch('http://localhost:8080/servidor_nana/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto.value)
    });

    if (respuesta.ok) {
      alert('¡Prenda agregada con éxito al catálogo de la tienda en MySQL!');
      nuevoProducto.value = { codigo: '', nombre: '', categoria: 'Adidas', precio: '', imagen_url: '' };
      cargarInventario();
    } else {
      const err = await respuesta.json();
      alert(`Error al guardar producto: ${err.error || 'Intente nuevamente'}`);
    }
  } catch (error) {
    console.error("Error guardando producto:", error);
  }
};

// Abrir modal para editar producto existente o cambiar su imagen
const abrirModalEdicion = (prod) => {
  productoEnEdicion.value = { ...prod };
  mostrarModalEditar.value = true;
};

// Guardar edición del producto en MySQL
const guardarEdicionProducto = async () => {
  try {
    productoEnEdicion.value.imagen_url = sanitizarNombreImagen(productoEnEdicion.value.imagen_url);

    const respuesta = await fetch(`http://localhost:8080/servidor_nana/productos/${productoEnEdicion.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoEnEdicion.value)
    });

    if (respuesta.ok) {
      alert('¡Producto e imagen actualizados correctamente en MySQL!');
      mostrarModalEditar.value = false;
      cargarInventario();
    } else {
      const err = await respuesta.json();
      alert(`Error al actualizar producto: ${err.error || 'Intente nuevamente'}`);
    }
  } catch (error) {
    console.error("Error actualizando producto:", error);
  }
};

// Eliminar producto
const eliminarProductoCatalogo = async (id) => {
  if (!confirm("¿Está seguro de que desea eliminar este producto de la base de datos de forma permanente?")) return;
  
  try {
    const respuesta = await fetch(`http://localhost:8080/servidor_nana/productos/${id}`, {
      method: 'DELETE'
    });
    if (respuesta.ok) {
      alert("Producto removido exitosamente.");
      cargarInventario();
    }
  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
};

// Eliminar usuario
const eliminarUsuarioBD = async (id) => {
  if (!confirm("¿Desea eliminar este usuario de la base de datos?")) return;

  try {
    const respuesta = await fetch(`http://localhost:8080/servidor_nana/usuarios/${id}`, {
      method: 'DELETE'
    });
    if (respuesta.ok) {
      alert("Usuario eliminado correctamente de la base de datos.");
      cargarUsuarios();
    }
  } catch (error) {
    console.error("Error eliminando usuario:", error);
  }
};

onMounted(() => {
  cargarInventario();
  cargarUsuarios();
});
</script>
