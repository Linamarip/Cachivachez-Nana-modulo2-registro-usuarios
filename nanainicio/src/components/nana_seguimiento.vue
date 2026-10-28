<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16 text-left">
    <!-- Encabezado de Identificación del Usuario Dinámico -->
    <div class="max-w-6xl mx-auto mb-6 text-sm font-bold text-gray-800 flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5">
          <span>👤</span> Cliente: {{ nombreUsuarioActivo }}
        </span>
        <span class="text-xs text-gray-700 bg-white/70 px-3 py-1 rounded-full border border-gray-200">
          📧 {{ correoUsuarioActivo }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          type="button"
          @click="cargarPedidos" 
          :disabled="cargando"
          class="bg-white/80 hover:bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-gray-200 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span :class="{'animate-spin': cargando}">🔄</span> Refrescar Pedidos
        </button>
        <button 
          type="button"
          @click="$emit('irAProductos')" 
          class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>🛍️</span> Ver Catálogo
        </button>
      </div>
    </div>

    <!-- SELECCIONADOR DE PEDIDO (SI HAY MÁS DE 1 O PARA CAMBIAR ENTRE ELLOS) -->
    <div class="max-w-6xl mx-auto mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">📦</span>
        <div>
          <h3 class="text-sm font-black text-gray-800">Tus Pedidos en Sistema</h3>
          <p class="text-xs text-gray-600">
            Total registrados: <strong>{{ listaPedidos.length }} pedido(s)</strong>. Selecciona para ver su rastreo en tiempo real:
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-xs font-bold text-gray-700 whitespace-nowrap">Rastrear:</label>
        <select 
          v-model="pedidoSeleccionadoId" 
          @change="alCambiarPedido"
          class="bg-white text-purple-900 text-xs font-black px-3 py-2 rounded-xl border border-purple-200 outline-none focus:ring-2 focus:ring-[#6b4e8b] shadow-sm cursor-pointer max-w-xs"
        >
          <option v-for="p in listaPedidos" :key="p.id || p.numero_pedido" :value="p.id || p.numero_pedido">
            {{ p.numero_pedido }} — ${{ Number(p.total || 0).toLocaleString('es-CO') }} ({{ p.estado }})
          </option>
        </select>
      </div>
    </div>

    <!-- Contenedor Principal (Dos Columnas) -->
    <div v-if="pedidoActual" class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto bg-white/75 p-6 sm:p-8 rounded-[2rem] backdrop-blur-sm shadow-xl border border-white/60">
      
      <!-- COLUMNA IZQUIERDA: ESTADO DEL PEDIDO Y LÍNEA DE TIEMPO (2 Columnas de ancho) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="bg-[#6b4e8b] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Rastreo Nacional en Tiempo Real
              </span>
              <span 
                :class="pedidoActual.estado === 'Entregado' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'"
                class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
              >
                {{ pedidoActual.estado === 'Entregado' ? '✅ Entregado' : '🚚 ' + pedidoActual.estado }}
              </span>
            </div>
            <h2 class="text-3xl font-black text-gray-800 mt-2">Seguimiento de Pedido</h2>
            <h3 class="text-2xl font-black text-purple-900 tracking-wide mt-1 font-mono">
              Pedido {{ pedidoActual.numero_pedido }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              Fecha de compra: <strong>{{ formatearFecha(pedidoActual.fecha_creacion) }}</strong> | Método de pago: <strong>{{ pedidoActual.metodo_pago || 'PSE' }}</strong>
            </p>
          </div>

          <!-- Botón de Simulación / Cambio de Estado -->
          <div class="shrink-0 flex flex-col gap-1 items-end">
            <span class="text-[10px] text-gray-400 font-bold uppercase">Estado de Entrega:</span>
            <button 
              type="button"
              @click="alternarEstadoEntrega" 
              :class="pedidoActual.estado === 'Entregado' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
              class="text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span v-if="pedidoActual.estado === 'Entregado'">🔄 Simular 'En Reparto'</span>
              <span v-else>✅ Marcar como 'Entregado'</span>
            </button>
          </div>
        </div>

        <!-- Línea de Tiempo de Estados -->
        <div class="flex flex-col gap-4 mt-1">
          <!-- Estado 1: Pagado -->
          <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-green-300">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black text-sm">✓</span>
              <div>
                <p class="font-extrabold text-gray-800">1. Pedido Pagado y Aprobado</p>
                <p class="text-xs text-gray-500">Transacción procesada correctamente por {{ pedidoActual.metodo_pago || 'Pasarela Segura' }}</p>
              </div>
            </div>
            <span class="font-mono text-gray-600 font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs border border-green-200">
              Confirmado
            </span>
          </div>

          <!-- Estado 2: Despachado -->
          <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-blue-300">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">✓</span>
              <div>
                <p class="font-extrabold text-gray-800">2. Pedido Despachado de Bodega</p>
                <p class="text-xs text-gray-500">Empacado, verificado y rotulado para despacho nacional</p>
              </div>
            </div>
            <span class="font-mono text-gray-600 font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200">
              Listo en Bodega
            </span>
          </div>

          <!-- Estado 3: Recogido por Transportadora -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-purple-300 gap-3">
            <div class="flex items-start gap-3">
              <span class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">✓</span>
              <div class="flex flex-col gap-0.5">
                <p class="font-extrabold text-gray-800">3. Recogido por Transportadora</p>
                <p class="text-xs text-purple-900 font-bold">
                  {{ pedidoActual.transportadora || 'Coordinadora Mercantil' }} — Guía #{{ pedidoActual.guia_despacho || '123456789' }}
                </p>
                <p class="text-[11px] text-gray-500">En ruta intermunicipal con destino a {{ pedidoActual.ciudad || 'tu ciudad' }}</p>
              </div>
            </div>
            <div>
              <a 
                href="https://coordinadora.com" 
                target="_blank" 
                class="inline-block bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs tracking-wide text-center"
              >
                Seguir Guía ↗
              </a>
            </div>
          </div>

          <!-- Estado 4: Pedido Entregado en Domicilio -->
          <div 
            v-if="pedidoActual.estado === 'Entregado'"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-green-50/90 p-5 rounded-2xl border-2 border-green-500 shadow-md gap-3 animate-fade-in"
          >
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-base shadow-sm">
                ✓
              </span>
              <div>
                <p class="font-black text-green-900 text-base flex items-center gap-1.5">
                  <span>🏠</span> 4. ¡Pedido Entregado con Éxito!
                </p>
                <p class="text-xs text-green-800 font-medium mt-0.5">
                  El paquete fue recibido a satisfacción en la dirección de destino. ¡Gracias por confiar en Cachivaches NANA!
                </p>
              </div>
            </div>
            <span class="font-black bg-green-600 text-white px-4 py-1.5 rounded-full text-xs shadow-sm self-start sm:self-center">
              ENTREGADO ✅
            </span>
          </div>

          <!-- Estado 4: En Tránsito (Aún no entregado) -->
          <div 
            v-else
            class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 opacity-80"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black text-xs">⏳</span>
              <div>
                <p class="font-bold text-gray-600">4. Pedido en Reparto hacia el Domicilio</p>
                <p class="text-xs text-gray-400">El mensajero está en camino a la dirección registrada</p>
              </div>
            </div>
            <span class="font-mono text-gray-500 font-bold text-xs bg-gray-200 px-3 py-1 rounded-full">
              En camino 🚚
            </span>
          </div>
        </div>

        <!-- Lista de Artículos del Pedido Seleccionado -->
        <div v-if="articulosPedido.length > 0" class="mt-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h4 class="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
            <span>🛍️</span> Artículos incluidos en este pedido ({{ articulosPedido.length }} prendas)
          </h4>
          <div class="divide-y divide-gray-100">
            <div v-for="(item, idx) in articulosPedido" :key="idx" class="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  <img :src="item.imagen_url ? obtenerImagenProducto(item.imagen_url, item.categoria) : obtenerImagenProducto('camiseta_olivo.jpg')" class="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <p class="font-bold text-gray-800">{{ item.nombre }}</p>
                  <p class="text-gray-500 text-[11px]">
                    Talla: <span class="font-bold text-purple-900">{{ item.tallaSeleccionada || item.talla || 'M' }}</span> | 
                    Color: <span class="font-bold text-purple-900">{{ item.colorSeleccionado || item.color || 'Original' }}</span> | 
                    Cant: <span class="font-bold">{{ item.cantidad || 1 }}</span>
                  </p>
                </div>
              </div>
              <p class="font-black text-gray-800">${{ Number(item.precio * (item.cantidad || 1)).toLocaleString('es-CO') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: DIRECCIÓN DE ENVÍO Y RESUMEN REAL DEL PEDIDO -->
      <div class="flex flex-col gap-4 text-left">
        <h4 class="text-lg font-black text-gray-800 flex items-center gap-2">
          <span>📍</span> Dirección de Entrega
        </h4>
        
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-2.5 text-sm text-gray-700 font-medium">
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase">Destinatario</p>
            <p class="font-extrabold text-purple-900 text-base">{{ pedidoActual.usuario_nombre || nombreUsuarioActivo }}</p>
            <p class="text-xs text-gray-500">{{ pedidoActual.usuario_email || correoUsuarioActivo }}</p>
          </div>
          
          <div class="pt-2 border-t border-gray-100">
            <p class="text-xs text-gray-400 font-bold uppercase">Dirección Física</p>
            <p class="text-gray-800 font-semibold">{{ pedidoActual.direccion_envio || direccionUsuarioActivo }}</p>
            <p class="font-bold text-[#6b4e8b]">{{ pedidoActual.ciudad || ciudadUsuarioActivo }} - {{ pedidoActual.departamento || deptoUsuarioActivo }}</p>
          </div>
          
          <div class="pt-2 border-t border-gray-100 text-xs text-gray-600 flex flex-col gap-1.5">
            <p><strong>Destino:</strong> Entrega a domicilio certificada</p>
            <p><strong>Transportadora:</strong> {{ pedidoActual.transportadora || 'Coordinadora Mercantil' }}</p>
            <p><strong>Guía de Despacho:</strong> #{{ pedidoActual.guia_despacho || '123456789' }}</p>
            <p><strong>Estado:</strong> 
              <span :class="pedidoActual.estado === 'Entregado' ? 'text-green-700 font-black' : 'text-blue-700 font-bold'">
                {{ pedidoActual.estado }}
              </span>
            </p>
          </div>

          <!-- Total del Pedido -->
          <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span class="text-xs font-bold text-gray-500 uppercase">Total Pagado:</span>
            <span class="text-lg font-black text-purple-900 font-mono">
              ${{ Number(pedidoActual.total || 0).toLocaleString('es-CO') }}
            </span>
          </div>
        </div>

        <!-- Banner de Ayuda o Soporte -->
        <div class="bg-[#f0f5dc] border border-[#a8bd5e] p-4 rounded-2xl text-xs text-[#4a581e]">
          <p class="font-black text-sm mb-1 flex items-center gap-1.5">
            <span>💬</span> ¿Necesitas ayuda con tu entrega?
          </p>
          <p class="leading-relaxed">
            Comunícate con soporte Cachivaches NANA al PBX <strong>(601) 300-8547</strong> o escribe a <strong>contacto@cachivachesnana.com</strong> indicando el número <strong>{{ pedidoActual.numero_pedido }}</strong>.
          </p>
        </div>
      </div>

    </div>

    <!-- Si no hay pedidos encontrados -->
    <div v-else class="max-w-2xl mx-auto bg-white/80 p-8 rounded-3xl text-center shadow-lg border border-white/60">
      <span class="text-5xl block mb-3">📦</span>
      <h3 class="text-xl font-black text-gray-800 mb-2">No se encontraron pedidos registrados</h3>
      <p class="text-xs text-gray-600 mb-6">
        No tienes pedidos activos asociados a tu cuenta en este momento. Agrega productos desde el catálogo y realiza tu compra para generar tu número de seguimiento.
      </p>
      <button 
        type="button" 
        @click="$emit('irAProductos')" 
        class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md cursor-pointer"
      >
        Ir a la Tienda 🛍️
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerImagenProducto } from '../utils/imagenes.js';

const emit = defineEmits(['irAProductos']);

const cargando = ref(false);
const listaPedidos = ref([]);
const pedidoSeleccionadoId = ref('');

const nombreUsuarioActivo = computed(() => localStorage.getItem('usuarioNombre') || 'Mercedes Calpa');
const correoUsuarioActivo = computed(() => localStorage.getItem('usuarioEmail') || 'mercedes01@gmail.com');
const direccionUsuarioActivo = computed(() => localStorage.getItem('usuarioDireccion') || 'Cl. 12a #71c-60');
const ciudadUsuarioActivo = computed(() => localStorage.getItem('usuarioCiudad') || 'Pasto');
const deptoUsuarioActivo = computed(() => localStorage.getItem('usuarioDepartamento') || 'Nariño');

// Pedido actualmente visualizado
const pedidoActual = computed(() => {
  if (!pedidoSeleccionadoId.value && listaPedidos.value.length > 0) {
    return listaPedidos.value[0];
  }
  return listaPedidos.value.find(p => (p.id || p.numero_pedido) === pedidoSeleccionadoId.value) || listaPedidos.value[0] || null;
});

// Artículos deserializados del pedido
const articulosPedido = computed(() => {
  if (!pedidoActual.value || !pedidoActual.value.items) return [];
  if (Array.isArray(pedidoActual.value.items)) return pedidoActual.value.items;
  try {
    return JSON.parse(pedidoActual.value.items);
  } catch (e) {
    return [];
  }
});

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '28/10/2026';
  try {
    const f = new Date(fechaStr);
    return f.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return fechaStr;
  }
};

// Cargar pedidos desde el servidor backend MySQL
const cargarPedidos = async () => {
  cargando.value = true;
  try {
    const email = correoUsuarioActivo.value;
    let url = 'http://localhost:8080/servidor_nana/pedidos';
    
    // Intentar buscar los pedidos del usuario específico primero
    if (email) {
      try {
        const resUser = await fetch(`http://localhost:8080/servidor_nana/pedidos/usuario/${encodeURIComponent(email)}`);
        if (resUser.ok) {
          const pedidosUser = await resUser.json();
          if (Array.isArray(pedidosUser) && pedidosUser.length > 0) {
            listaPedidos.value = pedidosUser;
            seleccionarPedidoInicial();
            cargando.value = false;
            return;
          }
        }
      } catch (err) {
        console.warn("Fallo al buscar por usuario, consultando todos los pedidos:", err);
      }
    }

    // Si no hay por usuario, consultar todos los pedidos de la base de datos
    const respuesta = await fetch(url);
    if (respuesta.ok) {
      const data = await respuesta.json();
      if (Array.isArray(data) && data.length > 0) {
        listaPedidos.value = data;
      } else {
        // Fallback demostrativo predeterminado
        generarPedidosPorDefecto();
      }
    } else {
      generarPedidosPorDefecto();
    }
  } catch (error) {
    console.error("Error al cargar pedidos del servidor:", error);
    generarPedidosPorDefecto();
  } finally {
    seleccionarPedidoInicial();
    cargando.value = false;
  }
};

// Pedidos predeterminados de respaldo si la base de datos aún no tiene registros
const generarPedidosPorDefecto = () => {
  listaPedidos.value = [
    {
      id: 1,
      numero_pedido: '#2026-10-00001',
      usuario_email: correoUsuarioActivo.value,
      usuario_nombre: nombreUsuarioActivo.value,
      direccion_envio: direccionUsuarioActivo.value,
      ciudad: ciudadUsuarioActivo.value,
      departamento: deptoUsuarioActivo.value,
      metodo_pago: 'PSE / Bancolombia',
      total: 185000,
      estado: 'Entregado',
      guia_despacho: '984512304',
      transportadora: 'Coordinadora Mercantil',
      fecha_creacion: new Date().toISOString(),
      items: [
        { nombre: 'Camiseta Olivo M-C', categoria: 'Adidas', tallaSeleccionada: 'M', colorSeleccionado: 'Olivo', cantidad: 1, precio: 85000, imagen_url: 'camiseta_olivo.jpg' },
        { nombre: 'Buso Urbano Deportivo', categoria: 'Adidas', tallaSeleccionada: 'L', colorSeleccionado: 'Negro', cantidad: 1, precio: 100000, imagen_url: 'buso.jpg' }
      ]
    },
    {
      id: 2,
      numero_pedido: '#2026-10-00002',
      usuario_email: correoUsuarioActivo.value,
      usuario_nombre: nombreUsuarioActivo.value,
      direccion_envio: direccionUsuarioActivo.value,
      ciudad: ciudadUsuarioActivo.value,
      departamento: deptoUsuarioActivo.value,
      metodo_pago: 'Tarjeta de Crédito Visa',
      total: 335000,
      estado: 'En camino',
      guia_despacho: '984512305',
      transportadora: 'Coordinadora Mercantil',
      fecha_creacion: new Date().toISOString(),
      items: [
        { nombre: 'Morral Buzz Rosado', categoria: 'Puma', tallaSeleccionada: 'ÚNICA', colorSeleccionado: 'Rosado', cantidad: 1, precio: 185000, imagen_url: 'puma_morral_buzz.jpg' },
        { nombre: 'Tenis Urban Hype', categoria: 'Puma', tallaSeleccionada: '38', colorSeleccionado: 'Blanco', cantidad: 1, precio: 150000, imagen_url: 'puma_tenis_todohype.jpg' }
      ]
    }
  ];
};

const seleccionarPedidoInicial = () => {
  const ultimo = localStorage.getItem('ultimoPedidoNumero');
  if (ultimo && listaPedidos.value.some(p => p.numero_pedido === ultimo)) {
    const hallado = listaPedidos.value.find(p => p.numero_pedido === ultimo);
    pedidoSeleccionadoId.value = hallado.id || hallado.numero_pedido;
  } else if (listaPedidos.value.length > 0) {
    pedidoSeleccionadoId.value = listaPedidos.value[0].id || listaPedidos.value[0].numero_pedido;
  }
};

const alCambiarPedido = () => {
  if (pedidoActual.value) {
    localStorage.setItem('ultimoPedidoNumero', pedidoActual.value.numero_pedido);
  }
};

// Alternar entre 'Entregado' y 'En camino' en la base de datos en tiempo real
const alternarEstadoEntrega = async () => {
  if (!pedidoActual.value) return;
  const nuevoEstado = pedidoActual.value.estado === 'Entregado' ? 'En camino' : 'Entregado';

  try {
    const res = await fetch('http://localhost:8080/servidor_nana/pedidos/estado', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numero_pedido: pedidoActual.value.numero_pedido,
        estado: nuevoEstado
      })
    });

    if (res.ok) {
      pedidoActual.value.estado = nuevoEstado;
      alert(`Estado del pedido ${pedidoActual.value.numero_pedido} actualizado a: "${nuevoEstado}" en MySQL.`);
    } else {
      pedidoActual.value.estado = nuevoEstado; // Actualización visual local
      alert(`Estado visual actualizado a: "${nuevoEstado}".`);
    }
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    pedidoActual.value.estado = nuevoEstado;
    alert(`Estado visual actualizado a: "${nuevoEstado}".`);
  }
};

onMounted(() => {
  cargarPedidos();
});
</script>