<template>
  <div class="w-full bg-[#c8d695] px-4 min-h-screen pb-16 text-left">
    <!-- Encabezado Principal -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="bg-white/80 text-[#6b4e8b] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Nuestra Historia y Compromiso
          </span>
          <h2 class="text-4xl font-extrabold text-gray-800 mt-2">Acerca de Cachivaches NANA</h2>
          <p class="text-xl italic font-serif text-gray-700 mt-1">
            "Lo que Sueñas a Precio Justo"
          </p>
        </div>
        <button 
          @click="emit('irAProductos')"
          class="bg-[#6b4e8b] hover:bg-[#5a3f75] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wide cursor-pointer w-fit"
        >
          Explorar Catálogo 🛍️
        </button>
      </div>
    </div>

    <!-- Contenido Principal en Cards -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Columna Izquierda: Historia y Misión (2 Columnas de ancho en desktop) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Tarjeta: ¿Quiénes Somos? -->
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">✨</span>
            <h3 class="text-2xl font-black text-gray-800">¿Quiénes Somos?</h3>
          </div>
          <p class="text-gray-600 leading-relaxed mb-4 text-base">
            En <strong>Cachivaches NANA</strong> somos una tienda multimarca nacida en el municipio de <strong>Bello, Antioquia</strong>, apasionada por la moda urbana, el calzado deportivo y los accesorios de alta gama. Nuestro propósito es democratizar el acceso a las marcas más deseadas del mundo, ofreciendo prendas exclusivas, auténticas y con precios que cuidan tu economía.
          </p>
          <p class="text-gray-600 leading-relaxed text-base">
            Creemos firmemente que lucir bien y vestir prendas de marcas prestigiosas como <em>Oakley, Adidas, Victoria's Secret, Puma y Polo</em> no tiene que ser un lujo inalcanzable. Por eso seleccionamos cuidadosamente cada artículo de nuestro catálogo para garantizarte una experiencia de compra confiable y transparente.
          </p>
        </div>

        <!-- Tarjeta: Pilares de Confianza -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl mb-2">🏷️</span>
            <h4 class="font-extrabold text-gray-800 text-sm mb-1">Garantía de Calidad</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              Prendas seleccionadas con los más estrictos estándares de confección y durabilidad.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl mb-2">🚚</span>
            <h4 class="font-extrabold text-gray-800 text-sm mb-1">Despacho Nacional</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              Envíos rápidos a todo el país con Coordinadora, Interrapidísimo y Servientrega.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <span class="text-3xl mb-2">💵</span>
            <h4 class="font-extrabold text-gray-800 text-sm mb-1">Pago Contraentrega</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              Recibe tu paquete en la puerta de tu casa y paga en efectivo con total tranquilidad.
            </p>
          </div>
        </div>

        <!-- Tarjeta: Nuestras Marcas Aliadas -->
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl">🏆</span>
            <h3 class="text-2xl font-black text-gray-800">Marcas que Encuentras con Nosotros</h3>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div 
              v-for="marca in marcas" 
              :key="marca.nombre"
              @click="filtrarPorMarca(marca.nombre)"
              class="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#6b4e8b] hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">{{ marca.icono }}</span>
              <h5 class="font-black text-gray-800 text-sm group-hover:text-[#6b4e8b]">{{ marca.nombre }}</h5>
              <p class="text-[11px] text-gray-500 mt-1">{{ marca.descripcion }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Columna Derecha: Información de Contacto y Ubicación -->
      <div class="flex flex-col gap-6">
        
        <!-- Tarjeta de Contacto Directo -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📍</span> Punto de Atención
          </h3>

          <div class="flex flex-col gap-4 text-sm text-gray-700">
            <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
              <span class="text-xl">🏢</span>
              <div>
                <p class="font-bold text-gray-800">Sede Principal</p>
                <p class="text-xs text-gray-500">Bello - Antioquia, Colombia</p>
                <p class="text-xs text-gray-500">Valle de Aburrá</p>
              </div>
            </div>

            <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
              <span class="text-xl">📞</span>
              <div>
                <p class="font-bold text-gray-800">Línea de Atención / WhatsApp</p>
                <p class="text-xs text-purple-900 font-bold">300 010203</p>
                <p class="text-[11px] text-gray-400">Lun a Sáb: 9:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
              <span class="text-xl">📧</span>
              <div>
                <p class="font-bold text-gray-800">Correo Electrónico</p>
                <p class="text-xs text-gray-600 font-mono">contacto@cachivacheznana.com</p>
              </div>
            </div>

            <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
              <span class="text-xl">💳</span>
              <div>
                <p class="font-bold text-gray-800">Medios de Pago Habilitados</p>
                <p class="text-xs text-gray-500">Bancolombia, Nequi, Daviplata y Efectivo</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Misión y Visión -->
        <div class="bg-gradient-to-br from-[#6b4e8b] to-[#4a154b] text-white rounded-3xl p-6 shadow-xl">
          <h4 class="text-lg font-black mb-2 flex items-center gap-2">
            <span>🎯</span> Nuestra Misión
          </h4>
          <p class="text-xs text-purple-100 leading-relaxed mb-4">
            Brindar asesoría personalizada y productos de primera línea que eleven tu estilo, combinando originalidad, rapidez en la entrega y precios accesibles.
          </p>

          <h4 class="text-lg font-black mb-2 flex items-center gap-2">
            <span>🚀</span> Nuestra Visión
          </h4>
          <p class="text-xs text-purple-100 leading-relaxed">
            Consolidarnos en 2026 como la tienda virtual líder del Valle de Aburrá y de Colombia en distribución de moda multimarca responsable.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['irAProductos', 'seleccionarMarca']);

const marcas = [
  { nombre: 'Oakley', icono: '🕶️', descripcion: 'Gafas, busos, gorras y pantalones' },
  { nombre: 'Adidas', icono: '👟', descripcion: 'Calzado icónico, chaquetas y sudaderas' },
  { nombre: 'Victoria Secret', icono: '🌸', descripcion: 'Splashes, lociones, bolsos y pijamas' },
  { nombre: 'Puma', icono: '🐆', descripcion: 'Tenis suede, hoodies y joggers sport' },
  { nombre: 'Polo', icono: '🐎', descripcion: 'Camisetas tipo polo, camisas y cueros' },
  { nombre: 'Varios', icono: '🎒', descripcion: 'Relojes, termos, riñoneras y accesorios' }
];

const filtrarPorMarca = (nombreMarca) => {
  emit('seleccionarMarca', nombreMarca);
};
</script>
