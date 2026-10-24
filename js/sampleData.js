/* ==========================================================================
   CuraNotes - Sample Data (Instagram & TikTok Saved Posts)
   ========================================================================== */

export const INITIAL_FOLDERS = [
  {
    id: 'all',
    name: 'Todos los Guardados',
    emoji: '✨',
    color: '#6366f1',
    description: 'Vista unificada de todas las notas y guardados',
    isSystem: true
  },
  {
    id: 'food',
    name: 'Comidas & Recetas',
    emoji: '🍳',
    color: '#f97316',
    description: 'Recetas, platillos, técnicas culinarias e ingredientes',
    keywords: ['receta', 'pasta', 'ingredientes', 'cocina', 'horno', 'postre', 'queso']
  },
  {
    id: 'places',
    name: 'Lugares & Viajes',
    emoji: '📍',
    color: '#06b6d4',
    description: 'Destinos, cafeterías secretas, hoteles y miradores',
    keywords: ['viaje', 'hotel', 'restaurante', 'playa', 'ciudad', 'italia', 'spot']
  },
  {
    id: 'art',
    name: 'Arte & Artistas',
    emoji: '🎨',
    color: '#ec4899',
    description: 'Pintura, paletas de color, bocetos, escultura e inspiración',
    keywords: ['arte', 'oleo', 'pintura', 'acuarela', 'artista', 'paleta', 'cuadro']
  },
  {
    id: 'diy',
    name: 'Creatividad & DIY',
    emoji: '✂️',
    color: '#10b981',
    description: 'Proyectos manuales, carpintería, resina y hacks creativos',
    keywords: ['diy', 'manualidad', 'madera', 'resina', 'hacer', 'craft', 'tutorial']
  },
  {
    id: 'research',
    name: 'Temas para Investigar',
    emoji: '🔬',
    color: '#8b5cf6',
    description: 'Curiosidades científicas, historia, libros y teorías',
    keywords: ['ciencia', 'espacio', 'curiosidad', 'historia', 'filosofia', 'libro', 'estudio']
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Rigatoni Cremoso con Salsa de Vodka & Stracciatella',
    source: 'tiktok',
    sourceUrl: 'https://www.tiktok.com/@pastaqueen/video/73291048201',
    author: '@pastaqueen',
    coverImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281057?auto=format&fit=crop&w=800&q=80',
    folderId: 'food',
    starred: true,
    dateAdded: 'Hoy, 15:42',
    summary: 'Pasta con una emulsión sedosa de salsa de tomate San Marzano, reducción de vodka, crema fresca, un toque picante de peperoncino y terminada con stracciatella y albahaca fresca.',
    highlightBadges: ['⏱️ 25 minutos', '🍝 4 Porciones', '🇮🇹 Estilo Italiano'],
    checklistTitle: 'Ingredientes de Compra',
    checklist: [
      { text: '500g Pasta Rigatoni de bronce', completed: true },
      { text: '1 lata de Tomates San Marzano enteros', completed: true },
      { text: '60ml Vodka de buena calidad', completed: false },
      { text: '150ml Crema para batir fresca (35% grasa)', completed: false },
      { text: '200g Stracciatella o burrata fresca', completed: false },
      { text: 'Queso Parmigiano Reggiano 24 meses', completed: false }
    ],
    tags: ['#pasta', '#recetaitaliana', '#comfortfood', '#cenarapida'],
    personalNotes: 'Importante guardar una taza del agua de cocción de la pasta para ligar la salsa antes de agregar el queso.'
  },
  {
    id: 'note-2',
    title: 'Positano & Costa Amalfitana: Los 3 Miradores Ocultos',
    source: 'instagram',
    sourceUrl: 'https://www.instagram.com/reel/C8qXvL1tPqZ/',
    author: '@voyaged',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    folderId: 'places',
    starred: true,
    dateAdded: 'Ayer, 19:20',
    summary: 'Guía de lugares panorámicos libres de multitudes en Positano y Ravello. Mejor hora para fotos doradas y parada recomendada en trattoria familiar escondida con vista al mar Tirreno.',
    highlightBadges: ['📍 Positano, Italia', '📸 Golden Hour 18:30', '💶 Trattoria local'],
    checklistTitle: 'Puntos del Itinerario',
    checklist: [
      { text: 'Mirador de Via Cristoforo Colombo (sin turistas a las 8am)', completed: true },
      { text: 'Jardines de Villa Cimbrone en Ravello', completed: false },
      { text: 'Alquiler de Vespa clásica en Sorrento', completed: false },
      { text: 'Reserva en Trattoria La Tagliata para el atardecer', completed: false }
    ],
    tags: ['#travelitaly', '#amalficoast', '#positano', '#eurosummer'],
    personalNotes: 'Llevar calzado cómodo para las escaleras de piedra. En autobús SITA comprar billete anticipado en quiosco.'
  },
  {
    id: 'note-3',
    title: 'Técnica de Veladuras al Óleo & Paleta Clásica de Rembrandt',
    source: 'instagram',
    sourceUrl: 'https://www.instagram.com/p/C7lKm9xRpVb/',
    author: '@classical_art_atelier',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    folderId: 'art',
    starred: false,
    dateAdded: 'Hace 3 días',
    summary: 'Explicación paso a paso de la técnica del claroscuro mediante capas translúcidas de barniz damar y aceite de linaza. Permite lograr profundidad luminosa en tonos de piel y sombras cálidas.',
    highlightBadges: ['🖌️ Óleo sobre lino', '🎨 Paleta Limitada (4 colores)', '✨ Técnica de Veladuras'],
    checklistTitle: 'Materiales & Pigmentos',
    checklist: [
      { text: 'Blanco de Plomo o Titanio al aceite', completed: true },
      { text: 'Ocre Amarillo natural', completed: true },
      { text: 'Rojo Carmín de Grana / Bermellón', completed: false },
      { text: 'Negro Marfil o de Hueso', completed: false },
      { text: 'Esencia de trementina pura rectificada', completed: true }
    ],
    tags: ['#oilpainting', '#fineart', '#tecnicadearte', '#pinturaclasica'],
    personalNotes: 'Dejar secar 48 horas entre cada veladura para no levantar la capa base de grisalla.'
  },
  {
    id: 'note-4',
    title: 'Lámpara de Mesa Flotante en Roble Macizo con Luz LED Oculta',
    source: 'tiktok',
    sourceUrl: 'https://www.tiktok.com/@woodcraft_tok/video/7298172901',
    author: '@woodcraft_tok',
    coverImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    folderId: 'diy',
    starred: false,
    dateAdded: 'Hace 4 días',
    summary: 'Construcción minimalista con encastre japonés sin clavos. Oculta una tira LED de 3000K con difusor de silicona y regulador táctil integrado en la propia madera.',
    highlightBadges: ['🪵 Roble blanco', '💡 LED 3000K cálida', '⚡ Dificultad Media'],
    checklistTitle: 'Materiales Requeridos',
    checklist: [
      { text: '3 listones de roble 40x40x300mm', completed: true },
      { text: 'Tira LED COB continua 24V (sin puntos)', completed: false },
      { text: 'Sensor táctil capacitivo invisible para madera', completed: false },
      { text: 'Aceite de linaza o cera de abejas para acabado satinado', completed: false }
    ],
    tags: ['#woodworking', '#diyhomedecor', '#minimalismo', '#makers'],
    personalNotes: 'Calar la ranura del difusor antes de lijar las esquinas para un acabado suave y limpio.'
  },
  {
    id: 'note-5',
    title: 'La Paradoja de Fermi & La Hipótesis del Gran Filtro',
    source: 'tiktok',
    sourceUrl: 'https://www.tiktok.com/@ciencia.extrema/video/7311029471',
    author: '@ciencia.extrema',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    folderId: 'research',
    starred: true,
    dateAdded: 'Hace 5 días',
    summary: 'Si en la Vía Láctea existen miles de millones de planetas en zonas habitables, ¿dónde está todo el mundo? Análisis de las tres etapas posibles del Gran Filtro cósmico.',
    highlightBadges: ['🔭 Astrofísica', '🧠 Preguntas Existenciales', '📚 Robin Hanson (1998)'],
    checklistTitle: 'Libros y Artículos para Leer',
    checklist: [
      { text: 'Leer "El problema de los tres cuerpos" (Cixin Liu)', completed: true },
      { text: 'Buscar conferencia de Nick Bostrom sobre civilizaciones tipo Kardashev', completed: false },
      { text: 'Revisar datos recientes del telescopio James Webb sobre biofirmas', completed: false }
    ],
    tags: ['#astronomia', '#paradojadefermi', '#ciencia', '#curiosidades'],
    personalNotes: 'Fascinante concepto: ¿El filtro está detrás de nosotros (origen de la vida) o delante (autodestrucción tecnológica)?'
  }
];
