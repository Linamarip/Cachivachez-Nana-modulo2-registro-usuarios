<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16 relative">
    <!-- Título Principal -->
    <div class="max-w-6xl mx-auto mb-6 text-left">
      <h2 class="text-3xl font-black text-gray-800">Pasarela de Pagos</h2>
      <p class="text-sm text-gray-700 font-medium">Selecciona tu método de pago preferido para finalizar tu orden de compra</p>
    </div>

    <!-- Contenedor Principal en Dos Columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: DETALLES Y MÉTODOS DE PAGO -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Cuadro de Datos del Pedido con Desglose -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📦</span> Resumen de la Orden
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Número de Pedido</p>
              <p class="text-base font-black text-gray-800 mt-1"># P2026-NANA-{{ Math.floor(1000 + Math.random() * 9000) }}</p>
            </div>
            
            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Prendas</p>
              <p class="text-base font-black text-gray-700 mt-1">
                ${{ Math.max(0, (totalPedido - 15000)).toLocaleString('es-CO') }}
              </p>
            </div>

            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Costo de Envío</p>
              <p class="text-base font-black text-gray-700 mt-1">$15.000</p>
            </div>
          </div>

          <div class="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center px-6">
            <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Neto a Pagar:</span>
            <span class="text-2xl font-black text-[#6b4e8b]">${{ totalPedido.toLocaleString('es-CO') }}</span>
          </div>
        </div>

        <!-- Cuadro de Selección de Método de Pago -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Seleccione su Método de Pago</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              type="button"
              @click="metodoSeleccionado = 'Contraentrega'"
              :class="metodoSeleccionado === 'Contraentrega' ? 'border-[#6b4e8b] bg-[#6b4e8b]/10 ring-2 ring-[#6b4e8b]' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-3xl mb-2">💵</span>
              <span class="font-extrabold text-gray-800">Pago Contraentrega</span>
              <span class="text-xs text-gray-500 mt-1 text-center">Paga en efectivo cuando la transportadora entregue tu pedido</span>
            </button>

            <button 
              type="button"
              @click="metodoSeleccionado = 'Transferencia'"
              :class="metodoSeleccionado === 'Transferencia' ? 'border-[#6b4e8b] bg-[#6b4e8b]/10 ring-2 ring-[#6b4e8b]' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-3xl mb-2">📲</span>
              <span class="font-extrabold text-gray-800">Transferencia Bancaria</span>
              <span class="text-xs text-gray-500 mt-1 text-center">Bancolombia, Nequi o Daviplata</span>
            </button>
          </div>

          <div v-if="metodoSeleccionado" class="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 text-sm font-medium text-purple-900 animate-fadeIn">
            <p v-if="metodoSeleccionado === 'Contraentrega'">
              👉 <strong>Modo Contraentrega:</strong> Recuerda tener el monto en efectivo exacto ($ {{ totalPedido.toLocaleString('es-CO') }}) cuando arribe el transportador.
            </p>
            <p v-else>
              👉 <strong>Modo Transferencia:</strong> Podrás subir tu comprobante de pago o captura de pantalla inmediatamente para validación por nuestro equipo de despacho.
            </p>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: CONFIRMACIÓN Y ENVÍO -->
      <div class="flex flex-col gap-6 text-left">
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>📍</span> Datos de Entrega
            </h3>
            <button 
              type="button" 
              @click="editandoDireccion = !editandoDireccion" 
              class="text-xs font-bold text-[#6b4e8b] underline hover:text-[#5a3f75] cursor-pointer"
            >
              {{ editandoDireccion ? 'Cancelar' : 'Modificar ✏️' }}
            </button>
          </div>

          <!-- Muestra información activa de entrega -->
          <div v-if="!editandoDireccion" class="bg-[#8fa15b]/20 p-4 rounded-xl border border-[#8fa15b]/30">
            <p class="font-bold text-gray-800 text-sm">👤 Destinatario: {{ correoActivo }}</p>
            <p class="text-xs text-gray-600 mt-1">🏠 Dirección: {{ direccionRealPedido }}</p>
            <p class="text-xs text-gray-600 font-semibold mt-0.5">📍 Ubicación: {{ ciudadBase }} - {{ deptoBase }}</p>
          </div>

          <!-- Mini formulario de edición rápida -->
          <div v-else class="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <p class="text-xs text-purple-900 font-bold mb-1">✏️ Actualizar datos de entrega:</p>
            <input v-model="correoActivo" type="text" placeholder="Nombre completo" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="direccionRealPedido" type="text" placeholder="Dirección completa" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="ciudadBase" type="text" placeholder="Ciudad" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="deptoBase" type="text" placeholder="Departamento" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <button 
              type="button" 
              @click="guardarCambiosDireccion" 
              class="bg-[#8fa15b] hover:bg-[#7a8c4e] text-white text-xs font-bold py-2 rounded-lg mt-1 transition-all cursor-pointer"
            >
              Guardar Cambios 💾
            </button>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-2">Finalizar Pedido</h3>
            <p class="text-xs text-gray-500 leading-relaxed mb-4">
              Al confirmar, tu orden será procesada por nuestro sistema y podrás hacer seguimiento en tiempo real de tu envío.
            </p>
          </div>

          <button 
            type="button"
            @click="manejarConfirmacionBoton"
            :disabled="!metodoSeleccionado || editandoDireccion" 
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm tracking-wide uppercase mt-4 cursor-pointer"
          >
            Confirmar y Pagar
          </button>
        </div>
      </div>
    </div>

    <!-- VENTANA EMERGENTE (MODAL) PARA TRANSFERENCIA BANCARIA -->
    <div v-if="mostrarModalTransferencia" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-white rounded-[2rem] max-w-lg w-full p-6 shadow-2xl text-left border border-gray-100">
        <h3 class="text-2xl font-black text-gray-800 mb-2 flex items-center gap-2">
          <span>📲</span> Soporte de Transferencia
        </h3>
        <p class="text-xs text-gray-500 mb-4">
          Realiza tu transferencia por el valor exacto de <span class="font-bold text-[#6b4e8b]">${{ totalPedido.toLocaleString('es-CO') }}</span> y adjunta tu comprobante abajo.
        </p>
        
        <!-- Cuentas Bancarias Oficiales -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2 text-sm text-gray-700 font-semibold mb-5">
          <div class="flex justify-between"><span>🏦 Bancolombia Ahorros:</span> <span class="text-gray-900 font-mono font-bold"># 456-789012-34</span></div>
          <div class="flex justify-between"><span>📱 Nequi / Daviplata:</span> <span class="text-gray-900 font-mono font-bold">300 010 2030</span></div>
          <div class="flex justify-between text-xs text-gray-400 mt-1"><span>Titular:</span> <span>Cachivaches NANA S.A.S - NIT 901.452.887-1</span></div>
        </div>

        <!-- Carga de Comprobante -->
        <div class="flex flex-col gap-2 mb-6">
          <label class="font-bold text-xs text-gray-700">Adjuntar comprobante (Foto / Pantallazo):</label>
          <input 
            type="file" 
            accept="image/*, .pdf" 
            @change="manejarCargaImagen" 
            class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#6b4e8b]/10 file:text-[#6b4e8b] file:hover:bg-[#6b4e8b]/20 cursor-pointer text-xs text-gray-500"
          />
          
          <div v-if="vistaPreviaImagen" class="mt-3 w-full h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 overflow-hidden flex items-center justify-center p-2">
            <img :src="vistaPreviaImagen" class="max-h-full max-w-full object-contain rounded-lg shadow-sm" alt="Vista previa del recibo" />
          </div>
        </div>

        <!-- Acciones del Modal -->
        <div class="flex gap-3 justify-end">
          <button 
            type="button" 
            @click="mostrarModalTransferencia = false" 
            class="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button"
            @click="enviarComprobanteFinal"
            :disabled="!vistaPreviaImagen" 
            class="px-6 py-2.5 rounded-xl bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            Enviar Comprobante 🚀
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  totalPedido: {
    type: Number,
    default: 0
  },
  onConfirmarPedido: {
    type: Function,
    default: () => {}
  }
});

