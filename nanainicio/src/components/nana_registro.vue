<template>
  <div class="w-full bg-[#c8d695] px-4">
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
            autocomplete="off"
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
          class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-16 rounded-lg shadow-lg transition-all active:scale-95 text-lg"
        >
          Registro
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formulario = ref({
  nombre: '',
  apellido: '',
  cedula: '',
  fechaNacimiento: '',
  email: '',
  celular: '',
  direccion: '',
  ciudad: '',
  departamento: ''
});

const mensajeExito = ref('');
const mensajeError = ref('');

const manejarRegistro = async () => {
  mensajeExito.value = '';
  mensajeError.value = '';

  // Validamos que se haya seleccionado una fecha
  if (!formulario.value.fechaNacimiento) {
    mensajeError.value = "Por favor, seleccione su fecha de nacimiento.";
    return;
  }

  // Creamos el paquete de datos en el formato exacto que espera extraerJson en Java
  const datosRegistro = {
    nombre: formulario.value.nombre,
    apellido: formulario.value.apellido,
    cedula: formulario.value.cedula,
    fechaNacimiento: formulario.value.fechaNacimiento,
    email: formulario.value.email,
    celular: formulario.value.celular,
    direccion: formulario.value.direccion,
    ciudad: formulario.value.ciudad,
    departamento: formulario.value.departamento,
    contrasenia: "123456" // Contraseña temporal por defecto para la prueba
  };

  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicamos que enviamos JSON puro
      },
      body: JSON.stringify(datosRegistro)
    });

    if (respuesta.ok) {
      mensajeExito.value = "Se envió a su email la confirmación";
      // Limpiar formulario al terminar con éxito
      Object.keys(formulario.value).forEach(key => formulario.value[key] = '');
    } else {
      mensajeError.value = "Hubo un problema al procesar el registro en el servidor.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    mensajeError.value = "No se pudo conectar con el servidor de Java.";
  }
};


</script>
