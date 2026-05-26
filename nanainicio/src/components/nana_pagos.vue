<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-12 relative">
    <!-- Título Principal -->
    <h2 class="text-3xl font-bold mb-8 text-gray-800 text-left">Pagos</h2>

    <!-- Contenedor Principal en Dos Columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <!-- COLUMNA IZQUIERDA: DETALLES Y MÉTODOS DE PAGO -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Cuadro de Datos del Pedido con Desglose -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">📦 Resumen de la Orden</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Número de Pedido</p>
              <p class="text-base font-black text-gray-800 mt-1"># P2026-05-25</p>
            </div>
            
            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Productos</p>
              <!-- Quitamos la barra invertida de aquí -->
              <p class="text-base font-black text-gray-700 mt-1">\${{ (totalPedido - 15000).toLocaleString('es-CO') }}</p>
            </div>

            <div class="bg-[#8fa15b]/10 p-4 rounded-2xl border border-[#8fa15b]/20">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Costo de Envío</p>
              <!-- Quitamos la barra invertida de aquí -->
              <p class="text-base font-black text-gray-700 mt-1">\$15.000</p>
            </div>
          </div>

          <div class="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center px-6">
            <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Neto a Pagar:</span>
            <span class="text-2xl font-black text-[#6b4e8b]">\${{ totalPedido.toLocaleString('es-CO') }}</span>
          </div>
        </div>

        <!-- Cuadro de Selección de Método de Pago -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Seleccione su Método de Pago</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              type="button"
              @click="metodoSeleccionado = 'Contraentrega'"
              :class="metodoSeleccionado === 'Contraentrega' ? 'border-[#6b4e8b] bg-[#6b4e8b]/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-3xl mb-2">💵</span>
              <span class="font-extrabold text-gray-800">Pago contra entrega</span>
              <span class="text-xs text-gray-500 mt-1 text-center">Paga en efectivo al recibir tu pedido</span>
            </button>

            <button 
              type="button"
              @click="metodoSeleccionado = 'Transferencia'"
              :class="metodoSeleccionado === 'Transferencia' ? 'border-[#6b4e8b] bg-[#6b4e8b]/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-3xl mb-2">📲</span>
              <span class="font-extrabold text-gray-800">Transferencia</span>
              <span class="text-xs text-gray-500 mt-1 text-center">Bancolombia, Nequi o Daviplata</span>
            </button>
          </div>

          <div v-if="metodoSeleccionado" class="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-gray-600">
            <p v-if="metodoSeleccionado === 'Contraentrega'">👉 Recuerda tener el dinero en efectivo exacto listo cuando llegue la transportadora.</p>
            <p v-else>👉 Al confirmar la orden, el sistema te mostrará las cuentas autorizadas para subir el soporte de tu pago.</p>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: ENVÍO Y CONFIRMACIÓN -->
      <div class="flex flex-col gap-6 text-left">
        <div class="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">📍 Confirmación de Envío</h3>
            <button type="button" @click="editandoDireccion = !editandoDireccion" class="text-xs font-bold text-[#6b4e8b] underline hover:text-[#5a3f75] cursor-pointer">
              {{ editandoDireccion ? 'Cancelar' : 'Modificar ✏️' }}
            </button>
          </div>

          <div v-if="!editandoDireccion" class="bg-[#8fa15b]/20 p-4 rounded-xl border border-[#8fa15b]/30">
            <p class="font-bold text-gray-800">{{ direccionEnvio.destinatario }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ direccionEnvio.nomenclatura }}</p>
            <p class="text-sm text-gray-600 font-semibold">{{ direccionEnvio.ciudad }} - {{ direccionEnvio.departamento }}</p>
          </div>

          <div v-else class="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input v-model="direccionEnvio.destinatario" type="text" placeholder="Nombre completo" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="direccionEnvio.nomenclatura" type="text" placeholder="Dirección y bloque" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="direccionEnvio.ciudad" type="text" placeholder="Ciudad" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <input v-model="direccionEnvio.departamento" type="text" placeholder="Departamento" class="p-2 border rounded-lg text-xs w-full bg-white outline-none" />
            <button type="button" @click="editandoDireccion = false" class="bg-[#8fa15b] text-white text-xs font-bold py-1.5 rounded-lg mt-1 hover:bg-[#7a8c4e]">Guardar Dirección 💾</button>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-3">Finalizar Orden</h3>
            <p class="text-xs text-gray-500 leading-relaxed mb-4">
              Al confirmar, se guardará el pedido con la dirección especificada. Su estado pasará al sistema de control de despachos de la tienda.
            </p>
          </div>

          <button 
            type="button"
            @click="manejarConfirmacionBoton"
            :disabled="!metodoSeleccionado || editandoDireccion" 
            class="w-full bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm tracking-wide uppercase cursor-pointer"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>

    <!-- 📲 VENTANA EMERGENTE (MODAL RECIPIENTE) PARA TRANSFERENCIA REALISTA -->
    <div v-if="mostrarModalTransferencia" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[2rem] max-w-lg w-full p-6 shadow-2xl text-left border border-gray-100">
        <h3 class="text-2xl font-black text-gray-800 mb-2 flex items-center gap-2">Soporte de Transferencia</h3>
        <!-- Quitamos la barra invertida de aquí -->
        <p class="text-xs text-gray-500 mb-4">Realiza tu pago por el valor exacto de <span class="font-bold text-[#6b4e8b]">\${{ totalPedido.toLocaleString('es-CO') }}</span> y sube el pantallazo abajo.</p>
        
        <!-- Datos Bancarios Simulados -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2 text-sm text-gray-700 font-semibold mb-5">
          <div class="flex justify-between"><span>🏦 Bancolombia (Ahorros):</span> <span class="text-gray-900 font-mono"># 456-789012-34</span></div>
          <div class="flex justify-between"><span>📱 Nequi / Daviplata:</span> <span class="text-gray-900 font-mono">300 010 2030</span></div>
          <div class="flex justify-between text-xs text-gray-400 mt-1"><span>Titular:</span> <span>Cachivaches NANA S.A.S</span></div>
        </div>

        <!-- Botón de carga de archivo -->
        <div class="flex flex-col gap-2 mb-6">
          <label class="font-bold text-sm text-gray-700">Suba la foto o captura del recibo:</label>
          <input 
            type="file" 
            accept="image/*, .pdf" 
            @change="manejarCargaImagen" 
            class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#6b4e8b]/10 file:text-[#6b4e8b] file:hover:bg-[#6b4e8b]/20 cursor-pointer text-xs text-gray-500"
          />
          
          <!-- Vista previa estática -->
          <div v-if="vistaPreviaImagen" class="mt-3 w-full h-32 bg-gray-100 rounded-xl border border-dashed border-gray-300 overflow-hidden flex items-center justify-center p-2">
            <img :src="vistaPreviaImagen" class="max-h-full max-w-full object-contain rounded-lg shadow-sm" />
          </div>
        </div>

                <!-- Botones de Acción del Modal -->
        <div class="flex gap-3 justify-end">
          <button type="button" @click="mostrarModalTransferencia = false" class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">Cancelar</button>
          <button 
            type="button"
            @click="enviarComprobanteFinal"
            :disabled="!vistaPreviaImagen" 
            class="px-6 py-2.5 rounded-xl bg-[#6b4e8b] hover:bg-[#5a3f75] disabled:bg-gray-300 text-white text-sm font-bold shadow-md cursor-pointer"
          >
            Enviar Comprobante 🚀
          </button>
        </div>
      </div>
    </div>
  </div>
