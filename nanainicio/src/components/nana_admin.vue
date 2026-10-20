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
          <p class="text-sm text-gray-700 font-medium">Gestión integral de inventario multimarca y usuarios registrados en MySQL</p>
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
          <span>➕</span> Registrar Prenda
        </h3>
        <p class="text-xs text-gray-500 mb-4">Ingresa los datos para incorporar un producto al catálogo en MySQL.</p>
        
        <form @submit.prevent="guardarNuevoProducto" class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Código Único</label>
            <input 
              v-model="nuevoProducto.codigo" 
              type="text" 
              placeholder="Ej: OAK-006, ADI-005" 
              required 
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre del Producto</label>
            <input 
              v-model="nuevoProducto.nombre" 
              type="text" 
              placeholder="Ej: Chaqueta Deportiva, Gorra" 
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
              placeholder="Ej: 190000" 
              required 
              min="1000"
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Nombre de Archivo de Imagen</label>
            <input 
              v-model="nuevoProducto.imagen_url" 
              type="text" 
              placeholder="Ej: camiseta.jpg, tenis_adidas.jpg" 
              class="bg-gray-50 text-gray-800 rounded-xl p-2.5 text-xs outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white" 
            />
            <span class="text-[10px] text-gray-400">Si se omite, se asignará la imagen estándar de catálogo.</span>
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
                  <th class="p-3.5">Código</th>
                  <th class="p-3.5">Prenda</th>
                  <th class="p-3.5">Marca</th>
                  <th class="p-3.5">Precio</th>
                  <th class="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-600">
                <tr v-for="prod in listaFiltradaAdmin" :key="prod.id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-3.5 font-mono font-bold text-purple-900">{{ prod.codigo }}</td>
                  <td class="p-3.5 font-bold text-gray-800">{{ prod.nombre }}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900">
                      {{ prod.categoria }}
                    </span>
                  </td>
                  <td class="p-3.5 font-extrabold text-gray-800">${{ Number(prod.precio).toLocaleString('es-CO') }}</td>
                  <td class="p-3.5 text-center">
                    <button 
                      type="button"
                      @click="eliminarProductoCatalogo(prod.id)" 
                      class="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
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
  categoria: 'Oakley', 
  precio: '', 
  imagen_url: '' 
});

const listaFiltradaAdmin = computed(() => {
  if (!filtroCategoriaAdmin.value) return listaProductosAdmin.value;
  return listaProductosAdmin.value.filter(p => 
    (p.categoria || '').toLowerCase() === filtroCategoriaAdmin.value.toLowerCase()
  );
});

// Cargar catálogo de prendas
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

// Guardar prenda nueva
const guardarNuevoProducto = async () => {
  try {
    if (!nuevoProducto.value.imagen_url) {
      nuevoProducto.value.imagen_url = 'camiseta.jpg';
    }

    const respuesta = await fetch('http://localhost:8080/servidor_nana/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto.value)
    });

    if (respuesta.ok) {
      alert('¡Prenda agregada con éxito al catálogo de la tienda en MySQL!');
      nuevoProducto.value = { codigo: '', nombre: '', categoria: 'Oakley', precio: '', imagen_url: '' };
      cargarInventario();
    } else {
      const err = await respuesta.json();
      alert(`Error al guardar producto: ${err.error || 'Intente nuevamente'}`);
    }
  } catch (error) {
    console.error("Error guardando producto:", error);
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
