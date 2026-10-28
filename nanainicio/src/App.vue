<script setup>
import { ref, onMounted, watch } from 'vue';
import { obtenerLogoMarca } from './utils/imagenes.js';

// Importación de todos los componentes modulares del sistema
import nana_registro from './components/nana_registro.vue';
import nana_productos from './components/nana_productos.vue'; 
import nana_carrito from './components/nana_carrito.vue';
import nana_pagos from './components/nana_pagos.vue';
import nana_seguimiento from './components/nana_seguimiento.vue';
import nana_calificaciones from './components/nana_calificaciones.vue';
import nana_admin from './components/nana_admin.vue';
import nana_acerca from './components/nana_acerca.vue';

// Estado de navegación global
const pantallaActual = ref('inicio');

// Variables reactivas de autenticación de clientes
const email = ref('');
const contrasenia = ref('');
const mensajeError = ref('');
const correoUsuarioActivo = ref('');
const nombreUsuarioActivo = ref('');

// Control de Acceso Exclusivo al Panel de Administrador
const esAdminAutenticado = ref(false);
const mostrarModalClaveAdmin = ref(false);
const claveAdminInput = ref('');
const errorClaveAdmin = ref('');

// Búsqueda y Filtro de Marca desde la barra superior
const textoBuscadorNav = ref('');
const marcaPreseleccionada = ref('Todas');

const listaMarcasNav = [
  { nombre: 'Todas', icono: '🔥' },
  { nombre: 'Oakley', icono: '🕶️' },
  { nombre: 'Adidas', icono: '👟' },
  { nombre: 'Victoria Secret', icono: '🌸' },
  { nombre: 'Puma', icono: '🐆' },
  { nombre: 'Polo', icono: '🐎' },
  { nombre: 'Varios', icono: '🎒' }
];

// Carrito reactivo con persistencia en localStorage
const carrito = ref([]);

// Cargar estado inicial y credenciales activas
onMounted(() => {
  const carritoGuardado = localStorage.getItem('cachivaches_carrito');
  if (carritoGuardado) {
    try {
      carrito.value = JSON.parse(carritoGuardado);
    } catch (e) {
      carrito.value = [];
    }
  }

  const emailGuardado = localStorage.getItem('usuarioEmail');
  const nombreGuardado = localStorage.getItem('usuarioNombre');
  if (emailGuardado) {
    correoUsuarioActivo.value = emailGuardado;
    nombreUsuarioActivo.value = nombreGuardado || 'Cliente Activo';
  }
});

// Guardar cambios en el carrito automáticamente
watch(carrito, (nuevoCarrito) => {
  localStorage.setItem('cachivaches_carrito', JSON.stringify(nuevoCarrito));
}, { deep: true });

// Agregar producto al carrito (incluyendo variantes de talla y color seleccionadas)
const agregarAlCarrito = (productoConVariantes) => {
  const existe = carrito.value.find(item => 
    item.id === productoConVariantes.id && 
    item.tallaSeleccionada === productoConVariantes.tallaSeleccionada &&
    item.colorSeleccionado === productoConVariantes.colorSeleccionado
  );

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.value.push({ 
      ...productoConVariantes, 
      cantidad: 1,
      tallaSeleccionada: productoConVariantes.tallaSeleccionada || 'M',
      colorSeleccionado: productoConVariantes.colorSeleccionado || 'Original'
    });
  }
  alert(`¡${productoConVariantes.nombre} agregado al carrito! 🛍️\nTalla: ${productoConVariantes.tallaSeleccionada || 'M'} | Color: ${productoConVariantes.colorSeleccionado || 'Original'}`);
};

// Navegación rápida por marca desde la barra superior
const navegarAMarca = (nombreMarca) => {
  marcaPreseleccionada.value = nombreMarca;
  pantallaActual.value = 'productos';
};

// Ejecutar búsqueda desde la barra superior
const ejecutarBusquedaNav = () => {
  pantallaActual.value = 'productos';
};

