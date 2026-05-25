<template>
  <div class="w-full bg-[#c8d695] px-4 pb-12">
    <!-- Título del Módulo -->
    <h2 class="text-3xl font-bold mb-6 text-gray-800 text-left">Registro</h2>
    
    <!-- Mensajes de Estado Dinámicos -->
    <div v-if="mensajeExito" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
      {{ mensajeExito }}
    </div>
    <div v-if="mensajeError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
      {{ mensajeError }}
    </div>

    <!-- Formulario estructurado en Grid -->
    <form @submit.prevent="manejarRegistro" autocomplete="off" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
      
      <!-- COLUMNA IZQUIERDA -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Nombre</label>
          <input 
            v-model="formulario.nombre"
            type="text" 
            placeholder="nombre" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Apellido</label>
          <input 
            v-model="formulario.apellido"
            type="text" 
            placeholder="apellido" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Número de Cédula</label>
          <input 
            v-model="formulario.cedula"
            type="text" 
            placeholder="cédula sin puntos ni coma" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Fecha de nacimiento</label>
          <input 
            v-model="formulario.fechaNacimiento"
            type="date" 
            required
            class="bg-[#8fa15b] text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Email</label>
          <input 
            v-model="formulario.email"
            type="email" 
            placeholder="email@email.com" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Celular</label>
          <input 
            v-model="formulario.celular"
            type="tel" 
            placeholder="Ej: 3001234567" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-gray-700">Dirección</label>
          <input 
            v-model="formulario.direccion"
            type="text" 
            placeholder="Dirección de residencia" 
            required
            class="bg-[#8fa15b] placeholder-gray-200 text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700">Ciudad</label>
            <input 
              v-model="formulario.ciudad"
              type="text" 
              required
              class="bg-[#8fa15b] text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700">Departamento</label>
            <input 
              v-model="formulario.departamento"
              type="text" 
              required
              class="bg-[#8fa15b] text-white rounded-lg p-3 outline-none border border-transparent focus:border-white shadow-inner w-full" 
            />
          </div>
        </div>
      </div>

      <!-- BOTÓN INFERIOR -->
      <div class="md:col-span-2 flex flex-col items-center mt-6">
        <button 
          type="submit" 
          class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-16 rounded-lg shadow-lg transition-all active:scale-95 text-lg cursor-pointer"
        >
          Registro
        </button>
      </div>
    </form>

    <!-- TABLA DE CONTROL CRUD (CONSULTA Y ELIMINACIÓN) -->
    <div class="mt-12 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-full overflow-hidden">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 text-left">Usuarios Registrados (Control CRUD)</h3>
      
      <div class="overflow-x-auto rounded-xl border border-gray-100">
        <table class="w-full text-left border-collapse text-sm">
          <thead class="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-100">
            <tr>
              <th class="p-4">Nombre Completo</th>
              <th class="p-4">Cédula</th>
              <th class="p-4">Email</th>
              <th class="p-4">Celular</th>
              <th class="p-4">Ciudad</th>
              <th class="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-600">
            <tr v-for="user in listaUsuarios" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 font-semibold text-gray-800">{{ user.nombre }} {{ user.apellido }}</td>
              <td class="p-4">{{ user.cedula }}</td>
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4">{{ user.celular }}</td>
              <td class="p-4">{{ user.ciudad }}</td>
              <td class="p-4 text-center">
                <button @click="eliminarUsuario(user.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow transition-all active:scale-95 cursor-pointer">
                  Eliminar 🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const formulario = ref({
  nombre: '', apellido: '', cedula: '', fechaNacimiento: '',
  email: '', celular: '', direccion: '', ciudad: '', departamento: ''
});

const mensajeExito = ref('');
const mensajeError = ref('');
const listaUsuarios = ref([]);

// Obtener usuarios de MySQL (Consulta CRUD)
const obtenerUsuarios = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/usuarios');
    if (respuesta.ok) {
      listaUsuarios.value = await respuesta.json();
    }
  } catch (error) {
    console.error("Error consultando usuarios:", error);
  }
};

// Eliminar usuario de MySQL (Eliminación CRUD)
const eliminarUsuario = async (id) => {
  if (!confirm("¿Está seguro de que desea eliminar este usuario de forma permanente?")) return;
  
  try {
    const respuesta = await fetch(`http://localhost:8080/servidor_nana/usuarios/${id}`, {
      method: 'DELETE'
    });
    if (respuesta.ok) {
      alert("Usuario eliminado correctamente.");
      obtenerUsuarios();
    }
  } catch (error) {
    console.error("Error eliminando usuario:", error);
  }
};

// Insertar datos de registro (Inserción CRUD)
const manejarRegistro = async () => {
  mensajeExito.value = '';
  mensajeError.value = '';

  if (!formulario.value.fechaNacimiento) {
    mensajeError.value = "Por favor, seleccione su fecha de nacimiento.";
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/registro', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formulario.value)
    });

    if (respuesta.ok) {
      mensajeExito.value = "Se envió a su email la confirmación";
      Object.keys(formulario.value).forEach(key => formulario.value[key] = '');
      obtenerUsuarios();
    } else {
      mensajeError.value = "Hubo un problema al procesar el registro en el servidor.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    mensajeError.value = "No se pudo conectar con el servidor.";
  }
};

onMounted(() => {
  obtenerUsuarios();
});
</script>