const correoActivo = ref('Cliente Activo');
const direccionRealPedido = ref('Calle 50 # 40-10');
const ciudadBase = ref('Bello');
const deptoBase = ref('Antioquia');

const metodoSeleccionado = ref('');
const editandoDireccion = ref(false);
const mostrarModalTransferencia = ref(false);
const vistaPreviaImagen = ref(null);

const cargarDatosSesion = () => {
  correoActivo.value = localStorage.getItem('usuarioNombre') || localStorage.getItem('usuarioEmail') || 'Cliente Activo';
  direccionRealPedido.value = localStorage.getItem('direccionPedidoActual') || localStorage.getItem('usuarioDireccion') || 'Calle 50 # 40-10';
  ciudadBase.value = localStorage.getItem('usuarioCiudad') || 'Bello';
  deptoBase.value = localStorage.getItem('usuarioDepartamento') || 'Antioquia';
};

onMounted(() => {
  cargarDatosSesion();
});

const guardarCambiosDireccion = () => {
  localStorage.setItem('usuarioNombre', correoActivo.value);
  localStorage.setItem('direccionPedidoActual', direccionRealPedido.value);
  localStorage.setItem('usuarioCiudad', ciudadBase.value);
  localStorage.setItem('usuarioDepartamento', deptoBase.value);
  editandoDireccion.value = false;
};

const manejarConfirmacionBoton = () => {
  if (metodoSeleccionado.value === 'Transferencia') {
    mostrarModalTransferencia.value = true;
  } else {
    alert(`¡Pedido confirmado con método Pago Contraentrega!\nSe despachará a la dirección: ${direccionRealPedido.value}`);
    if (props.onConfirmarPedido) props.onConfirmarPedido('Contraentrega');
  }
};

const manejarCargaImagen = (evento) => {
  const archivos = evento.target.files;
  if (archivos && archivos.length > 0) {
    vistaPreviaImagen.value = URL.createObjectURL(archivos[0]); 
  }
};

const enviarComprobanteFinal = () => {
  alert('¡Comprobante de pago recibido con éxito!\nNuestro equipo verificará la transacción y procederá con el despacho.');
  mostrarModalTransferencia.value = false;
  vistaPreviaImagen.value = null;
  
  if (props.onConfirmarPedido) {
    props.onConfirmarPedido('Transferencia Bancaria');
  }
};
</script>