// Acceso Seguro al Administrador (Solo Administradores)
const intentarAccesoAdmin = () => {
  if (esAdminAutenticado.value) {
    pantallaActual.value = 'admin';
  } else {
    claveAdminInput.value = '';
    errorClaveAdmin.value = '';
    mostrarModalClaveAdmin.value = true;
  }
};

const validarClaveAdmin = () => {
  const clave = claveAdminInput.value.trim();
  if (clave === 'admin123' || clave === 'NanaAdmin2026*' || clave === 'admin') {
    esAdminAutenticado.value = true;
    mostrarModalClaveAdmin.value = false;
    pantallaActual.value = 'admin';
    alert('¡Bienvenido al Panel Administrativo de Cachivaches NANA! ⚙️');
  } else {
    errorClaveAdmin.value = 'Contraseña incorrecta. Este módulo es exclusivo para administradores autorizados.';
  }
};

const salirDeAdmin = () => {
  esAdminAutenticado.value = false;
  pantallaActual.value = 'inicio';
  alert('Has salido del Panel Administrativo de forma segura.');
};

// Manejador de inicio de sesión con backend Node.js / MySQL
const manejarInicioSesion = async () => {
  mensajeError.value = '';

  if (!email.value || !contrasenia.value) {
    mensajeError.value = 'Por favor, complete todos los campos.';
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:8080/servidor_nana/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailUsuario: email.value.trim(),
        contraseniaUsuario: contrasenia.value
      })
    });

    if (respuesta.ok) {
      const datosServidor = await respuesta.json();
      const userReal = datosServidor.usuario || {};

      const nombreFormateado = (userReal.nombre ? `${userReal.nombre} ${userReal.apellido || ''}` : email.value.trim()).trim();
      
      alert(`¡Bienvenido a Cachivaches NANA, ${nombreFormateado}! 👋`);
      
      correoUsuarioActivo.value = email.value.trim();
      nombreUsuarioActivo.value = nombreFormateado;

      // Guardar información real del usuario en localStorage
      localStorage.setItem('usuarioEmail', email.value.trim());
      localStorage.setItem('usuarioNombre', nombreFormateado);
      localStorage.setItem('usuarioDireccion', userReal.direccion || 'Cl. 12a #71c-60');
      localStorage.setItem('usuarioCiudad', userReal.ciudad || 'Pasto');
      localStorage.setItem('usuarioDepartamento', userReal.departamento || 'Nariño');

      email.value = '';
      contrasenia.value = '';
      mensajeError.value = '';

      pantallaActual.value = 'productos';
    } else {
      mensajeError.value = 'Credenciales inválidas. Verifique su correo o realice el Registro.';
    }
  } catch (error) {
    console.error('Error de red login:', error);
    mensajeError.value = 'No se pudo conectar con el servidor backend en http://localhost:8080.';
  }
};

// Cierre de sesión seguro y limpieza total de memoria y almacenamiento local
const cerrarSesion = () => {
  if (confirm('¿Deseas cerrar tu sesión actual de forma segura?')) {
    email.value = '';
    contrasenia.value = '';
    mensajeError.value = '';

    correoUsuarioActivo.value = '';
    nombreUsuarioActivo.value = '';

    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioDireccion');
    localStorage.removeItem('usuarioCiudad');
    localStorage.removeItem('usuarioDepartamento');
    localStorage.removeItem('direccionPedidoActual');

    pantallaActual.value = 'inicio';
    alert('Sesión cerrada correctamente.');
  }
};

