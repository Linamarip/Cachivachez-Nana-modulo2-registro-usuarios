<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16 text-left">
    <!-- Encabezado de Identificación del Usuario Dinámico -->
    <div class="max-w-6xl mx-auto mb-6 text-sm font-bold text-gray-800 flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5">
          <span>👤</span> Cliente: {{ nombreUsuarioActivo }}
        </span>
        <span class="text-xs text-gray-700 bg-white/60 px-3 py-1 rounded-full border border-gray-200">
          📧 {{ correoUsuarioActivo }}
        </span>
      </div>
      <span class="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
        Pedido Activo en Tránsito 🚚
      </span>
    </div>

    <!-- Contenedor Principal (Dos Columnas del Prototipo) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto bg-white/60 p-8 rounded-[2rem] backdrop-blur-sm shadow-xl border border-white/40">
      
      <!-- COLUMNA IZQUIERDA: ESTADO DEL PEDIDO (Ocupa 2 columnas de ancho) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span class="bg-[#6b4e8b] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Rastreo Nacional en Tiempo Real
          </span>
          <h2 class="text-3xl font-black text-gray-800 mt-2">Seguimiento de Pedido</h2>
          <h3 class="text-2xl font-black text-purple-900 tracking-wide mt-1">Pedido # P2026-05-25</h3>
        </div>

        <!-- Línea de Tiempo de Estados -->
        <div class="flex flex-col gap-4 mt-2">
          <!-- Estado 1 -->
          <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-green-200">
            <span class="font-extrabold text-gray-800 flex items-center gap-2">🟢 Pedido Pagado</span>
            <span class="font-mono text-gray-600 font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">Confirmado</span>
          </div>

          <!-- Estado 2 -->
          <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-blue-200">
            <span class="font-extrabold text-gray-800 flex items-center gap-2">🚚 Pedido Despachado</span>
            <span class="font-mono text-gray-600 font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">En Bodega</span>
          </div>

          <!-- Estado 3 (Con Detalles de la Guía) -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-200 gap-3">
            <div class="flex flex-col gap-1">
              <span class="font-extrabold text-gray-800 flex items-center gap-2">📦 Recogido por Transportadora</span>
              <p class="text-xs text-purple-900 font-bold ml-6">Coordinadora Mercantil - Guía #123456789</p>
            </div>
            <div>
              <a 
                href="https://coordinadora.com" 
                target="_blank" 
                class="inline-block bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 text-xs tracking-wide text-center"
              >
                Seguir Transportadora ↗
              </a>
            </div>
          </div>

          <!-- Estado 4: Pendiente -->
          <div class="flex justify-between items-center bg-gray-50/70 p-4 rounded-2xl border border-dashed border-gray-300 opacity-70">
            <span class="font-bold text-gray-500 flex items-center gap-2">🏠 Pedido Entregado en Domicilio</span>
            <span class="font-mono text-gray-400 font-bold text-xs">En camino</span>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN DE ENVÍO REAL DEL USUARIO -->
      <div class="flex flex-col gap-4 text-left">
        <h4 class="text-lg font-black text-gray-800 flex items-center gap-2">
          <span>📍</span> Dirección de Envío
        </h4>
        
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-2 text-sm text-gray-700 font-medium">
          <p class="font-extrabold text-purple-900 text-base">{{ nombreUsuarioActivo }}</p>
          <p class="text-gray-800 font-semibold">{{ direccionUsuarioActivo }}</p>
          <p class="font-bold text-[#6b4e8b]">{{ ciudadUsuarioActivo }} - {{ deptoUsuarioActivo }}</p>
          
          <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col gap-1">
            <p><strong>Destino:</strong> Entrega a domicilio</p>
            <p><strong>Transportadora:</strong> Coordinadora Mercantil</p>
            <p><strong>Guía de Despacho:</strong> #123456789</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const nombreUsuarioActivo = computed(() => localStorage.getItem('usuarioNombre') || 'Mercedes Calpa');
const correoUsuarioActivo = computed(() => localStorage.getItem('usuarioEmail') || 'mercedes01@gmail.com');
const direccionUsuarioActivo = computed(() => localStorage.getItem('usuarioDireccion') || 'Cl. 12a #71c-60');
const ciudadUsuarioActivo = computed(() => localStorage.getItem('usuarioCiudad') || 'Pasto');
const deptoUsuarioActivo = computed(() => localStorage.getItem('usuarioDepartamento') || 'Nariño');
</script>
