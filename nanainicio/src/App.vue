<script setup>
import { ref, onMounted, watch } from 'vue';

// Importación de todos los componentes modulares
import nana_registro from './components/nana_registro.vue';
import nana_productos from './components/nana_productos.vue'; 
import nana_carrito from './components/nana_carrito.vue';
import nana_pagos from './components/nana_pagos.vue';
import nana_seguimiento from './components/nana_seguimiento.vue';
import nana_calificaciones from './components/nana_calificaciones.vue';
import nana_admin from './components/nana_admin.vue';
import nana_acerca from './components/nana_acerca.vue';

// Estado global de la aplicación
const pantallaActual = ref('inicio');
const email = ref('');
const contrasenia = ref('');
const mensajeError = ref('');
const correoUsuarioActivo = ref('');
const nombreUsuarioActivo = ref('');

// Búsqueda y Filtro de Marca desde la barra superior
const textoBuscadorNav = ref('');
const marcaPreseleccionada = ref('Todas');
const menuMarcasAbierto = ref(false);

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

// Cargar carrito guardado al montar
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

// Agregar producto al carrito
const agregarAlCarrito = (producto) => {
  const existe = carrito.value.find(item => item.id === producto.id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.value.push({ ...producto, cantidad: 1 });
  }
  alert(`¡${producto.nombre} agregado al carrito de compras! 🛍️`);
};

// Navegación rápida por marca
const navegarAMarca = (nombreMarca) => {
  marcaPreseleccionada.value = nombreMarca;
  menuMarcasAbierto.value = false;
  pantallaActual.value = 'productos';
};

// Ejecutar búsqueda desde la barra superior
const ejecutarBusquedaNav = () => {
  if (pantallaActual.value !== 'productos') {
    pantallaActual.value = 'productos';
  }
};

// Manejador de inicio de sesión con backend Node/MySQL
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
      const userReal = datosServidor.usuario;

      alert(`¡Bienvenido a Cachivaches NANA, ${userReal.nombre}! 👋`);
      
      correoUsuarioActivo.value = email.value.trim();
      nombreUsuarioActivo.value = `${userReal.nombre} ${userReal.apellido || ''}`.trim();

      localStorage.setItem('usuarioEmail', email.value.trim());
      localStorage.setItem('usuarioNombre', nombreUsuarioActivo.value);
      localStorage.setItem('usuarioDireccion', userReal.direccion || 'Calle 50 # 40-10');
      localStorage.setItem('usuarioCiudad', userReal.ciudad || 'Bello');
      localStorage.setItem('usuarioDepartamento', userReal.departamento || 'Antioquia');

      // Limpiar los inputs del formulario de login inmediatamente para no dejar residuos
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

// Cerrar sesión completamente limpiando todos los datos
const cerrarSesion = () => {
  if (confirm('¿Deseas cerrar tu sesión actual?')) {
    // 1. Limpiar campos del formulario de login
    email.value = '';
    contrasenia.value = '';
    mensajeError.value = '';

    // 2. Limpiar variables reactivas de usuario activo
    correoUsuarioActivo.value = '';
    nombreUsuarioActivo.value = '';

    // 3. Limpiar almacenamiento local de usuario
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioDireccion');
    localStorage.removeItem('usuarioCiudad');
    localStorage.removeItem('usuarioDepartamento');
    localStorage.removeItem('direccionPedidoActual');

    // 4. Regresar a pantalla de inicio
    pantallaActual.value = 'inicio';
  }
};