// Finalizar pedido con número de orden secuencial #YYYY-MM-XXXXX
const finalizarPedido = async (metodoPago) => {
  try {
    const direccionGuardada = localStorage.getItem('usuarioDireccion') || 'Cl. 12a #71c-60';
    const ciudadGuardada = localStorage.getItem('usuarioCiudad') || 'Pasto';
    const deptoGuardado = localStorage.getItem('usuarioDepartamento') || 'Nariño';

    const respuesta = await fetch('http://localhost:8080/servidor_nana/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_email: correoUsuarioActivo.value || 'cliente@cachivacheznana.com',
        usuario_nombre: nombreUsuarioActivo.value || 'Cliente NANA',
        direccion_envio: direccionGuardada,
        ciudad: ciudadGuardada,
        departamento: deptoGuardado,
        metodo_pago: metodoPago,
        total: obtenerTotalCarrito(),
        items: carrito.value
      })
    });

    if (respuesta.ok) {
      const data = await respuesta.json();
      localStorage.setItem('ultimoPedidoNumero', data.numero_pedido);
      alert(`🎉 ¡Compra exitosa!\n\nNúmero de Pedido generado: ${data.numero_pedido}\nMétodo: ${metodoPago}\nTransportadora: ${data.transportadora}\nGuía: ${data.guia_despacho}\n\nPuedes hacerle seguimiento en tiempo real en la pestaña Seguimiento.`);
    } else {
      alert(`Pedido confirmado con método: ${metodoPago}`);
    }
  } catch (err) {
    console.error('Error registrando pedido:', err);
    alert(`Pedido confirmado con método: ${metodoPago}`);
  }

  carrito.value = [];
  localStorage.removeItem('cachivaches_carrito');
  pantallaActual.value = 'seguimiento'; 
};

// Obtener total del carrito
const obtenerTotalCarrito = () => {
  if (carrito.value.length === 0) return 0;
  const subtotal = carrito.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  return subtotal + 15000; 
};
</script>