</template> <!-- <-- AQUÍ SE CIERRA EL TEMPLATE QUE FALTABA -->

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  totalPedido: {
    type: Number,
    default: 105000 
  },
  onConfirmarPedido: Function
});

const metodoSeleccionado = ref('');
const editandoDireccion = ref(false);

const mostrarModalTransferencia = ref(false); 
const vistaPreviaImagen = ref(null);         

const direccionEnvio = ref({
  destinatario: 'Lina María Rincón',
  nomenclatura: 'Avenida Sur #23-45, Bloque 3',
  ciudad: 'Pereira',
  departamento: 'Risaralda'
});

const manejarConfirmacionBoton = () => {
  if (metodoSeleccionado.value === 'Transferencia') {
    mostrarModalTransferencia.value = true;
  } else {
    alert(`¡Pedido confirmado por Pago Contraentrega!\nEnvío listo hacia ${direccionEnvio.value.ciudad}.`);
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
  alert(`¡Comprobante recibido de forma exitosa!\nAsesores de Cachivaches NANA verificarán el ingreso en Bancolombia/Nequi.`);
  mostrarModalTransferencia.value = false;
  vistaPreviaImagen.value = null;
  
  if (props.onConfirmarPedido) {
    props.onConfirmarPedido('Transferencia (Verificación Pendiente)');
  }
};
</script>
