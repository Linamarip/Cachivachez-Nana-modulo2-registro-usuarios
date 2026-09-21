<template>
  <div class="w-full bg-[#c8d695] px-4 pb-16">
    <!-- Título del Módulo -->
    <div class="max-w-4xl mx-auto mb-6 text-left">
      <span class="bg-white/80 text-[#6b4e8b] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
        Nuevo Cliente
      </span>
      <h2 class="text-3xl font-black text-gray-800 mt-2">Registro de Usuarios</h2>
      <p class="text-sm text-gray-700 font-medium">Completa tus datos para crear tu cuenta en Cachivaches NANA</p>
    </div>
    
    <!-- Mensajes de Estado Dinámicos -->
    <div class="max-w-4xl mx-auto mb-4">
      <div v-if="mensajeExito" class="p-4 bg-green-100 border border-green-300 text-green-800 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fadeIn">
        <span class="text-xl">✅</span>
        <span>{{ mensajeExito }}</span>
      </div>
      <div v-if="mensajeError" class="p-4 bg-red-100 border border-red-300 text-red-800 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fadeIn">
        <span class="text-xl">⚠️</span>
        <span>{{ mensajeError }}</span>
      </div>
    </div>

    <!-- Formulario estructurado en Grid -->
    <form @submit.prevent="manejarRegistro" autocomplete="off" class="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-left">
      
      <!-- COLUMNA IZQUIERDA -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Nombre *</label>
          <input 
            v-model="formulario.nombre"
            type="text" 
            placeholder="Tu nombre completo" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Apellido *</label>
          <input 
            v-model="formulario.apellido"
            type="text" 
            placeholder="Tus apellidos" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Número de Cédula *</label>
          <input 
            v-model="formulario.cedula"
            type="text" 
            placeholder="Cédula sin puntos ni comas" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner font-mono" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Fecha de Nacimiento *</label>
          <input 
            v-model="formulario.fechaNacimiento"
            type="date" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Correo Electrónico (Email) *</label>
          <input 
            v-model="formulario.email"
            type="email" 
            placeholder="ejemplo@correo.com" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>

        <!-- Contraseña con toggle para ver/ocultar -->
        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Contraseña de Acceso *</label>
          <div class="relative flex items-center">
            <input 
              v-model="contraseniaUsuario"
              :type="mostrarPassword ? 'text' : 'password'" 
              placeholder="Mínimo 6 caracteres" 
              required
              class="bg-gray-50 text-gray-800 rounded-xl p-3 pr-10 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner w-full" 
            />
            <button 
              type="button"
              @click="mostrarPassword = !mostrarPassword" 
              class="absolute right-3 text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {{ mostrarPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Celular / WhatsApp *</label>
          <input 
            v-model="formulario.celular"
            type="tel" 
            placeholder="Ej: 3001234567" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-xs">Dirección de Residencia *</label>
          <input 
            v-model="formulario.direccion"
            type="text" 
            placeholder="Calle, carrera, número, apartamento" 
            required
            class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Ciudad *</label>
            <input 
              v-model="formulario.ciudad"
              type="text" 
              placeholder="Ej: Bello"
              required
              class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Departamento *</label>
            <input 
              v-model="formulario.departamento"
              type="text" 
              placeholder="Ej: Antioquia"
              required
              class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
            />
          </div>
        </div>
      </div>

      <!-- BOTÓN INFERIOR -->
      <div class="md:col-span-2 flex flex-col items-center mt-6">
        <button 
          type="submit" 
          :disabled="cargando"
          class="bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-400 text-white font-bold py-3.5 px-16 rounded-2xl shadow-lg transition-all active:scale-95 text-base cursor-pointer uppercase tracking-wider flex items-center gap-2"
        >
          <span v-if="cargando">Procesando...</span>
          <span v-else>Completar Registro 🚀</span>
        </button>
      </div>
    </form>

    <!-- TABLA DE CONTROL Y EVALUACIÓN (Para pruebas SENA) -->
    <div class="max-w-4xl mx-auto mt-10">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-black text-gray-800 flex items-center gap-2">
          <span>👥</span> Usuarios Registrados en MySQL
        </h3>
        <button 
          type="button" 
          @click="mostrarTablaUsuarios = !mostrarTablaUsuarios"
          class="text-xs text-[#6b4e8b] underline font-bold hover:text-[#5a3f75] cursor-pointer"
        >
          {{ mostrarTablaUsuarios ? 'Ocultar Lista ▲' : 'Mostrar Lista (' + listaUsuarios.length + ') ▼' }}
        </button>
      </div>

      <div v-if="mostrarTablaUsuarios" class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
        <div class="overflow-x-auto rounded-xl border border-gray-100">
          <table class="w-full text-left border-collapse text-xs">
            <thead class="bg-gray-50 text-gray-700 uppercase text-[11px] font-black border-b border-gray-100">
              <tr>
                <th class="p-3">Nombre</th>
                <th class="p-3">Cédula</th>
                <th class="p-3">Email</th>
                <th class="p-3">Celular</th>
                <th class="p-3">Ciudad</th>
                <th class="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-600">
              <tr v-for="user in listaUsuarios" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="p-3 font-bold text-gray-800">{{ user.nombre }} {{ user.apellido || '' }}</td>
                <td class="p-3 font-mono">{{ user.cedula || 'N/A' }}</td>
                <td class="p-3 text-purple-900 font-semibold">{{ user.email }}</td>
                <td class="p-3">{{ user.celular || 'N/A' }}</td>
                <td class="p-3">{{ user.ciudad || 'Bello' }}</td>
                <td class="p-3 text-center">
                  <button 
                    type="button"
                    @click="eliminarUsuario(user.id)" 
                    class="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1 px-3 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
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
import { ref, onMounted } from 'vue';