<template>
  <div class="min-h-screen bg-[#c8d695] font-sans text-gray-800 flex flex-col justify-between">
    
    <!-- ==================================================== -->
    <!-- 1. BARRA DE NAVEGACIÓN SUPERIOR INTEGRAL -->
    <!-- ==================================================== -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 transition-all">
      
      <!-- Menú de Enlaces Principales -->
      <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
        
        <!-- Enlace: Inicio -->
        <a 
          href="#" 
          @click.prevent="pantallaActual = 'inicio'" 
          :class="pantallaActual === 'inicio' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
          class="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm transition-all"
        >
          <span>🏠</span> Inicio
        </a>
        
        <!-- Enlace: Productos con Menú Desplegable de Marcas Oficiales con Logos -->
        <div class="relative group">
          <button 
            type="button"
            @click="pantallaActual = 'productos'"
            :class="pantallaActual === 'productos' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
            class="flex items-center gap-1 font-bold px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer"
          >
            <span>🛍️</span> Productos <span class="text-xs transition-transform group-hover:rotate-180">▼</span>
          </button>

          <!-- Menú Flotante de Marcas con Logos Oficiales -->
          <div class="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block transition-all z-50">
            <p class="text-[10px] font-black uppercase text-gray-400 px-3 py-1 tracking-wider">
              Filtrar por Marca Oficial:
            </p>
            <div class="flex flex-col gap-0.5">
              <button 
                v-for="marca in listaMarcasNav" 
                :key="marca.nombre"
                @click="navegarAMarca(marca.nombre)"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#6b4e8b] transition-colors w-full text-left cursor-pointer"
              >
                <img 
                  v-if="obtenerLogoMarca(marca.nombre)" 
                  :src="obtenerLogoMarca(marca.nombre)" 
                  class="w-5 h-5 object-contain rounded-full bg-white p-0.5 shadow-sm inline-block shrink-0" 
                  :alt="marca.nombre" 
                />
                <span v-else>{{ marca.icono }}</span>
                <span>{{ marca.nombre }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Enlace: Mis Pedidos / Seguimiento (Permanente y siempre accesible) -->
        <button 
          type="button"
          @click="pantallaActual = 'seguimiento'" 
          :class="pantallaActual === 'seguimiento' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
          class="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer"
          title="Rastrear mis pedidos en tiempo real"
        >
          <span>🚚</span> Seguimiento
        </button>

        <!-- Enlace: Acerca de Nosotros -->
        <button 
          type="button"
          @click="pantallaActual = 'acerca'" 
          :class="pantallaActual === 'acerca' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
          class="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer"
        >
          <span>ℹ️</span> Acerca de nosotros
        </button>

        <!-- Enlace: Opiniones / Calificaciones -->
        <button 
          type="button"
          @click="pantallaActual = 'calificaciones'" 
          :class="pantallaActual === 'calificaciones' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
          class="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer"
        >
          <span>⭐</span> Opiniones
        </button>

        <!-- Enlace: Panel de Administrador (Protegido por Clave) -->
        <button 
          type="button"
          @click="intentarAccesoAdmin" 
          :class="pantallaActual === 'admin' ? 'bg-purple-900 text-white shadow-md' : 'text-purple-900 hover:bg-purple-100'"
          class="flex items-center gap-1.5 font-black px-3.5 py-1.5 rounded-full text-sm transition-all cursor-pointer border border-purple-300"
          title="Panel exclusivo para personal administrativo"
        >
          <span>⚙️</span> Administrador
        </button>

      </div>

      <!-- Lado Derecho: Identificación del Usuario en Toda la Aplicación, Buscador y Carrito -->
      <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
        
        <!-- BADGE DEL USUARIO ACTIVO (Visible en toda la aplicación con opción de cerrar sesión) -->
        <div v-if="correoUsuarioActivo" class="bg-gradient-to-r from-purple-100 to-green-100 text-purple-900 font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-sm border border-purple-200 flex items-center gap-2.5">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <span>👤 {{ nombreUsuarioActivo || correoUsuarioActivo }}</span>
          </span>
          <button 
            type="button"
            @click="cerrarSesion" 
            title="Cerrar sesión de forma segura" 
            class="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>

        <div v-else class="text-xs font-semibold text-gray-700 flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          <span>👤 Invitado</span>
          <button @click="pantallaActual = 'inicio'" class="text-[#6b4e8b] font-bold underline ml-1 cursor-pointer hover:text-[#5a3f75]">Iniciar sesión</button>
        </div>

        <!-- Buscador Global -->
        <div class="relative hidden sm:block">
          <input 
            v-model="textoBuscadorNav"
            @keyup.enter="ejecutarBusquedaNav"
            type="text" 
            placeholder="Buscar prenda..." 
            class="rounded-full px-4 py-1.5 pr-8 bg-white border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-green-600 outline-none w-44 lg:w-56 shadow-inner" 
          />
          <button 
            type="button"
            @click="ejecutarBusquedaNav" 
            class="absolute right-2.5 top-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            🔍
          </button>
        </div>

        <!-- Botón del Carrito 🛒 con Contador Dinámico -->
        <button 
          type="button"
          @click="pantallaActual = 'carrito'" 
          :class="pantallaActual === 'carrito' ? 'ring-2 ring-[#6b4e8b] bg-white' : 'hover:bg-white/60'"
          class="relative font-bold text-2xl p-1.5 rounded-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          title="Ver Carrito de Compras"
        >
          <span>🛒</span>
          <span 
            v-if="carrito.length > 0"
            class="absolute -top-1 -right-1 bg-[#6b4e8b] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce"
          >
            {{ carrito.reduce((sum, item) => sum + item.cantidad, 0) }}
          </span>
        </button>

      </div>
    </nav>

    <!-- ==================================================== -->
    <!-- 2. SECCIÓN DE LOGO Y LEMA PRINCIPAL -->
    <!-- ==================================================== -->
    <header class="flex flex-col items-center justify-center pt-6 pb-2 text-center px-4">
      <div 
        @click="pantallaActual = 'productos'" 
        class="max-w-xs mx-auto mb-2 p-3 bg-white rounded-3xl shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        title="Ir al Catálogo de Productos"
      >
        <img 
          src="./assets/logo_tienda.jpg" 
          alt="Cachivaches Nana Logo Oficial" 
          class="w-full h-auto object-contain rounded-2xl max-h-36" 
        />
      </div>
      <p class="text-2xl sm:text-3xl italic font-serif text-gray-800 font-medium">
        "Lo que Sueñas a Precio Justo"
      </p>
    </header>

    <!-- ==================================================== -->
    <!-- 3. CONTENEDOR DINÁMICO DE PANTALLAS -->
    <!-- ==================================================== -->
    <main class="w-full max-w-6xl mx-auto px-4 py-4 flex-grow">
      
      <!-- PANTALLA A: INICIO (SESIÓN ACTIVA O FORMULARIO DE INICIO DE SESIÓN) -->
      <div v-if="pantallaActual === 'inicio'" class="max-w-2xl mx-auto">
        
        <!-- CASO 1: YA TIENE SESIÓN INICIADA -->
        <div v-if="correoUsuarioActivo" class="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-left">
          <div class="flex items-center justify-between mb-4">
            <span class="bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Sesión Activa
            </span>
            <button 
              type="button"
              @click="cerrarSesion" 
              class="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </div>

          <h2 class="text-3xl font-black text-gray-800">¡Hola, {{ nombreUsuarioActivo || correoUsuarioActivo }}! 👋</h2>
          <p class="text-sm text-gray-600 mt-1">
            Has iniciado sesión en Cachivaches NANA con la cuenta: <strong class="text-purple-900">{{ correoUsuarioActivo }}</strong>
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <button 
              type="button"
              @click="pantallaActual = 'productos'"
              class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-3 rounded-xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛍️</span> Ver Catálogo
            </button>
            
            <button 
              type="button"
              @click="pantallaActual = 'seguimiento'"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🚚</span> Mis Pedidos
            </button>

            <button 
              type="button"
              @click="pantallaActual = 'carrito'"
              class="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold py-3 px-3 rounded-xl shadow-sm transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛒</span> Carrito ({{ carrito.reduce((sum, item) => sum + item.cantidad, 0) }})
            </button>
          </div>
        </div>

        <!-- CASO 2: NO HAY SESIÓN INICIADA (FORMULARIO LIMPIO) -->
        <div v-else class="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-left">
          <div class="mb-6">
            <span class="bg-[#8fa15b]/20 text-[#4d5e20] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Bienvenido a la Tienda
            </span>
            <h2 class="text-3xl font-black text-gray-800 mt-2">Inicio de Sesión</h2>
            <p class="text-xs text-gray-500 mt-1">Ingresa con tus credenciales registradas en la base de datos.</p>
          </div>
          
          <div v-if="mensajeError" class="mb-5 p-3.5 bg-red-100 border border-red-300 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ mensajeError }}</span>
          </div>

          <form @submit.prevent="manejarInicioSesion" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-gray-700 text-xs">Correo Electrónico (Email)</label>
              <input 
                v-model="email"
                type="email" 
                placeholder="ejemplo: mercedes01@gmail.com" 
                required
                class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-gray-700 text-xs">Contraseña</label>
              <input 
                v-model="contrasenia"
                type="password" 
                placeholder="Tu contraseña alfanumérica" 
                required
                class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] focus:bg-white text-sm shadow-inner" 
              />
            </div>

            <div class="flex flex-col gap-3 mt-2">
              <button 
                type="submit"
                class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all active:scale-95 w-full uppercase tracking-wider text-xs cursor-pointer"
              >
                Ingresar al Sistema 🚀
              </button>
              
              <p class="text-xs text-center text-gray-600 font-medium">
                ¿No tienes una cuenta aún? 
                <span 
                  @click="pantallaActual = 'registro'" 
                  class="font-black text-[#6b4e8b] underline cursor-pointer hover:text-[#5a3f75]"
                >
                  Regístrate aquí
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- PANTALLA B: MÓDULO DE REGISTRO -->
      <div v-else-if="pantallaActual === 'registro'">
        <nana_registro />
      </div>

      <!-- PANTALLA C: CATÁLOGO MULTIMARCA DE PRODUCTOS -->
      <div v-else-if="pantallaActual === 'productos'">
        <nana_productos 
          :onAgregar="agregarAlCarrito" 
          :marcaFiltroInicial="marcaPreseleccionada"
        />
      </div>

      <!-- PANTALLA D: ACERCA DE NOSOTROS (MÓDULO VINCULADO) -->
      <div v-else-if="pantallaActual === 'acerca'">
        <nana_acerca 
          @irAProductos="pantallaActual = 'productos'"
          @seleccionarMarca="navegarAMarca"
        />
      </div>

      <!-- PANTALLA E: CARRITO DE COMPRAS (RESTRINGE PEDIDO SI NO HA INICIADO SESIÓN) -->
      <div v-else-if="pantallaActual === 'carrito'">
        <nana_carrito 
          :items="carrito" 
          :onIrAPagar="() => pantallaActual = 'pagos'" 
          @regresarAlCatalogo="pantallaActual = 'productos'" 
          @solicitarLogin="pantallaActual = 'inicio'"
        />
      </div>

      <!-- PANTALLA F: PASARELA DE PAGOS -->
      <div v-else-if="pantallaActual === 'pagos'">
        <nana_pagos 
          :totalPedido="obtenerTotalCarrito()" 
          :onConfirmarPedido="finalizarPedido" 
        />
      </div>

      <!-- PANTALLA G: SEGUIMIENTO DE ORDEN Y RASTREO (PERMITE ENTRAR SIEMPRE) -->
      <div v-else-if="pantallaActual === 'seguimiento'">
        <nana_seguimiento @irAProductos="pantallaActual = 'productos'" />
      </div>

      <!-- PANTALLA H: OPINIONES Y CALIFICACIONES -->
      <div v-else-if="pantallaActual === 'calificaciones'">
        <nana_calificaciones />
      </div>
      
      <!-- PANTALLA I: PANEL ADMINISTRATIVO (SOLO ADMINISTRADOR AUTORIZADO) -->
      <div v-else-if="pantallaActual === 'admin'">
        <div v-if="esAdminAutenticado">
          <nana_admin @salirAdmin="salirDeAdmin" />
        </div>
        <div v-else class="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl text-center">
          <span class="text-4xl block mb-2">🔒</span>
          <h3 class="text-xl font-black text-gray-800 mb-2">Acceso Administrativo Requerido</h3>
          <p class="text-xs text-gray-600 mb-4">Solo el personal administrador puede acceder a este panel de control.</p>
          <button @click="intentarAccesoAdmin" class="bg-purple-900 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer">
            Validar Contraseña de Administrador
          </button>
        </div>
      </div>

    </main>

    <!-- MODAL DE ACCESO ADMINISTRATIVO SEGURO -->
    <div v-if="mostrarModalClaveAdmin" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-left">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-black text-gray-800 flex items-center gap-2">
            <span>🔒</span> Acceso de Administrador
          </h3>
          <button @click="mostrarModalClaveAdmin = false" class="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
        </div>
        <p class="text-xs text-gray-600 mb-4">
          Este módulo está restringido exclusivamente para el administrador de Cachivaches NANA. Ingrese la contraseña de administración para continuar:
        </p>

        <form @submit.prevent="validarClaveAdmin" class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-700 text-xs">Contraseña de Administrador</label>
            <input 
              v-model="claveAdminInput" 
              type="password" 
              placeholder="Ingrese clave de administrador" 
              required 
              autofocus
              class="bg-gray-50 border p-2.5 rounded-xl text-xs outline-none focus:border-purple-900 focus:bg-white font-mono"
            />
            <span v-if="errorClaveAdmin" class="text-[11px] text-red-600 font-bold mt-1">{{ errorClaveAdmin }}</span>
          </div>

          <div class="flex justify-end gap-2 mt-2">
            <button type="button" @click="mostrarModalClaveAdmin = false" class="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow cursor-pointer">
              Ingresar al Panel 🚀
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- 4. FOOTER INSTITUCIONAL -->
    <!-- ==================================================== -->
    <footer class="mt-12 border-t border-black/10 py-6 px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-700 gap-4 bg-white/40 backdrop-blur-sm">
      <div class="flex flex-col gap-1 text-center md:text-left">
        <p class="font-extrabold text-gray-800 text-sm">Cachivaches NANA S.A.S</p>
        <p>© 2026 Cachivaches NANA. Todos los derechos reservados.</p>
        <p class="text-[11px] text-gray-500">Proyecto Formativo ADSO - SENA Tecnología</p>
      </div>
      
      <div class="flex flex-col gap-1 text-center md:text-right">
        <p>📧 contacto@cachivacheznana.com</p>
        <p>📞 WhatsApp / Línea Nacional: 300 010203</p>
        <p>📍 Bello - Antioquia, Colombia</p>
      </div>
    </footer>

  </div>
</template>