// Finalizar pedido desde la pasarela de pagos
const finalizarPedido = (metodoPago) => {
  alert(`Cachivaches NANA: Su pedido ha sido registrado con método: ${metodoPago}.`);
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
    <nav class="sticky top-0 z-40 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-all">
      
      <!-- Menú de Enlaces Principales -->
      <div class="flex items-center gap-2 sm:gap-6 flex-wrap">
        
        <!-- Enlace: Inicio -->
        <a 
          href="#" 
          @click.prevent="pantallaActual = 'inicio'" 
          :class="pantallaActual === 'inicio' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
          class="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm transition-all"
        >
          <span>🏠</span> Inicio
        </a>
        
        <!-- Enlace: Productos con Menú Desplegable de Marcas -->
        <div class="relative group">
          <button 
            type="button"
            @click="pantallaActual = 'productos'"
            :class="pantallaActual === 'productos' ? 'bg-[#6b4e8b] text-white shadow-sm' : 'text-gray-800 hover:text-green-900 hover:bg-white/60'"
            class="flex items-center gap-1 font-bold px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer"
          >
            <span>🛍️</span> Productos <span class="text-xs transition-transform group-hover:rotate-180">▼</span>
          </button>

          <!-- Menú Flotante de Marcas -->
          <div class="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 hidden group-hover:block transition-all z-50 animate-fadeIn">
            <p class="text-[10px] font-black uppercase text-gray-400 px-3 py-1 tracking-wider">
              Consultar por Marca:
            </p>
            <div class="flex flex-col gap-0.5">
              <button 
                v-for="marca in listaMarcasNav" 
                :key="marca.nombre"
                @click="navegarAMarca(marca.nombre)"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#6b4e8b] transition-colors w-full text-left cursor-pointer"
              >
                <span>{{ marca.icono }}</span>
                <span>{{ marca.nombre }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Enlace: Acerca de Nosotros (AHORA ACTIVO Y FUNCIONAL) -->
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

        <!-- Enlace: Panel de Administrador -->
        <button 
          type="button"
          @click="pantallaActual = 'admin'" 
          :class="pantallaActual === 'admin' ? 'bg-purple-900 text-white shadow-md' : 'text-purple-900 hover:bg-purple-100'"
          class="flex items-center gap-1.5 font-black px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer border border-purple-200"
        >
          <span>⚙️</span> Administrador
        </button>

      </div>

      <!-- Lado Derecho: Usuario, Buscador y Carrito -->
      <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
        
        <!-- Identificación del Cliente Activo -->
        <div v-if="correoUsuarioActivo" class="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full text-xs shadow-sm flex items-center gap-2 border border-purple-200">
          <span>👤 {{ nombreUsuarioActivo || correoUsuarioActivo }}</span>
          <button 
            type="button"
            @click="cerrarSesion" 
            title="Cerrar sesión" 
            class="text-[10px] text-red-500 hover:text-red-700 underline font-bold cursor-pointer"
          >
            Salir
          </button>
        </div>

        <!-- Buscador Reactivo de la Barra Superior -->
        <div class="relative hidden sm:block">
          <input 
            v-model="textoBuscadorNav"
            @keyup.enter="ejecutarBusquedaNav"
            type="text" 
            placeholder="Buscar en la tienda..." 
            class="rounded-full px-4 py-1.5 pr-8 bg-white border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-green-600 outline-none w-48 lg:w-60 shadow-inner" 
          />
          <button 
            type="button"
            @click="ejecutarBusquedaNav" 
            class="absolute right-2.5 top-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            🔍
          </button>
        </div>

        <!-- Botón del Carrito 🛒 con Contador Reactivo -->
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
            class="absolute -top-1 -right-1 bg-[#6b4e8b] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse"
          >
            {{ carrito.reduce((sum, item) => sum + item.cantidad, 0) }}
          </span>
        </button>

      </div>
    </nav>

    <!-- ==================================================== -->
    <!-- 2. SECCIÓN DE LOGO Y LEMA PRINCIPAL -->
    <!-- ==================================================== -->
    <header class="flex flex-col items-center justify-center pt-8 pb-4 text-center px-4">
      <div 
        @click="pantallaActual = 'productos'" 
        class="max-w-sm mx-auto mb-3 p-3 bg-white rounded-3xl shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        title="Ir al Catálogo de Productos"
      >
        <img 
          src="./assets/logo_tienda.jpg" 
          alt="Cachivaches Nana Logo Oficial" 
          class="w-full h-auto object-contain rounded-2xl max-h-40" 
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
        <div v-if="correoUsuarioActivo" class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-left animate-fadeIn">
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <button 
              type="button"
              @click="pantallaActual = 'productos'"
              class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛍️</span> Ver Catálogo Multimarca
            </button>
            
            <button 
              type="button"
              @click="pantallaActual = 'carrito'"
              class="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🛒</span> Ver Mi Carrito ({{ carrito.reduce((sum, item) => sum + item.cantidad, 0) }})
            </button>
          </div>
        </div>

        <!-- CASO 2: NO HAY SESIÓN INICIADA (FORMULARIO LIMPIO) -->
        <div v-else class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-left animate-fadeIn">
          <div class="mb-6">
            <span class="bg-[#8fa15b]/20 text-[#4d5e20] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Bienvenido a la Tienda
            </span>
            <h2 class="text-3xl font-black text-gray-800 mt-2">Inicio de Sesión</h2>
            <p class="text-xs text-gray-500 mt-1">Ingresa con tus credenciales registradas en la base de datos.</p>
          </div>
          
          <div v-if="mensajeError" class="mb-5 p-3.5 bg-red-100 border border-red-300 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <span>⚠️</span>
            <span>{{ mensajeError }}</span>
          </div>

          <form @submit.prevent="manejarInicioSesion" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-gray-700 text-xs">Correo Electrónico (Email)</label>
              <input 
                v-model="email"
                type="email" 
                placeholder="ejemplo: linamarip2@gmail.com" 
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

          <!-- Enlace de Recuperación de Clave -->
          <div class="mt-5 text-center border-t border-gray-100 pt-3">
            <a 
              href="#" 
              @click.prevent="pantallaActual = 'recuperar'" 
              class="text-xs text-purple-900 underline font-semibold hover:text-purple-700 transition-colors"
            >
              ¿Olvidaste tu contraseña? Recuperar aquí 🔑
            </a>
          </div>
        </div>
      </div>

      <!-- PANTALLA B: MÓDULO DE REGISTRO -->
      <div v-else-if="pantallaActual === 'registro'">
        <nana_registro />
      </div>

      <!-- PANTALLA C: RECUPERACIÓN DE CONTRASEÑA -->
      <div v-else-if="pantallaActual === 'recuperar'" class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-sm mx-auto text-center flex flex-col gap-4 mt-6 animate-fadeIn text-left">
        <h2 class="text-xl font-black text-gray-800 text-center">🔑 Recuperar Acceso</h2>
        <p class="text-xs text-gray-500 leading-relaxed text-center">
          Ingresa tu correo electrónico registrado. El sistema de Cachivaches NANA te enviará un enlace temporal.
        </p>
        
        <input 
          type="email" 
          placeholder="ejemplo@correo.com" 
          class="bg-gray-50 text-gray-800 rounded-xl p-3 outline-none border border-gray-200 focus:border-[#6b4e8b] text-xs w-full shadow-inner"
        />

        <div class="flex gap-2 mt-2">
          <button 
            type="button"
            @click="alert('¡Código de verificación enviado con éxito a su correo!'); pantallaActual = 'inicio'" 
            class="flex-1 bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase shadow transition-all active:scale-95 cursor-pointer"
          >
            Enviar Código
          </button>
          
          <button 
            type="button"
            @click="pantallaActual = 'inicio'" 
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs uppercase transition-all cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>

      <!-- PANTALLA D: CATÁLOGO MULTIMARCA DE PRODUCTOS -->
      <div v-else-if="pantallaActual === 'productos'">
        <nana_productos 
          :onAgregar="agregarAlCarrito" 
          :marcaFiltroInicial="marcaPreseleccionada"
        />
      </div>

      <!-- PANTALLA E: ACERCA DE NOSOTROS (NUEVO COMPONENTE VINCULADO) -->
      <div v-else-if="pantallaActual === 'acerca'">
        <nana_acerca 
          @irAProductos="pantallaActual = 'productos'"
          @seleccionarMarca="navegarAMarca"
        />
      </div>

      <!-- PANTALLA F: CARRITO DE COMPRAS -->
      <div v-else-if="pantallaActual === 'carrito'">
        <nana_carrito 
          :items="carrito" 
          :onIrAPagar="() => pantallaActual = 'pagos'" 
          @regresarAlCatalogo="pantallaActual = 'productos'" 
        />
      </div>

      <!-- PANTALLA G: PASARELA DE PAGOS -->
      <div v-else-if="pantallaActual === 'pagos'">
        <nana_pagos 
          :totalPedido="obtenerTotalCarrito()" 
          :onConfirmarPedido="finalizarPedido" 
        />
      </div>

      <!-- PANTALLA H: SEGUIMIENTO DE ORDEN -->
      <div v-else-if="pantallaActual === 'seguimiento'">
        <nana_seguimiento />
      </div>

      <!-- PANTALLA I: OPINIONES Y CALIFICACIONES -->
      <div v-else-if="pantallaActual === 'calificaciones'">
        <nana_calificaciones />
      </div>
      
      <!-- PANTALLA J: PANEL ADMINISTRATIVO -->
      <div v-else-if="pantallaActual === 'admin'">
        <nana_admin />
      </div>

    </main>

    <!-- ==================================================== -->
    <!-- 4. FOOTER INSTITUCIONAL -->
    <!-- ==================================================== -->
    <footer class="mt-12 border-t border-black/10 py-6 px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-700 gap-4 bg-white/30 backdrop-blur-sm">
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