const formulario = ref({
  nombre: '',
  apellido: '',
  cedula: '',
  fechaNacimiento: '',
  email: '',
  celular: '',
  direccion: '',
  ciudad: 'Bello',
  departamento: 'Antioquia'
});

const contraseniaUsuario = ref('');
const mostrarPassword = ref(false);
const mensajeExito = ref('');
const mensajeError = ref('');
const cargando = ref(false);
const mostrarTablaUsuarios = ref(true);
const listaUsuarios = ref([]);

// Consultar usuarios de MySQL
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

// Eliminar usuario
const eliminarUsuario = async (id) => {
  if (!confirm("¿Está seguro de que desea eliminar este usuario de la base de datos?")) return;
  
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

// Registro de usuario
const manejarRegistro = async () => {
  mensajeExito.value = '';
  mensajeError.value = '';
  cargando.value = true;

  if (!formulario.value.fechaNacimiento) {
    mensajeError.value = "Por favor, seleccione su fecha de nacimiento.";
    cargando.value = false;
    return;
  }

  if (contraseniaUsuario.value.length < 6) {
    mensajeError.value = "La contraseña debe tener mínimo 6 caracteres.";
    cargando.value = false;
    return;
  }

  try {
    const datosEnvio = {
      ...formulario.value,
      contraseniaUsuario: contraseniaUsuario.value
    };

    const respuesta = await fetch('http://localhost:8080/servidor_nana/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosEnvio)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      mensajeExito.value = "¡Usuario registrado correctamente! Se guardó en la base de datos MySQL.";
      // Limpiar todos los campos incluido el password
      formulario.value = {
        nombre: '', apellido: '', cedula: '', fechaNacimiento: '',
        email: '', celular: '', direccion: '', ciudad: 'Bello', departamento: 'Antioquia'
      };
      contraseniaUsuario.value = '';
      obtenerUsuarios();
    } else {
      mensajeError.value = resultado.error || "Hubo un problema al procesar el registro en el servidor.";
    }
  } catch (error) {
    console.error("Error de red en registro:", error);
    mensajeError.value = "No se pudo conectar con el servidor backend en http://localhost:8080.";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  obtenerUsuarios();
});
</script>
