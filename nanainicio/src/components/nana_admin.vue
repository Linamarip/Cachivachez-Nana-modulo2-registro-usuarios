<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12 text-left">
    <!-- Título Principal -->
    <h2 class="text-3xl font-bold mb-8 text-gray-800">Panel de Administración (Control de Inventario)</h2>

    <!-- Contenedor de dos columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: FORMULARIO PARA SUBIR ROPA (1 Columna) -->
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-fit">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Registrar Prenda Nueva</h3>
        
        <form @submit.prevent="guardarNuevoProducto" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Código Único</label>
            <input v-model="nuevoProducto.codigo" type="text" placeholder="Ej: 004" required class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Nombre del Producto</label>
            <input v-model="nuevoProducto.nombre" type="text" placeholder="Ej: Jean Azul, Gorra" required class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Marca / Categoría</label>
            <input v-model="nuevoProducto.categoria" type="text" placeholder="Ej: Oakley, Vans" required class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Precio (Pesos Colombianos)</label>
            <input v-model.number="nuevoProducto.precio" type="number" placeholder="Ej: 150000" required class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Nombre de Archivo de Imagen</label>
            <input v-model="nuevoProducto.imagen_url" type="text" placeholder="Ej: jean.jpg (Debe estar en assets)" class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]" />
          </div>

          <button type="submit" class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm uppercase tracking-wide cursor-pointer mt-2">
            Subir al Catálogo 🚀
          </button>
        </form>
      </div>

      <!-- COLUMNA DERECHA: TABLA DE INVENTARIO ACTUAL (2 Columnas) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Inventario en Base de Datos</h3>
        
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-full overflow-hidden">
          <div class="overflow-x-auto rounded-xl border border-gray-100">
            <table class="w-full text-left border-collapse text-sm">
              <thead class="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-100">
                <tr>
                  <th class="p-4">Código</th>
                  <th class="p-4">Prenda</th>
                  <th class="p-4">Categoría</th>
                  <th class="p-4">Precio</th>
                  <th class="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-600">
                <tr v-for="prod in listaProductosAdmin" :key="prod.id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-4 font-mono font-bold text-purple-900">{{ prod.codigo }}</td>
                  <td class="p-4 font-semibold text-gray-800">{{ prod.nombre }}</td>
                  <td class="p-4">{{ prod.categoria }}</td>
                  <td class="p-4 font-extrabold text-gray-700">${{ Number(prod.precio).toLocaleString('es-CO') }}</td>
                  <td class="p-4 text-center">
                    <button @click="eliminarProductoCatalogo(prod.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow transition-all active:scale-95 cursor-pointer">
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
  </div>
</template> <!-- <-- AQUÍ QUEDÓ PERFECTAMENTE CERRADO TU TEMPLATE -->

<script setup>
import { ref, onMounted } from 'vue';

const listaProductosAdmin = ref([]);
const nuevoProducto = ref({ codigo: '', nombre: '', categoria: 'Oakley', precio: '', imagen_url: '' });

// Obtener los productos actuales de MySQL (Consulta)
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

// Guardar prenda nueva en MySQL (Inserción)
const guardarNuevoProducto = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto.value)
    });

    if (respuesta.ok) {
      alert('¡Prenda agregada con éxito al catálogo de la tienda!');
      nuevoProducto.value = { codigo: '', nombre: '', categoria: 'Oakley', precio: '', imagen_url: '' };
      cargarInventario(); // Refresca la lista de inmediato
    }
  } catch (error) {
    console.error("Error guardando producto:", error);
  }
};

// Borrar prenda de MySQL (Eliminación)
const eliminarProductoCatalogo = async (id) => {
  if (!confirm("¿Está seguro de que desea eliminar este producto de la tienda de forma permanente?")) return;
  
  try {
    const respuesta = await fetch(`http://localhost:8080/servidor_nana/productos/${id}`, {
      method: 'DELETE'
    });
    if (respuesta.ok) {
      alert("Producto removido exitosamente.");
      cargarInventario();
    }
  } catch (error) {
    console.error("Error Birds o eliminando producto:", error);
  }
};

onMounted(() => {
  cargarInventario();
});
</script>
