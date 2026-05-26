<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12 text-left">
    <!-- Encabezado de Identificación del Usuario -->
    <div class="max-w-6xl mx-auto mb-6 text-sm font-semibold text-gray-700">
      Usuario: Lina María Rincón
    </div>

    <!-- Contenedor Principal (Dos Columnas del Prototipo) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto bg-white/40 p-8 rounded-[2rem] backdrop-blur-sm shadow-lg border border-white/20">
      
      <!-- COLUMNA IZQUIERDA: ESTADO DEL PEDIDO (Ocupa 2 columnas de ancho) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Seguimiento de Pedido</h2>
          <h3 class="text-2xl font-black text-gray-900 tracking-wide">Pedido # P2025-11-01</h3>
        </div>

        <!-- Línea de Tiempo de Estados -->
        <div class="flex flex-col gap-6 mt-4">
          <!-- Estado 1 -->
          <div class="flex justify-between items-center bg-white/80 p-4 rounded-2xl shadow-sm border border-gray-100">
            <span class="font-extrabold text-gray-800 flex items-center gap-2">🟢 Pedido Pagado</span>
            <span class="font-mono text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">2025-11-15</span>
          </div>

          <!-- Estado 2 -->
          <div class="flex justify-between items-center bg-white/80 p-4 rounded-2xl shadow-sm border border-gray-100">
            <span class="font-extrabold text-gray-800 flex items-center gap-2">🚚 Pedido Despachado</span>
            <span class="font-mono text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">2025-11-16</span>
          </div>

          <!-- Estado 3 (Con Detalles de la Guía) -->
          <div class="flex justify-between items-start bg-white/80 p-4 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex flex-col gap-1">
              <span class="font-extrabold text-gray-800 flex items-center gap-2">📦 Recogido por Transportadora</span>
              <p class="text-xs text-purple-900 font-bold ml-6">Coordinadora - Guía #123456789</p>
            </div>
            <span class="font-mono text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">2025-11-17</span>
          </div>

          <!-- Botón de Seguir Transportadora (De tu dibujo) -->
          <div class="ml-6">
            <a 
              href="https://coordinadora.com" 
              target="_blank" 
              class="inline-block bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 text-sm tracking-wide text-center"
            >
              Seguir Transportadora
            </a>
          </div>

          <!-- Estado 4: Pendiente -->
          <div class="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-300 opacity-60">
            <span class="font-bold text-gray-500 flex items-center gap-2">🏠 Pedido Entregado</span>
            <span class="font-mono text-gray-400 font-bold">__________</span>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN DE ENVÍO -->
      <div class="flex flex-col gap-4">
        <h4 class="text-lg font-bold text-gray-800">Dirección de envío</h4>
        
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-1 text-sm text-gray-700 font-medium">
          <p class="font-extrabold text-gray-900 text-base mb-1">Calle 153 #23-41</p>
          <p>Pereira</p>
          <p class="font-bold text-[#6b4e8b]">Risaralda</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Módulo visual estático fiel al prototipo solicitado
</script>
