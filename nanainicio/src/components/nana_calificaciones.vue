<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12 text-left">
    <!-- Título Principal -->
    <h2 class="text-3xl font-bold mb-8 text-gray-800">Calificaciones y Opiniones</h2>

    <!-- Contenedor de dos columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: FORMULARIO PARA DEJAR RESEÑA (1 Columna) -->
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-fit">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Danos tu opinión</h3>
        
        <form @submit.prevent="guardarOpinion" class="flex flex-col gap-4">
          <!-- Campo Nombre -->
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Tu Nombre</label>
            <input 
              v-model="nuevaOpinion.nombre" 
              type="text" 
              placeholder="Ej: Lina María Rincón" 
              required
              class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b]"
            />
          </div>

          <!-- Selector de Estrellas Interactivo -->
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Calificación</label>
            <div class="flex gap-2 text-2xl my-1">
              <span 
                v-for="estrella in 5" 
                :key="estrella"
                @click="nuevaOpinion.estrellas = estrella"
                class="cursor-pointer transition-transform active:scale-90"
              >
                {{ estrella <= nuevaOpinion.estrellas ? '⭐' : '☆' }}
              </span>
            </div>
          </div>

          <!-- Campo Comentario -->
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-gray-700 text-sm">Tu Comentario</label>
            <textarea 
              v-model="nuevaOpinion.comentario" 
              placeholder="¿Qué tal te pareció tu experiencia en Cachivaches NANA?" 
              rows="4"
              required
              class="bg-[#8fa15b]/20 text-gray-800 rounded-lg p-3 outline-none border border-transparent focus:border-[#8fa15b] resize-none"
            ></textarea>
          </div>

          <!-- Botón de Envío -->
          <button 
            type="submit"
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm uppercase tracking-wide cursor-pointer mt-2"
          >
            Enviar Reseña 🚀
          </button>
        </form>
      </div>

      <!-- COLUMNA DERECHA: LISTADO DE OPINIONES DE CLIENTES (2 Columnas) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Lo que dicen nuestros compradores</h3>
        
        <!-- Mensaje si no hay comentarios aún -->
        <div v-if="listaOpiniones.length === 0" class="bg-white rounded-3xl p-8 text-center shadow-md font-semibold text-gray-500">
          Aún no hay opiniones escritas. ¡Sé el primero en calificar tu compra!
        </div>

        <!-- Tarjetas de Comentarios Dinámicos -->
        <div 
          v-for="resenia in listaOpiniones" 
          :key="resenia.id" 
          class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-2 animate-fadeIn"
        >
          <div class="flex justify-between items-center">
            <span class="font-extrabold text-gray-800 text-base">{{ resenia.nombre_usuario }}</span>
            <span class="text-gray-400 text-xs font-mono font-bold">{{ formatearFecha(resenia.creado_en) }}</span>
          </div>

          <!-- Pinta las estrellas guardadas en la BD -->
          <div class="text-sm">
            <span v-for="e in resenia.estrellas" :key="e">⭐</span>
          </div>

          <p class="text-gray-600 text-sm mt-1 leading-relaxed italic">
            "{{ resenia.comentario }}"
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const listaOpiniones = ref([]);
const nuevaOpinion = ref({
  nombre: '',
  comentario: '',
  estrellas: 5 // Inicia con 5 estrellas por defecto
});

// Consultar opiniones en MySQL (Consulta CRUD)
const cargarOpiniones = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/calificaciones');
    if (respuesta.ok) {
      listaOpiniones.value = await respuesta.json();
    }
  } catch (error) {
    console.error("Error cargando calificaciones:", error);
  }
};

// Guardar opinión en MySQL (Inserción CRUD)
const guardarOpinion = async () => {
  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/calificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaOpinion.value)
    });

    if (respuesta.ok) {
      alert('¡Gracias por calificar a Cachivaches NANA!');
      // Limpiar el formulario
      nuevaOpinion.value = { nombre: '', comentario: '', estrellas: 5 };
      cargarOpiniones(); // Recarga la lista automáticamente
    }
  } catch (error) {
    console.error("Error al guardar opinión:", error);
  }
};

const formatearFecha = (textoFecha) => {
  if (!textoFecha) return '';
  return textoFecha.split('T')[0]; // Limpia la fecha para mostrar solo AAAA-MM-DD
};

onMounted(() => {
  cargarOpiniones();
});
</script>
