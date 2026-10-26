// Registro automático exclusivo de archivos de imagen en la carpeta assets en Vite
const imagenesGlob = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,svg,gif}', { 
  eager: true, 
  query: '?url',
  import: 'default' 
});

// Mapa normalizado de imágenes para acceso ultra-rápido y flexible
const mapaImagenes = {};

for (const ruta in imagenesGlob) {
  // Extrae el nombre del archivo (ej: "camiseta_olivo.jpg" de "../assets/camiseta_olivo.jpg")
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

  // 4. Coincidencias para Tenis
  if (texto.includes('tenis')) {
    if (texto.includes('puma') || cat.includes('puma')) {
      return mapaImagenes['tenis_puma.jpg'] || imagenPorDefecto;
    }
    return mapaImagenes['tenis_adidas.jpg'] || imagenPorDefecto;
  }

  // 5. Coincidencias para Busos / Hoodies
  if (texto.includes('hoodie') || (texto.includes('buso') && (texto.includes('puma') || cat.includes('puma')))) {
    return mapaImagenes['hoodie_puma.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('buso')) {
    return mapaImagenes['buso.jpg'] || imagenPorDefecto;
  }

  // 6. Chaquetas y Sudaderas
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

  // 7. Gorras y Gafas
  if (texto.includes('gafas')) {
    return mapaImagenes['gafas_oakley.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('gorra')) {
    if (texto.includes('polo') || cat.includes('polo')) return mapaImagenes['gorra_polo.jpg'] || imagenPorDefecto;
    return mapaImagenes['gorra_oakley.jpg'] || imagenPorDefecto;
  }

  // 8. Victoria Secret
  if (texto.includes('splash') || texto.includes('mist')) {
    return mapaImagenes['splash_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('locion') || texto.includes('loción')) {
    return mapaImagenes['locion_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('bolso') || texto.includes('tote')) {
    return mapaImagenes['bolso_vs.jpg'] || imagenPorDefecto;
  }
  if (texto.includes('pijama')) {
    return mapaImagenes['pijama_vs.jpg'] || imagenPorDefecto;
  }

  // 9. Accesorios Varios y Polo
  if (texto.includes('reloj')) return mapaImagenes['reloj_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('termo')) return mapaImagenes['termo_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('cinturon') || texto.includes('cinturón')) return mapaImagenes['cinturon_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('rinonera') || texto.includes('riñonera')) return mapaImagenes['rinonera_varios.jpg'] || imagenPorDefecto;
  if (texto.includes('mochila')) return mapaImagenes['mochila_puma.jpg'] || imagenPorDefecto;
  if (texto.includes('billetera')) return mapaImagenes['billetera_polo.jpg'] || imagenPorDefecto;
  if (texto.includes('polo') || texto.includes('camisa')) {
    if (texto.includes('oxford')) return mapaImagenes['camisa_polo.jpg'] || imagenPorDefecto;
    return mapaImagenes['polo_classic.jpg'] || imagenPorDefecto;
  }

  // 10. Camisetas en general
  if (texto.includes('camiseta')) {
    if (texto.includes('adidas') || cat.includes('adidas')) return mapaImagenes['camiseta_adidas.jpg'] || imagenPorDefecto;
    return mapaImagenes['camiseta.jpg'] || imagenPorDefecto;
  }

  return imagenPorDefecto;
}
