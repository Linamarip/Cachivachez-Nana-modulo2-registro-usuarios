// Registro automático exclusivo de archivos de imagen en la carpeta assets en Vite
const imagenesGlob = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,svg,gif}', { 
  eager: true, 
  query: '?url',
  import: 'default' 
});

// Mapa normalizado de imágenes para acceso ultra-rápido y flexible
const mapaImagenes = {};

for (const ruta in imagenesGlob) {
  const partes = ruta.split('/');
  const nombreArchivo = partes[partes.length - 1];
  const urlResuelta = imagenesGlob[ruta];

  if (nombreArchivo && urlResuelta) {
    const limpio = nombreArchivo.toLowerCase().trim();
    mapaImagenes[limpio] = urlResuelta;
    
    // También guardar sin extensión (ej: "camiseta_olivo")
    const sinExtension = limpio.replace(/\.[^/.]+$/, '');
    mapaImagenes[sinExtension] = urlResuelta;
  }
}

// Fallback por defecto
export const imagenPorDefecto = mapaImagenes['camiseta.jpg'] || Object.values(mapaImagenes)[0] || '';

/**
 * Obtener el logo oficial de la marca para filtros y navegación
 * @param {string} marca 
 * @returns {string} URL de la imagen del logo
 */
export function obtenerLogoMarca(marca) {
  const m = String(marca || '').toLowerCase().trim();
  if (m.includes('oakley')) return mapaImagenes['logo_oakley.jpg'] || '';
  if (m.includes('adidas')) return mapaImagenes['logo_adidas.jpg'] || '';
  if (m.includes('puma')) return mapaImagenes['logo_puma.jpg'] || '';
  if (m.includes('polo')) return mapaImagenes['logo_polo.jpg'] || '';
  if (m.includes('victoria') || m.includes('secret')) return mapaImagenes['logo_victoria_secret.jpg'] || '';
  return '';
}

/**
 * Función robusta para obtener la URL de una imagen en Vite
 * @param {string} nombreImagen - Nombre del archivo o referencia
 * @param {string} [categoria] - Marca o categoría opcional para coincidencia inteligente
 * @returns {string} URL pública resuelta de la imagen
 */
export function obtenerImagenProducto(nombreImagen, categoria = '') {
  if (!nombreImagen && !categoria) return imagenPorDefecto;

  const texto = String(nombreImagen || '').toLowerCase().trim();
  const cat = String(categoria || '').toLowerCase().trim();

  // 1. Coincidencia directa exacta por nombre
  if (mapaImagenes[texto]) {
    return mapaImagenes[texto];
  }

  // 2. Coincidencia con .jpg agregado
  if (mapaImagenes[`${texto}.jpg`]) {
    return mapaImagenes[`${texto}.jpg`];
  }

  // 3. Coincidencias específicas para Camiseta Olivo / ADI-004
  if (texto.includes('olivo') || texto.includes('oliva') || texto.includes('adi-004') || texto.includes('adi_004')) {
    return mapaImagenes['camiseta_olivo.jpg'] || mapaImagenes['adi_004.jpg'] || imagenPorDefecto;
  }

  // 4. Coincidencias específicas de la línea Puma
  if (texto.includes('buzz') || texto.includes('morral')) {
    return mapaImagenes['puma_morral_buzz.jpg'] || mapaImagenes['mochila_puma.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('todohype')) {
    return mapaImagenes['puma_tenis_todohype.jpg'] || mapaImagenes['tenis_puma.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('leggins')) {
    return mapaImagenes['puma_leggins.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('maleta')) {
    return mapaImagenes['puma_maleta_deportiva.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('dama') && texto.includes('buso')) {
    return mapaImagenes['puma_buso_dama.jpg'] || imagenPorDefecto;
  }

  // 5. Coincidencias específicas de Victoria Secret
  if (texto.includes('bombshell')) {
    return mapaImagenes['vs_bombshell.jpg'] || mapaImagenes['splash_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('velvet')) {
    return mapaImagenes['vs_crema_velvet.jpg'] || mapaImagenes['locion_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('spray') || texto.includes('vanilla') || texto.includes('vanille')) {
    return mapaImagenes['vs_spray_vanilla.jpg'] || mapaImagenes['splash_vs.jpg'] || imagenPorDefecto;
  }

  // 6. Coincidencias para Tenis
  if (texto.includes('tenis')) {
    if (texto.includes('puma') || cat.includes('puma')) {
      return mapaImagenes['puma_tenis_todohype.jpg'] || mapaImagenes['tenis_puma.jpg'] || imagenPorDefecto;
    }
    return mapaImagenes['tenis_adidas.jpg'] || imagenPorDefecto;
  }

  // 7. Coincidencias para Busos / Hoodies
  if (texto.includes('hoodie') || (texto.includes('buso') && (texto.includes('puma') || cat.includes('puma')))) {
    return mapaImagenes['hoodie_puma.jpg'] || mapaImagenes['puma_buso_dama.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('buso')) {
    return mapaImagenes['buso.jpg'] || imagenPorDefecto;
  }

  // 8. Chaquetas y Sudaderas
  if (texto.includes('chaqueta')) {
    return mapaImagenes['chaqueta_adidas.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('sudadera')) {
    return mapaImagenes['sudadera_adidas.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('jogger')) {
    return mapaImagenes['jogger_puma.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('pantalon') || texto.includes('pantalón')) {
    return mapaImagenes['pantalon.jpg'] || imagenPorDefecto;
  }

  // 9. Gorras y Gafas
  if (texto.includes('gafas')) {
    return mapaImagenes['gafas_oakley.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('gorra')) {
    if (texto.includes('polo') || cat.includes('polo')) return mapaImagenes['gorra_polo.jpg'] || imagenPorDefecto;
    return mapaImagenes['gorra_oakley.jpg'] || imagenPorDefecto;
  }

  // 10. Victoria Secret general
  if (texto.includes('splash') || texto.includes('mist')) {
    return mapaImagenes['vs_spray_vanilla.jpg'] || mapaImagenes['splash_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('locion') || texto.includes('loción') || texto.includes('crema')) {
    return mapaImagenes['vs_crema_velvet.jpg'] || mapaImagenes['locion_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('bolso') || texto.includes('tote')) {
    return mapaImagenes['bolso_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('pijama')) {
    return mapaImagenes['pijama_vs.jpg'] || imagenPorDefecto;
  }

  // 11. Accesorios Varios y Polo
  if (texto.includes('reloj')) return mapaImagenes['reloj_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('termo')) return mapaImagenes['termo_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('cinturon') || texto.includes('cinturón')) return mapaImagenes['cinturon_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('rinonera') || texto.includes('riñonera')) return mapaImagenes['rinonera_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('mochila') || texto.includes('morral')) return mapaImagenes['puma_morral_buzz.jpg'] || mapaImagenes['mochila_puma.jpg'] || imagenPorDefecto;
  if (texto.includes('billetera')) return mapaImagenes['billetera_polo.jpg'] || imagenPorDefecto;
  if (texto.includes('polo') || texto.includes('camisa')) {
    if (texto.includes('oxford')) return mapaImagenes['camisa_polo.jpg'] || imagenPorDefecto;
    return mapaImagenes['polo_classic.jpg'] || imagenPorDefecto;
  }

  // 12. Camisetas en general
  if (texto.includes('camiseta')) {
    if (texto.includes('adidas') || cat.includes('adidas')) return mapaImagenes['camiseta_adidas.jpg'] || imagenPorDefecto;
    return mapaImagenes['camiseta.jpg'] || imagenPorDefecto;
  }

  return imagenPorDefecto;
}
