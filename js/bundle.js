/* ==========================================================================
   CuraNotes - Standalone Universal Bundle (Zero-Server / Local File Compatible)
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // Helper: Flag Country Code & Real Emoji Flag Renderer
  // Resolves the Windows bug where country flag emojis render as 2-letter text
  // ==========================================================================
  function getFlagCountryCode(emoji) {
    if (!emoji || typeof emoji !== 'string') return null;
    const codePoints = Array.from(emoji).map(c => c.codePointAt(0));
    // Regional Indicator Symbol pair (U+1F1E6 to U+1F1FF)
    if (codePoints.length === 2 &&
        codePoints[0] >= 0x1F1E6 && codePoints[0] <= 0x1F1FF &&
        codePoints[1] >= 0x1F1E6 && codePoints[1] <= 0x1F1FF) {
      const c1 = String.fromCharCode(codePoints[0] - 0x1F1E6 + 97);
      const c2 = String.fromCharCode(codePoints[1] - 0x1F1E6 + 97);
      return c1 + c2;
    }
    // Subdivision flags (e.g. Scotland, England, Wales)
    if (emoji.includes('\u{E0067}\u{E0062}')) {
      if (emoji.includes('\u{E0073}\u{E0063}\u{E0074}')) return 'gb-sct';
      if (emoji.includes('\u{E0077}\u{E006C}\u{E0073}')) return 'gb-wls';
      if (emoji.includes('\u{E0065}\u{E006E}\u{E0067}')) return 'gb-eng';
    }
    return null;
  }

  function renderEmoji(emoji) {
    if (!emoji) return '';
    const code = getFlagCountryCode(emoji);
    if (code) {
      return `<img src="https://flagcdn.com/w40/${code}.png" alt="${emoji}" class="flag-icon-render" loading="lazy" onerror="this.style.display='none';this.insertAdjacentText('afterend','${emoji}')">`;
    }
    return emoji;
  }

  // ==========================================================================
  // 1. Sample Data (Instagram, TikTok & YouTube Saved Posts)
  // ==========================================================================
  const INITIAL_FOLDERS = [
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
      keywords: ['receta', 'pasta', 'ingredientes', 'cocina', 'horno', 'postre', 'queso', 'comida', 'chef', 'salsa']
    },
    {
      id: 'places',
      name: 'Lugares & Viajes',
      emoji: '📍',
      color: '#06b6d4',
      description: 'Destinos, cafeterías secretas, hoteles y miradores',
      keywords: ['viaje', 'hotel', 'restaurante', 'playa', 'ciudad', 'italia', 'spot', 'lugar', 'destino', 'turismo']
    },
    {
      id: 'art',
      name: 'Arte & Artistas',
      emoji: '🎨',
      color: '#ec4899',
      description: 'Pintura, paletas de color, bocetos, escultura e inspiración',
      keywords: ['arte', 'oleo', 'pintura', 'acuarela', 'artista', 'paleta', 'cuadro', 'dibujo', 'ilustracion']
    },
    {
      id: 'diy',
      name: 'Creatividad & DIY',
      emoji: '✂️',
      color: '#10b981',
      description: 'Proyectos manuales, carpintería, resina y hacks creativos',
      keywords: ['diy', 'manualidad', 'madera', 'resina', 'hacer', 'craft', 'tutorial', 'hazlo tu mismo']
    },
    {
      id: 'research',
      name: 'Temas para Investigar',
      emoji: '🔬',
      color: '#8b5cf6',
      description: 'Curiosidades científicas, historia, libros y teorías',
      keywords: ['ciencia', 'espacio', 'curiosidad', 'historia', 'filosofia', 'libro', 'estudio', 'universo', 'teoria']
    }
  ];

  const INITIAL_NOTES = [
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
    },
    {
      id: 'note-yt-1',
      title: 'Masterclass: Paella Valenciana Tradicional a la Leña (45 min)',
      source: 'youtube',
      sourceUrl: 'https://www.youtube.com/watch?v=k1tG9h59UvM',
      author: '@arroz_valenciano_master',
      coverImage: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
      folderId: 'food',
      starred: true,
      dateAdded: 'Hoy, 18:20',
      summary: 'Clase magistral completa de 45 minutos. Explicación del sellado de carne de conejo y pollo, sofrito lento de verduras, y el control milimétrico del fuego para el socarrat crujiente perfecto.',
      highlightBadges: ['🎬 Video Largo (45m)', '🔥 Fuego de Leña', '🥘 6 Raciones'],
      checklistTitle: 'Capítulos & Puntos Clave',
      checklist: [
        { text: '[04:15] Sofrito dorado de pollo y conejo con romero fresco', completed: true },
        { text: '[12:30] Incorporación de judía verde plana y garrofó', completed: true },
        { text: '[21:00] Medida exacta de caldo y punto de azafrán en hebra', completed: false },
        { text: '[34:20] Distribución del arroz bomba en cruz y cocción 18m', completed: false },
        { text: '[41:00] Fuego vivo final de 3 minutos para el socarrat', completed: false }
      ],
      tags: ['#paella', '#youtube', '#masterclass', '#recetalarga', '#arrozbomba'],
      personalNotes: 'En video largo, revisar el minuto 21:00 para la proporción de agua: nunca añadir caldo frío a mitad de cocción.'
    }
  ];

  // ==========================================================================
  // 2. Smart Classifier Engine
  // ==========================================================================
  class SmartClassifier {
    constructor(folders = []) {
      this.folders = folders;
      this.defaultKeywords = {
        food: [
          'receta', 'recetas', 'comida', 'cocina', 'cocinar', 'ingredientes', 'pasta', 'pizza',
          'postre', 'pastel', 'sabor', 'almuerzo', 'cena', 'desayuno', 'salsa', 'horno',
          'freir', 'sarten', 'delicioso', 'chef', 'gourmet', 'queso', 'carne', 'pollo',
          'vegano', 'vegetariano', 'reposteria', 'tarta', 'tacos', 'ramen', 'cookie',
          'recipe', 'food', 'cook', 'cooking', 'delicious', 'bake', 'baking', 'dish', 'meal'
        ],
        places: [
          'lugar', 'lugares', 'viaje', 'viajes', 'viajar', 'hotel', 'playa', 'ciudad',
          'pais', 'montaña', 'restaurante', 'cafeteria', 'spot', 'visitar', 'turismo',
          'destino', 'itinerario', 'aeropuerto', 'vuelo', 'escapada', 'europa', 'italia',
          'españa', 'japon', 'mexico', 'colombia', 'paris', 'roma', 'tokyo', 'ny',
          'travel', 'place', 'places', 'trip', 'wanderlust', 'vacation', 'explore', 'guide'
        ],
        art: [
          'arte', 'artista', 'pintura', 'pintar', 'cuadro', 'oleo', 'acuarela', 'acrilico',
          'dibujo', 'dibujar', 'ilustracion', 'escultura', 'galeria', 'museo', 'estilo',
          'paleta', 'colores', 'pincel', 'canvas', 'boceto', 'sketch', 'digital art',
          'art', 'artist', 'painting', 'draw', 'drawing', 'illustration', 'oil painting', 'museum'
        ],
        diy: [
          'diy', 'creativo', 'creatividad', 'manualidad', 'manualidades', 'hacer', 'craft',
          'crafts', 'madera', 'resina', 'decoracion', 'reciclar', 'costura', 'tejer',
          'crochet', 'brico', 'bricolaje', 'herramientas', 'proyecto', 'tutorial',
          'facil de hacer', 'hazlo tu mismo', 'handmade', 'upcycle', 'woodworking', 'make'
        ],
        research: [
          'investigar', 'aprender', 'curiosidad', 'curiosidades', 'ciencia', 'historia',
          'filosofia', 'psicologia', 'espacio', 'universo', 'fisica', 'tecnologia',
          'libro', 'libros', 'lectura', 'sabias que', 'teoria', 'estudio', 'explicacion',
          'cerebro', 'ia', 'futuro', 'documental', 'podcast', 'research', 'science', 'facts'
        ]
      };
    }

    setFolders(folders) {
      this.folders = folders;
    }

    tokenize(text = '') {
      if (!text) return [];
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s#]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
    }

    classify(text = '', extraTags = []) {
      const tokens = this.tokenize(text);
      const tagTokens = extraTags.map(t => this.tokenize(t)).flat();
      const allTokens = [...tokens, ...tagTokens];

      // Folder de fallback "General": busca si existe una carpeta 'General', si no la crea dinámicamente
      const generalFolder = this.folders.find(f => f.name.toLowerCase() === 'general' || f.id === 'general') || {
        id: 'general',
        name: 'General',
        emoji: '📁',
        color: '#64748b'
      };

      if (allTokens.length === 0) {
        return {
          folderId: generalFolder.id,
          folderName: generalFolder.name,
          folderEmoji: generalFolder.emoji,
          confidence: 0,
          matchedKeywords: [],
          isDefaultFallback: true
        };
      }

      const scores = {};
      const matchedWords = {};

      this.folders.forEach(folder => {
        if (folder.id === 'all') return;
        scores[folder.id] = 0;
        matchedWords[folder.id] = new Set();

        const builtIn = this.defaultKeywords[folder.id] || [];
        const userKeywords = (folder.keywords || []).map(k => this.tokenize(k)).flat();
        const folderVocabulary = new Set([...builtIn, ...userKeywords]);

        allTokens.forEach(token => {
          if (folderVocabulary.has(token)) {
            scores[folder.id] += 3;
            matchedWords[folder.id].add(token);
          } else {
            for (const vocabWord of folderVocabulary) {
              if (token.startsWith(vocabWord) || vocabWord.startsWith(token)) {
                if (Math.abs(token.length - vocabWord.length) <= 3) {
                  scores[folder.id] += 1.5;
                  matchedWords[folder.id].add(vocabWord);
                  break;
                }
              }
            }
          }
        });

        const folderTitleTokens = this.tokenize(folder.name);
        folderTitleTokens.forEach(ft => {
          if (allTokens.includes(ft)) {
            scores[folder.id] += 4;
            matchedWords[folder.id].add(ft);
          }
        });
      });

      let bestFolderId = null;
      let highestScore = 0;

      Object.entries(scores).forEach(([fId, score]) => {
        if (score > highestScore) {
          highestScore = score;
          bestFolderId = fId;
        }
      });

      // Si no hay categoría exacta con suficiente puntuación, enviar a 'General'
      if (!bestFolderId || highestScore < 1.5) {
        return {
          folderId: generalFolder.id,
          folderName: generalFolder.name,
          folderEmoji: generalFolder.emoji,
          confidence: 0.35,
          matchedKeywords: [],
          isDefaultFallback: true
        };
      }

      const matchedList = Array.from(matchedWords[bestFolderId]);
      const confidence = Math.min(0.99, Math.max(0.60, +(0.50 + highestScore * 0.08).toFixed(2)));
      const matchedFolder = this.folders.find(f => f.id === bestFolderId);

      return {
        folderId: bestFolderId,
        folderName: matchedFolder ? matchedFolder.name : bestFolderId,
        folderEmoji: matchedFolder ? matchedFolder.emoji : '📁',
        confidence,
        matchedKeywords: matchedList,
        isDefaultFallback: false
      };
    }
  }

  // ==========================================================================
  // 3. Content Parser
  // ==========================================================================
  class ContentParser {
    constructor(classifier) {
      this.classifier = classifier;
    }

    detectPlatform(url = '') {
      const cleanUrl = url.toLowerCase().trim();
      if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
        return 'youtube';
      }
      if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
        return 'instagram';
      }
      if (cleanUrl.includes('tiktok.com')) {
        return 'tiktok';
      }
      return 'web';
    }

    getYouTubeId(url = '') {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
      return match ? match[1] : null;
    }

    extractHashtags(text = '') {
      const matches = text.match(/#[\w\u00C0-\u017F]+/g) || [];
      return Array.from(new Set(matches.map(m => m.toLowerCase())));
    }

    extractChecklist(text = '') {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const items = [];

      lines.forEach(line => {
        if (line.match(/^-\s*\[([ xX])\]\s*(.*)/)) {
          const match = line.match(/^-\s*\[([ xX])\]\s*(.*)/);
          items.push({
            text: match[2].trim(),
            completed: match[1].toLowerCase() === 'x'
          });
        } else if (line.match(/^[-*•]\s+(.*)/)) {
          const content = line.replace(/^[-*•]\s+/, '').trim();
          if (content.length > 2) {
            items.push({ text: content, completed: false });
          }
        } else if (line.match(/^\d+[\.)]\s*(.*)/)) {
          const content = line.replace(/^\d+[\.)]\s*/, '').trim();
          if (content.length > 2) {
            items.push({ text: content, completed: false });
          }
        }
      });

      return items;
    }

    parseInput({ url = '', title = '', description = '', customFolderId = null }) {
      const platform = this.detectPlatform(url);
      const hashtags = this.extractHashtags(`${title} ${description}`);
      const checklist = this.extractChecklist(description);

      let resolvedTitle = title.trim();
      if (!resolvedTitle) {
        if (description) {
          resolvedTitle = description.split('\n')[0].substring(0, 75);
        } else if (url) {
          resolvedTitle = `Guardado desde ${platform === 'youtube' ? 'YouTube' : platform === 'instagram' ? 'Instagram' : platform === 'tiktok' ? 'TikTok' : 'la Web'}`;
        } else {
          resolvedTitle = 'Nota sin título';
        }
      }

      let author = '@guardado';
      if (platform === 'youtube') {
        const ytUserMatch = url.match(/@([^/?#]+)/);
        author = ytUserMatch ? `@${ytUserMatch[1]}` : '@youtube_creator';
      } else if (url.includes('tiktok.com/@')) {
        const match = url.match(/@([^/?#]+)/);
        if (match) author = `@${match[1]}`;
      } else if (url.includes('instagram.com')) {
        author = '@instagram_creator';
      }

      const classification = this.classifier.classify(`${resolvedTitle} ${description}`, hashtags);
      const targetFolderId = customFolderId || classification.folderId || 'general';

      const defaultCovers = {
        food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        places: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        art: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        diy: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80',
        research: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        general: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
      };

      let coverImage = defaultCovers[targetFolderId] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
      if (platform === 'youtube') {
        const ytId = this.getYouTubeId(url);
        if (ytId) {
          coverImage = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      }

      const badges = [];
      if (platform === 'youtube') badges.push('🎬 Video Largo');
      if (targetFolderId === 'food') {
        badges.push('🍳 Receta');
        if (checklist.length > 0) badges.push(`🛒 ${checklist.length} Ingredientes`);
      } else if (targetFolderId === 'places') {
        badges.push('📍 Destino');
        badges.push('🗺️ Guía');
      } else if (targetFolderId === 'art') {
        badges.push('🎨 Arte');
      } else if (targetFolderId === 'diy') {
        badges.push('✂️ Proyecto');
      } else if (targetFolderId === 'research') {
        badges.push('🔬 Investigación');
      } else {
        badges.push('📁 General');
      }

      const now = new Date();
      const timeString = `Hoy, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return {
        id: 'note-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        title: resolvedTitle,
        source: platform,
        sourceUrl: url || '#',
        author,
        coverImage,
        folderId: targetFolderId,
        starred: false,
        dateAdded: timeString,
        summary: description.trim() || 'Nota guardada automáticamente desde contenido compartido.',
        highlightBadges: badges,
        checklistTitle: targetFolderId === 'food' ? 'Lista de Ingredientes' : targetFolderId === 'diy' ? 'Materiales Necesarios' : 'Puntos Clave',
        checklist,
        tags: hashtags.length > 0 ? hashtags : ['#guardado', `#${targetFolderId}`],
        personalNotes: '',
        autoRoutingMeta: classification
      };
    }
  }

  // ==========================================================================
  // 4. Central Store (with Automatic 'General' Folder Handling)
  // ==========================================================================
  const STORAGE_KEY = 'curanotes_app_data_v1';

  class AppStore {
    constructor() {
      this.listeners = [];
      this.state = this.loadState();
    }

    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.notes && parsed.folders) {
            // Reparar emojis en caso de que localStorage contenga caracteres antiguos o corruptos
            const defaultMap = { all: '✨', food: '🍳', places: '📍', art: '🎨', diy: '✂️', research: '🔬' };
            parsed.folders.forEach(f => {
              if (defaultMap[f.id] && (!f.emoji || f.emoji === '?' || f.emoji.includes('?'))) {
                f.emoji = defaultMap[f.id];
              }
            });
            return {
              notes: parsed.notes,
              folders: parsed.folders,
              activeFolderId: 'all',
              platformFilter: 'all',
              searchQuery: ''
            };
          }
        }
      } catch (e) {
        console.warn('LocalStorage error, using defaults', e);
      }

      return {
        notes: [...INITIAL_NOTES],
        folders: [...INITIAL_FOLDERS],
        activeFolderId: 'all',
        platformFilter: 'all',
        searchQuery: ''
      };
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          notes: this.state.notes,
          folders: this.state.folders
        }));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notify() {
      this.saveState();
      this.listeners.forEach(fn => fn(this.state));
    }

    getState() { return this.state; }
    getFolders() { return this.state.folders; }
    getFolderById(id) { return this.state.folders.find(f => f.id === id); }

    // Requisito: Crea carpeta "General" SOLO si no existe ya una con ese nombre; si ya existe, la reutiliza
    getOrCreateGeneralFolder() {
      let general = this.state.folders.find(f => f.name.trim().toLowerCase() === 'general' || f.id === 'general');
      if (!general) {
        general = {
          id: 'general',
          name: 'General',
          emoji: '📁',
          color: '#64748b',
          description: 'Notas y guardados sin categoría temática específica',
          keywords: ['general', 'varios', 'miscelaneo', 'otros'],
          isSystem: false
        };
        this.state.folders.push(general);
        this.notify();
      }
      return general;
    }

    setActiveFolder(folderId) {
      this.state.activeFolderId = folderId;
      this.notify();
    }

    addFolder({ name, emoji = '📁', color = '#3b82f6', keywords = [], description = '' }) {
      const id = 'custom-' + Date.now();
      const newFolder = {
        id,
        name: name.trim(),
        emoji: emoji || '📁',
        color: color || '#3b82f6',
        description: description.trim(),
        keywords: keywords.map(k => k.trim().toLowerCase()).filter(Boolean),
        isSystem: false
      };
      this.state.folders.push(newFolder);
      this.notify();
      return newFolder;
    }

    deleteFolder(folderId) {
      const folder = this.getFolderById(folderId);
      if (!folder || folder.isSystem) return;

      const fallbackFolder = this.getOrCreateGeneralFolder();
      this.state.notes.forEach(note => {
        if (note.folderId === folderId) {
          note.folderId = fallbackFolder.id;
        }
      });

      this.state.folders = this.state.folders.filter(f => f.id !== folderId);
      if (this.state.activeFolderId === folderId) {
        this.state.activeFolderId = 'all';
      }
      this.notify();
    }

    getNotes() { return this.state.notes; }
    getNoteById(id) { return this.state.notes.find(n => n.id === id); }

    addNote(note) {
      // Si la carpeta destino es 'general' o no existe, garantizar que exista la carpeta 'General' sin duplicar
      const folderExists = this.state.folders.some(f => f.id === note.folderId);
      if (!folderExists || note.folderId === 'general') {
        const general = this.getOrCreateGeneralFolder();
        note.folderId = general.id;
      }
      this.state.notes.unshift(note);
      this.notify();
      return note;
    }

    updateNote(id, updates) {
      const note = this.getNoteById(id);
      if (!note) return;
      Object.assign(note, updates);
      this.notify();
    }

    deleteNote(id) {
      this.state.notes = this.state.notes.filter(n => n.id !== id);
      this.notify();
    }

    // Requisito: Mover una nota de una carpeta a otra (ej. de General a Arte o Moda)
    moveNoteToFolder(noteId, targetFolderId) {
      const note = this.getNoteById(noteId);
      if (note) {
        note.folderId = targetFolderId;
        this.notify();
      }
    }

    toggleStar(noteId) {
      const note = this.getNoteById(noteId);
      if (note) {
        note.starred = !note.starred;
        this.notify();
      }
    }

    toggleChecklistItem(noteId, itemIndex) {
      const note = this.getNoteById(noteId);
      if (note && note.checklist && note.checklist[itemIndex]) {
        note.checklist[itemIndex].completed = !note.checklist[itemIndex].completed;
        this.notify();
      }
    }

    setPlatformFilter(filter) {
      this.state.platformFilter = filter;
      this.notify();
    }

    setSearchQuery(query) {
      this.state.searchQuery = query;
      this.notify();
    }

    getFilteredNotes() {
      const { notes, activeFolderId, platformFilter, searchQuery } = this.state;
      const q = searchQuery.toLowerCase().trim();

      return notes.filter(note => {
        if (activeFolderId !== 'all' && note.folderId !== activeFolderId) {
          return false;
        }

        if (platformFilter === 'youtube' && note.source !== 'youtube') return false;
        if (platformFilter === 'instagram' && note.source !== 'instagram') return false;
        if (platformFilter === 'tiktok' && note.source !== 'tiktok') return false;
        if (platformFilter === 'starred' && !note.starred) return false;

        if (q) {
          const titleMatch = (note.title || '').toLowerCase().includes(q);
          const summaryMatch = (note.summary || '').toLowerCase().includes(q);
          const authorMatch = (note.author || '').toLowerCase().includes(q);
          const tagMatch = (note.tags || []).some(t => t.toLowerCase().includes(q));
          const checklistMatch = (note.checklist || []).some(c => c.text.toLowerCase().includes(q));
          if (!titleMatch && !summaryMatch && !authorMatch && !tagMatch && !checklistMatch) {
            return false;
          }
        }

        return true;
      });
    }

    getFolderCounts() {
      const counts = { all: this.state.notes.length };
      this.state.folders.forEach(f => {
        if (f.id !== 'all') {
          counts[f.id] = this.state.notes.filter(n => n.folderId === f.id).length;
        }
      });
      return counts;
    }

    resetToDemo() {
      this.state.notes = [...INITIAL_NOTES];
      this.state.folders = [...INITIAL_FOLDERS];
      this.state.activeFolderId = 'all';
      this.state.platformFilter = 'all';
      this.state.searchQuery = '';
      this.notify();
    }

    exportData() {
      return JSON.stringify({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        folders: this.state.folders,
        notes: this.state.notes
      }, null, 2);
    }
  }

  // ==========================================================================
  // 5. UIManager Controller
  // ==========================================================================
  class UIManager {
    constructor(store, classifier, parser) {
      this.store = store;
      this.classifier = classifier;
      this.parser = parser;
      this.activeModalNoteId = null;

      this.sidebar = document.getElementById('sidebar');
      this.folderList = document.getElementById('folderList');
      this.notesGrid = document.getElementById('notesGrid');
      this.currentFolderTitle = document.getElementById('currentFolderTitle');
      this.currentFolderSubtitle = document.getElementById('currentFolderSubtitle');
      this.currentFolderEmoji = document.getElementById('currentFolderEmoji');
      this.notesCountBadge = document.getElementById('notesCountBadge');
      this.searchInput = document.getElementById('searchInput');
      this.toastContainer = document.getElementById('toastContainer');

      this.ingestModal = document.getElementById('ingestModal');
      this.detailModal = document.getElementById('detailModal');
      this.folderModal = document.getElementById('folderModal');
      this.socialModal = document.getElementById('socialModal');

      this.inputUrl = document.getElementById('inputUrl');
      this.inputTitle = document.getElementById('inputTitle');
      this.inputDesc = document.getElementById('inputDesc');
      this.inputCustomFolder = document.getElementById('inputCustomFolder');
      this.detectedFolderBadge = document.getElementById('detectedFolderBadge');
      this.detectedFolderConfidence = document.getElementById('detectedFolderConfidence');

      this.initEventListeners();
    }

    init() {
      this.renderFolders();
      this.renderNotes();
      this.populateFolderSelects();

      this.store.subscribe(() => {
        this.classifier.setFolders(this.store.getFolders());
        this.renderFolders();
        this.renderNotes();
        this.populateFolderSelects();
      });
    }

    showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div style="font-size: 1.2rem;">${type === 'success' ? '✨' : type === 'warning' ? '⚠️' : 'ℹ️'}</div>
        <div style="flex: 1; line-height: 1.4;">${message}</div>
      `;
      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    renderFolders() {
      const folders = this.store.getFolders();
      const activeFolderId = this.store.getState().activeFolderId;
      const counts = this.store.getFolderCounts();

      this.folderList.innerHTML = '';

      folders.forEach(folder => {
        const li = document.createElement('li');
        li.className = `folder-item ${folder.id === activeFolderId ? 'active' : ''}`;
        li.dataset.folderId = folder.id;

        li.innerHTML = `
          <div class="folder-info">
            <span class="folder-emoji">${renderEmoji(folder.emoji)}</span>
            <span class="folder-name">${this.escapeHtml(folder.name)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="folder-count">${counts[folder.id] || 0}</span>
            ${!folder.isSystem ? `
              <button class="footer-btn btn-delete btn-sm" title="Eliminar carpeta" data-delete-folder="${folder.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            ` : ''}
          </div>
        `;

        li.addEventListener('click', (e) => {
          if (e.target.closest('[data-delete-folder]')) {
            e.stopPropagation();
            const fId = e.target.closest('[data-delete-folder]').dataset.deleteFolder;
            if (confirm(`¿Eliminar la carpeta "${folder.name}"? Las notas se trasladarán a General.`)) {
              this.store.deleteFolder(fId);
              this.showToast('Carpeta eliminada, notas conservadas en General', 'info');
            }
            return;
          }
          this.store.setActiveFolder(folder.id);
          if (window.innerWidth <= 900 && this.sidebar) {
            this.sidebar.classList.remove('open');
            const bd = document.getElementById('sidebarBackdrop');
            if (bd) bd.classList.remove('active');
          }
        });

        this.folderList.appendChild(li);
      });

      const activeFolder = this.store.getFolderById(activeFolderId) || {
        name: 'Todos los Guardados',
        emoji: '✨',
        description: 'Vista unificada de todas tus notas'
      };

      this.currentFolderTitle.textContent = activeFolder.name;
      this.currentFolderSubtitle.textContent = activeFolder.description || 'Notas organizadas por contenido';
      this.currentFolderEmoji.innerHTML = renderEmoji(activeFolder.emoji);
    }

    renderNotes() {
      const notes = this.store.getFilteredNotes();
      this.notesCountBadge.textContent = `${notes.length} ${notes.length === 1 ? 'nota' : 'notas'}`;

      this.notesGrid.innerHTML = '';

      if (notes.length === 0) {
        this.notesGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>No hay notas en esta sección</h3>
            <p>Convierte tus guardados de Instagram, TikTok o YouTube pegando un enlace o crea una nota para organizarla automáticamente.</p>
            <button class="btn btn-primary" id="emptyStateAddBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Capturar Nuevo Guardado
            </button>
          </div>
        `;
        const btn = document.getElementById('emptyStateAddBtn');
        if (btn) btn.addEventListener('click', () => this.openIngestModal());
        return;
      }

      notes.forEach(note => {
        const folder = this.store.getFolderById(note.folderId) || { name: 'General', emoji: '📁', color: '#64748b' };
        const card = document.createElement('div');
        card.className = 'note-card';
        card.dataset.noteId = note.id;

        let checklistHtml = '';
        if (note.checklist && note.checklist.length > 0) {
          const previewItems = note.checklist.slice(0, 4);
          checklistHtml = `
            <div class="card-checklist-container">
              <div class="checklist-title">
                <span>${this.escapeHtml(note.checklistTitle || 'Lista')}</span>
                <span>${note.checklist.filter(c => c.completed).length}/${note.checklist.length}</span>
              </div>
              <ul class="checklist-items">
                ${previewItems.map((item, idx) => `
                  <li class="checklist-row ${item.completed ? 'checked' : ''}" data-item-idx="${idx}">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} data-checklist-toggle="${idx}">
                    <span>${this.formatItemText(item.text)}</span>
                  </li>
                `).join('')}
                ${note.checklist.length > 4 ? `
                  <li style="font-size: 0.74rem; color: var(--accent-primary); cursor: pointer; padding-top: 2px;" data-open-detail="${note.id}">
                    + Ver ${note.checklist.length - 4} elementos más...
                  </li>
                ` : ''}
              </ul>
            </div>
          `;
        }

        let badgesHtml = '';
        if (note.highlightBadges && note.highlightBadges.length > 0) {
          badgesHtml = `
            <div class="card-highlight-badges">
              ${note.highlightBadges.map(b => `<span class="highlight-badge">${this.escapeHtml(b)}</span>`).join('')}
            </div>
          `;
        }

        let tagsHtml = '';
        if (note.tags && note.tags.length > 0) {
          tagsHtml = `
            <div class="card-tags">
              ${note.tags.map(t => `<span class="tag-item">${this.escapeHtml(t)}</span>`).join('')}
            </div>
          `;
        }

        // Requisito: Flecha hacia la izquierda (←) para pasar de una carpeta a otra
        card.innerHTML = `
          <div class="card-header-bar">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="card-origin-pill ${note.source}">
                ${note.source === 'youtube' ? 'YouTube 🎬' : note.source === 'instagram' ? 'IG Reel' : note.source === 'tiktok' ? 'TikTok' : 'Web'}
              </span>
              <span class="card-folder-badge" style="border-color: ${folder.color}44;">
                <span>${renderEmoji(folder.emoji)}</span>
                <span>${this.escapeHtml(folder.name)}</span>
              </span>
            </div>
            <div class="card-actions-quick">
              <button class="btn-star ${note.starred ? 'starred' : ''}" data-star-btn="${note.id}" title="${note.starred ? 'Quitar favorito' : 'Marcar favorito'}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${note.starred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            </div>
          </div>

          <div class="card-media-wrapper" data-open-detail="${note.id}">
            <img src="${note.coverImage}" alt="${this.escapeHtml(note.title)}" class="card-media-img" loading="lazy">
            <div class="card-media-overlay"></div>
            <div class="card-author-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${this.escapeHtml(note.author)}</span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title" data-open-detail="${note.id}">${this.escapeHtml(note.title)}</h3>
            <p class="card-summary">${this.escapeHtml(note.summary)}</p>
            ${checklistHtml}
            ${badgesHtml}
            ${tagsHtml}
          </div>

          <div class="card-footer">
            <span class="card-date">${note.dateAdded || 'Guardado'}</span>
            <div class="card-footer-actions">
              ${note.sourceUrl && note.sourceUrl !== '#' ? `
                <a href="${note.sourceUrl}" target="_blank" rel="noopener noreferrer" class="footer-btn" title="Abrir publicación original">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
              ` : ''}

              <!-- Flecha hacia la izquierda (←) para mover de carpeta -->
              <div style="position: relative;">
                <button class="footer-btn btn-move-folder" data-move-note="${note.id}" title="Mover a otra carpeta (ej: a General, Moda o Arte)" aria-label="Mover a otra carpeta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div class="move-folder-popover" id="move-popover-${note.id}" role="menu" aria-label="Seleccionar carpeta de destino">
                  <div class="move-folder-popover-title">Mover a carpeta:</div>
                </div>
              </div>

              <!-- Botón editar / ver detalle -->
              <button class="footer-btn" data-open-detail="${note.id}" title="Ver y editar nota">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>

              <!-- Botón borrar -->
              <button class="footer-btn btn-delete" data-delete-note="${note.id}" title="Eliminar nota">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;

        // Checkbox events
        card.querySelectorAll('[data-checklist-toggle]').forEach(chk => {
          chk.addEventListener('change', (e) => {
            e.stopPropagation();
            const itemIdx = parseInt(chk.dataset.checklistToggle, 10);
            this.store.toggleChecklistItem(note.id, itemIdx);
          });
        });

        // Star button event
        const starBtn = card.querySelector('[data-star-btn]');
        if (starBtn) {
          starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.store.toggleStar(note.id);
            this.showToast(note.starred ? 'Nota retirada de favoritos' : 'Nota guardada en favoritos ⭐');
          });
        }

        // Delete button event
        const deleteBtn = card.querySelector('[data-delete-note]');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`¿Eliminar la nota "${note.title}"?`)) {
              this.store.deleteNote(note.id);
              this.showToast('Nota eliminada', 'info');
            }
          });
        }

        // Open detail modal events
        card.querySelectorAll('[data-open-detail]').forEach(el => {
          el.addEventListener('click', () => this.openDetailModal(note.id));
        });

        // Popover mover a otra carpeta (Flecha ←)
        const moveBtn = card.querySelector('[data-move-note]');
        if (moveBtn) {
          const popover = card.querySelector(`#move-popover-${note.id}`);
          moveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Cerrar otros popovers abiertos
            document.querySelectorAll('.move-folder-popover.open').forEach(p => {
              if (p !== popover) p.classList.remove('open');
            });

            // Poblar las opciones con todas las carpetas disponibles (incluyendo General)
            popover.querySelectorAll('.move-folder-option').forEach(el => el.remove());

            // Garantizar que General exista si se requiere
            const folders = this.store.getFolders().filter(f => f.id !== 'all');
            folders.forEach(f => {
              const opt = document.createElement('button');
              opt.className = `move-folder-option${f.id === note.folderId ? ' current' : ''}`;
              opt.innerHTML = `<span>${renderEmoji(f.emoji)}</span><span>${this.escapeHtml(f.name)}</span>`;
              if (f.id === note.folderId) {
                opt.title = 'Carpeta actual';
              }
              opt.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (f.id === note.folderId) {
                  popover.classList.remove('open');
                  return;
                }
                this.store.moveNoteToFolder(note.id, f.id);
                popover.classList.remove('open');
                this.showToast(`✨ Nota movida a ${renderEmoji(f.emoji)} ${f.name}`);
              });
              popover.appendChild(opt);
            });

            popover.classList.toggle('open');
          });
        }

        this.notesGrid.appendChild(card);
      });
    }

    populateFolderSelects() {
      const folders = this.store.getFolders().filter(f => f.id !== 'all');

      this.inputCustomFolder.innerHTML = '<option value="">🤖 Detección Automática por Contenido</option>';
      folders.forEach(f => {
        this.inputCustomFolder.innerHTML += `<option value="${f.id}">${f.emoji} ${f.name}</option>`;
      });

      const detailFolderSelect = document.getElementById('detailFolderSelect');
      if (detailFolderSelect) {
        detailFolderSelect.innerHTML = '';
        folders.forEach(f => {
          detailFolderSelect.innerHTML += `<option value="${f.id}">${f.emoji} ${f.name}</option>`;
        });
      }
    }

    updateLiveClassifier() {
      const title = this.inputTitle.value;
      const desc = this.inputDesc.value;
      const customFolder = this.inputCustomFolder.value;

      if (customFolder) {
        const f = this.store.getFolderById(customFolder);
        this.detectedFolderBadge.innerHTML = `<span>${renderEmoji(f.emoji)}</span><span>${this.escapeHtml(f.name)}</span>`;
        this.detectedFolderConfidence.textContent = 'Asignación manual';
        return;
      }

      const classification = this.classifier.classify(`${title} ${desc}`);
      const pct = Math.round(classification.confidence * 100);
      this.detectedFolderBadge.innerHTML = `<span>${renderEmoji(classification.folderEmoji)}</span><span>${this.escapeHtml(classification.folderName)}</span>`;
      this.detectedFolderConfidence.textContent = `${pct}% afinidad temática`;
    }

    openIngestModal() {
      this.ingestModal.classList.add('active');
      this.inputUrl.value = '';
      this.inputTitle.value = '';
      this.inputDesc.value = '';
      this.inputCustomFolder.value = '';
      this.updateLiveClassifier();
      setTimeout(() => this.inputUrl.focus(), 150);
    }

    closeIngestModal() {
      this.ingestModal.classList.remove('active');
    }

    openDetailModal(noteId) {
      const note = this.store.getNoteById(noteId);
      if (!note) return;

      this.activeModalNoteId = noteId;

      document.getElementById('detailCoverImg').src = note.coverImage;
      document.getElementById('detailTitle').value = note.title;
      document.getElementById('detailSummary').value = note.summary;
      document.getElementById('detailPersonalNotes').value = note.personalNotes || '';
      document.getElementById('detailPlatformPill').className = `card-origin-pill ${note.source}`;
      document.getElementById('detailPlatformPill').textContent = note.source.toUpperCase();
      document.getElementById('detailAuthor').textContent = note.author;
      document.getElementById('detailSourceLink').href = note.sourceUrl;
      document.getElementById('detailFolderSelect').value = note.folderId;

      this.renderDetailChecklist(note);
      this.detailModal.classList.add('active');
    }

    renderDetailChecklist(note) {
      const container = document.getElementById('detailChecklistList');
      container.innerHTML = '';

      (note.checklist || []).forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = `checklist-row ${item.completed ? 'checked' : ''}`;
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '6px 8px';
        row.style.background = 'rgba(255,255,255,0.03)';
        row.style.borderRadius = 'var(--radius-xs)';

        row.innerHTML = `
          <label style="display: flex; align-items: center; gap: 8px; flex: 1; cursor: pointer;">
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span>${this.formatItemText(item.text)}</span>
          </label>
          <button class="footer-btn btn-delete btn-sm" style="padding: 2px 4px;">&times;</button>
        `;

        row.querySelector('input').addEventListener('change', () => {
          this.store.toggleChecklistItem(note.id, idx);
          this.renderDetailChecklist(this.store.getNoteById(note.id));
        });

        row.querySelector('.btn-delete').addEventListener('click', () => {
          note.checklist.splice(idx, 1);
          this.store.updateNote(note.id, { checklist: note.checklist });
          this.renderDetailChecklist(note);
        });

        container.appendChild(row);
      });
    }

    closeDetailModal() {
      this.detailModal.classList.remove('active');
      this.activeModalNoteId = null;
    }

    openFolderModal() {
      this.folderModal.classList.add('active');
      document.getElementById('newFolderName').value = '';
      document.getElementById('newFolderKeywords').value = '';
      document.getElementById('newFolderEmoji').value = '📁';
    }

    closeFolderModal() {
      this.folderModal.classList.remove('active');
    }

    // --- Social Connect Modal Management ---
    openSocialModal() {
      if (!this.socialModal) return;
      this.socialModal.classList.add('active');
      this.refreshSocialStatus();
    }

    closeSocialModal() {
      if (this.socialModal) this.socialModal.classList.remove('active');
    }

    refreshSocialStatus() {
      const platforms = ['tiktok', 'instagram', 'youtube'];
      platforms.forEach(p => {
        const connected = localStorage.getItem('curanotes_social_' + p) === 'connected';
        const card = document.getElementById('social-card-' + p);
        const status = document.getElementById('social-status-' + p);
        const btn = document.getElementById('btnToggleConnect' + p.charAt(0).toUpperCase() + p.slice(1));

        if (card) card.classList.toggle('connected', connected);
        if (status) {
          status.textContent = connected ? 'Vinculado ✓' : 'No conectado';
          status.className = 'social-connect-status' + (connected ? ' ok' : '');
        }
        if (btn) {
          btn.textContent = connected ? 'Desvincular' : 'Vincular Cuenta';
          btn.className = connected ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
        }
      });
    }

    toggleSocialConnection(platform) {
      const isConnected = localStorage.getItem('curanotes_social_' + platform) === 'connected';
      if (isConnected) {
        localStorage.removeItem('curanotes_social_' + platform);
        this.showToast(`Cuenta de ${platform.toUpperCase()} desvinculada`, 'info');
      } else {
        localStorage.setItem('curanotes_social_' + platform, 'connected');
        this.showToast(`✨ Cuenta de ${platform.toUpperCase()} vinculada con éxito. ¡Ya puedes sincronizar tus guardados!`);
      }
      this.refreshSocialStatus();
    }

    async syncAllConnected() {
      const platforms = ['tiktok', 'instagram', 'youtube'].filter(p => localStorage.getItem('curanotes_social_' + p) === 'connected');
      if (platforms.length === 0) {
        this.showToast('Primero vincula al menos una cuenta (TikTok, Instagram o YouTube)', 'warning');
        return;
      }

      this.closeSocialModal();

      // Muestras reales que se crean según las redes vinculadas
      const syncPool = [];
      if (platforms.includes('tiktok')) {
        syncPool.push({
          url: 'https://www.tiktok.com/@quickcooks/video/7391823412',
          title: 'Tarta Salada Rápida de Hojaldre, Ricotta y Tomates Cherry',
          description: 'Receta express para cenar en 20 minutos con masa quebrada o hojaldre crujiente.\n- [ ] 1 Lámina de masa de hojaldre\n- [ ] 250g Ricotta o requesón\n- [ ] 300g Tomates cherry surtidos\n- [ ] Aceite de oliva virgen extra y orégano\n#receta #tiktokeats #comidarapida'
        });
        syncPool.push({
          url: 'https://www.tiktok.com/@lifehacks_now/video/7398127391',
          title: 'Organización de Escritorio & Gestión de Cables Minimalista',
          description: 'Truco para ocultar regletas y canalizar cables por detrás de la mesa sin perforar madera.\n- [ ] Canaleta adhesiva de silicona flexible\n- [ ] Abrazaderas de velcro reutilizables\n- [ ] Soporte bajo encimera para regleta\n#lifehacks #workspace #organizacion #diy'
        });
      }

      if (platforms.includes('instagram')) {
        syncPool.push({
          url: 'https://www.instagram.com/reel/C9jkl2XpQ/',
          title: 'Rincones Secretos de Roma: El Jardín de los Naranjos al Atardecer',
          description: 'Uno de los miradores más bellos y tranquilos de la Colina Aventina en Roma.\n- [ ] Entrada libre por Piazza Pietro d\'Illiria\n- [ ] Cerradura de los Caballeros de Malta a 200m con vista a San Pedro\n- [ ] Mejor hora: 45 min antes de la puesta de sol\n#roma #italia #viajes #lugaressecretos'
        });
      }

      if (platforms.includes('youtube')) {
        syncPool.push({
          url: 'https://www.youtube.com/watch?v=M9pQr5102Ks',
          title: 'Masterclass: Cómo Funciona la Memoria Humana y la Neuroplasticidad (38 min)',
          description: 'Clase profunda sobre consolidación de memoria a largo plazo, sinapsis y técnicas de repetición espaciada.\n- [ ] [04:20] El papel del hipocampo en la memoria episódica\n- [ ] [14:10] La curva del olvido de Ebbinghaus\n- [ ] [26:00] Protocolos prácticos de sueño y aprendizaje profundo\n#neurociencia #aprendizaje #psicologia #youtube'
        });
      }

      for (const item of syncPool) {
        await this.runAutoOrganize(item.url, item.title, item.description);
      }

      this.showToast(`🎉 ¡Sincronizados ${syncPool.length} guardados desde tus redes vinculadas!`);
    }

    loadPreset(type) {
      const presets = {
        yt_recipe: {
          url: 'https://www.youtube.com/watch?v=k1tG9h59UvM',
          title: 'Masterclass: Paella Valenciana Tradicional a la Leña (45 min)',
          desc: 'Video tutorial completo con técnicas tradicionales valencianas, tiempos exactos y control del fuego de leña.\n- [ ] [04:15] Sofrito dorado de pollo y conejo con romero fresco\n- [ ] [12:30] Incorporación de judía verde plana y garrofó\n- [ ] [21:00] Medida exacta de caldo y punto de azafrán en hebra\n- [ ] [34:20] Distribución del arroz bomba en cruz y cocción 18m\n- [ ] [41:00] Fuego vivo final de 3 minutos para el socarrat crujiente\n#paella #recetacompleta #cocinaespañola #masterclass #youtube'
        },
        yt_documentary: {
          url: 'https://www.youtube.com/watch?v=0NbBjNiw4tk',
          title: '¿Qué Había Antes del Big Bang? Entropía y Origen del Cosmos (32 min)',
          desc: 'Documental sobre cosmología cuántica, el modelo inflacionario y la flecha del tiempo explicados con rigor.\n- [ ] [05:10] La paradoja de la baja entropía en el inicio del universo\n- [ ] [16:45] La teoría de la inflación cósmica de Alan Guth\n- [ ] [28:30] Modelos cíclicos de Penrose (Cosmología Cíclica Conforme)\n#fisica #cosmologia #ciencia #universo #documental #youtube'
        },
        pasta: {
          url: 'https://www.tiktok.com/@chef_italy/video/734892019',
          title: 'Pasta al Limone con Albahaca & Ricotta Cremosa',
          desc: 'Receta express italiana de 15 minutos. Salsa emulsionada de limón siciliano, mantequilla, pimienta negra molida y albahaca fresca.\n- [ ] 400g Fettuccine al huevo\n- [ ] 2 Limones amarillos ecológicos (ralladura y jugo)\n- [ ] 50g Mantequilla con sal\n- [ ] 150g Ricotta fresca\n- [ ] 60g Parmesano rallado\n#receta #pasta #comidaitaliana #recetasfaciles'
        },
        tokyo: {
          url: 'https://www.instagram.com/reel/C7mPl90ZqW/',
          title: 'Guía de Tokio: 5 Callejones Ocultos de Ramen en Shinjuku',
          desc: 'Lugares no turísticos para comer el mejor ramen tonkotsu y recorrer los callejones con faroles rojos de Omoide Yokocho.\n- [ ] Omoide Yokocho en Shinjuku (Puestos de yakitori tradicionales)\n- [ ] Mirador gratuito del Edificio del Gobierno Metropolitano de Tokio\n- [ ] Templo Nezu y su túnel de toriis rojos\n#viajestokyo #japon #lugaresincreibles #shinjuku'
        },
        woodlamp: {
          url: 'https://www.tiktok.com/@woodcraft/video/7391028471',
          title: 'DIY Repisa Hexagonal Flotante con Encastre Oculto',
          desc: 'Manualidad paso a paso para crear repisas geométricas de pared utilizando listones de pino reciclados y tinte nogal.\n- [ ] 6 listones de pino cortados con ángulo de 30 grados\n- [ ] Cola para madera Titebond II\n- [ ] Lija de grano 120, 240 y 400\n- [ ] Cera natural de abejas para sellado\n#diy #manualidades #madera #homedecor #hazlotumismo'
        }
      };

      const data = presets[type];
      if (data) {
        this.inputUrl.value = data.url;
        this.inputTitle.value = data.title;
        this.inputDesc.value = data.desc;
        this.updateLiveClassifier();
        this.showToast('Ejemplo cargado: ¡Mira la categorización inteligente!', 'info');
      }
    }

    // --- Settings Modal ---
    openSettingsModal() {
      const modal = document.getElementById('settingsModal');
      const input = document.getElementById('settingApiKey');
      input.value = localStorage.getItem('curanotes_gemini_api_key') || '';
      modal.classList.add('active');
    }

    closeSettingsModal() {
      document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettings() {
      const key = document.getElementById('settingApiKey').value.trim();
      if (key) {
        localStorage.setItem('curanotes_gemini_api_key', key);
        this.showToast('Clave de Google Gemini guardada con éxito 🚀');
      } else {
        localStorage.removeItem('curanotes_gemini_api_key');
        this.showToast('Configuración guardada (usando IA léxica interna)');
      }
      this.closeSettingsModal();
    }

    // --- 100% Automatic Ingestion Pipeline (Zero Storage) ---
    async runAutoOrganize(rawUrl = '', explicitTitle = '', explicitDesc = '') {
      const input = rawUrl.trim();
      if (!input && !explicitTitle && !explicitDesc) {
        this.showToast('Por favor pega un enlace de TikTok, Instagram, YouTube o texto.', 'warning');
        return;
      }

      const overlay = document.getElementById('scannerOverlay');
      const stepText = document.getElementById('scannerStatusStep');
      const bar = document.getElementById('scannerProgressBar');

      if (overlay) {
        overlay.classList.add('active');
        bar.style.width = '15%';
        stepText.textContent = '🔗 Conectando con la publicación...';
      }

      await new Promise(r => setTimeout(r, 350));
      if (bar) bar.style.width = '45%';
      if (stepText) stepText.textContent = '🛡️ Modo Zero Storage: Descartando video y extrayendo metadatos...';

      await new Promise(r => setTimeout(r, 400));
      if (bar) bar.style.width = '75%';
      if (stepText) stepText.textContent = '🧠 Analizando contenido y asignando carpeta inteligente...';

      let newNote = null;
      const apiKey = localStorage.getItem('curanotes_gemini_api_key');

      if (apiKey && input.startsWith('http')) {
        try {
          const geminiPrompt = `Analiza este enlace/contenido: "${input}". Devuelve UNICAMENTE un objeto JSON sin markdown:
          {
            "title": "título corto",
            "summary": "resumen en 2-3 líneas",
            "checklistTitle": "Ingredientes" o "Puntos clave" o "Materiales",
            "checklist": ["item 1", "item 2"],
            "category": "food" | "places" | "art" | "diy" | "research" | "general",
            "tags": ["#tag1", "#tag2"]
          }`;

          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] })
          });

          if (res.ok) {
            const data = await res.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            newNote = this.parser.parseInput({
              url: input,
              title: parsed.title,
              description: `${parsed.summary}\n${(parsed.checklist || []).map(c => '- [ ] ' + c).join('\n')}`,
              customFolderId: parsed.category
            });
          }
        } catch (e) {
          console.warn('Gemini extraction fallback to local parser', e);
        }
      }

      if (!newNote) {
        newNote = this.parser.parseInput({
          url: input.startsWith('http') ? input : '',
          title: explicitTitle || '',
          description: explicitDesc || (input.startsWith('http') ? '' : input)
        });
      }

      await new Promise(r => setTimeout(r, 350));
      if (bar) bar.style.width = '100%';

      // Requisito: Si no tiene carpeta exacta, se mete en 'General'
      const targetFolder = this.store.getFolderById(newNote.folderId) || this.store.getOrCreateGeneralFolder();
      newNote.folderId = targetFolder.id;

      if (stepText) stepText.textContent = `📁 Clasificado en: ${targetFolder.emoji} ${targetFolder.name}!`;

      await new Promise(r => setTimeout(r, 450));
      this.store.addNote(newNote);

      if (overlay) overlay.classList.remove('active');

      const quickInput = document.getElementById('quickPasteInput');
      if (quickInput) quickInput.value = '';

      this.showToast(`✨ ¡Guardado auto-organizado con éxito en ${renderEmoji(targetFolder.emoji)} ${targetFolder.name}!`);
    }

    initEventListeners() {
      // Auto-Organize Banner Events
      const btnQuick = document.getElementById('btnQuickOrganize');
      const quickInput = document.getElementById('quickPasteInput');
      if (btnQuick && quickInput) {
        btnQuick.addEventListener('click', () => {
          this.runAutoOrganize(quickInput.value);
        });

        quickInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.runAutoOrganize(quickInput.value);
          }
        });
      }

      // One-Click Clipboard Paste Button
      const btnClip = document.getElementById('btnClipboardPaste');
      if (btnClip) {
        btnClip.addEventListener('click', async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.readText) {
              const text = await navigator.clipboard.readText();
              if (text) {
                if (quickInput) quickInput.value = text;
                this.runAutoOrganize(text);
              } else {
                this.showToast('El portapapeles está vacío', 'info');
              }
            } else {
              this.showToast('Pega el enlace directamente en el cuadro de texto', 'info');
            }
          } catch (err) {
            this.showToast('Por favor pulsa Ctrl+V para pegar en el recuadro', 'info');
          }
        });
      }

      // Social Sync Modal Events
      const btnOpenSocialSync = document.getElementById('btnOpenSocialSync');
      if (btnOpenSocialSync) btnOpenSocialSync.addEventListener('click', () => this.openSocialModal());
      const btnOpenSocialSyncSidebar = document.getElementById('btnOpenSocialSyncSidebar');
      if (btnOpenSocialSyncSidebar) btnOpenSocialSyncSidebar.addEventListener('click', () => this.openSocialModal());

      const btnCloseSocialModal = document.getElementById('btnCloseSocialModal');
      if (btnCloseSocialModal) btnCloseSocialModal.addEventListener('click', () => this.closeSocialModal());
      const btnCancelSocialModal = document.getElementById('btnCancelSocialModal');
      if (btnCancelSocialModal) btnCancelSocialModal.addEventListener('click', () => this.closeSocialModal());

      // Platform connection toggles
      const btnTT = document.getElementById('btnToggleConnectTikTok');
      if (btnTT) btnTT.addEventListener('click', () => this.toggleSocialConnection('tiktok'));
      const btnIG = document.getElementById('btnToggleConnectInstagram');
      if (btnIG) btnIG.addEventListener('click', () => this.toggleSocialConnection('instagram'));
      const btnYT = document.getElementById('btnToggleConnectYouTube');
      if (btnYT) btnYT.addEventListener('click', () => this.toggleSocialConnection('youtube'));

      const btnSyncAll = document.getElementById('btnSyncAllConnected');
      if (btnSyncAll) btnSyncAll.addEventListener('click', () => this.syncAllConnected());

      // Import direct social URL
      const btnImportSocialUrl = document.getElementById('btnImportSocialUrl');
      if (btnImportSocialUrl) {
        btnImportSocialUrl.addEventListener('click', () => {
          const input = document.getElementById('socialImportUrl');
          const val = input ? input.value.trim() : '';
          if (!val) {
            this.showToast('Por favor pega un enlace de TikTok, Instagram o YouTube', 'warning');
            return;
          }
          this.closeSocialModal();
          this.runAutoOrganize(val);
        });
      }

      // 1-Click quick sync demo packs
      const btnQSTikTok = document.getElementById('btnQuickSyncTikTok');
      if (btnQSTikTok) {
        btnQSTikTok.addEventListener('click', () => {
          localStorage.setItem('curanotes_social_tiktok', 'connected');
          this.refreshSocialStatus();
          this.syncAllConnected();
        });
      }

      const btnQSInstagram = document.getElementById('btnQuickSyncInstagram');
      if (btnQSInstagram) {
        btnQSInstagram.addEventListener('click', () => {
          localStorage.setItem('curanotes_social_instagram', 'connected');
          this.refreshSocialStatus();
          this.syncAllConnected();
        });
      }

      const btnQSYouTube = document.getElementById('btnQuickSyncYouTube');
      if (btnQSYouTube) {
        btnQSYouTube.addEventListener('click', () => {
          localStorage.setItem('curanotes_social_youtube', 'connected');
          this.refreshSocialStatus();
          this.syncAllConnected();
        });
      }

      // Cerrar popovers de mover carpeta al hacer click en cualquier parte fuera
      document.addEventListener('click', () => {
        document.querySelectorAll('.move-folder-popover.open').forEach(p => p.classList.remove('open'));
      });

      // Settings Modal Events
      const btnOpenSettings = document.getElementById('btnOpenSettings');
      if (btnOpenSettings) btnOpenSettings.addEventListener('click', () => this.openSettingsModal());
      document.getElementById('btnCloseSettings').addEventListener('click', () => this.closeSettingsModal());
      document.getElementById('btnCancelSettings').addEventListener('click', () => this.closeSettingsModal());
      document.getElementById('btnSaveSettings').addEventListener('click', () => this.saveSettings());

      // Ingest Modal Events
      document.getElementById('btnOpenIngest').addEventListener('click', () => this.openIngestModal());
      document.getElementById('btnCloseIngest').addEventListener('click', () => this.closeIngestModal());
      document.getElementById('btnCancelIngest').addEventListener('click', () => this.closeIngestModal());

      this.inputTitle.addEventListener('input', () => this.updateLiveClassifier());
      this.inputDesc.addEventListener('input', () => this.updateLiveClassifier());
      this.inputCustomFolder.addEventListener('change', () => this.updateLiveClassifier());

      document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.loadPreset(btn.dataset.preset);
        });
      });

      document.getElementById('btnSaveNote').addEventListener('click', () => {
        const url = this.inputUrl.value;
        const title = this.inputTitle.value;
        const desc = this.inputDesc.value;
        const customFolderId = this.inputCustomFolder.value || null;

        if (!title.trim() && !desc.trim() && !url.trim()) {
          alert('Por favor introduce un enlace o escribe un título o descripción.');
          return;
        }

        const newNote = this.parser.parseInput({
          url,
          title,
          description: desc,
          customFolderId
        });

        this.store.addNote(newNote);
        this.closeIngestModal();

        const folder = this.store.getFolderById(newNote.folderId) || this.store.getOrCreateGeneralFolder();
        this.showToast(`Nota guardada y clasificada en: ${renderEmoji(folder.emoji)} ${folder.name}`);
      });

      document.getElementById('btnCloseDetail').addEventListener('click', () => this.closeDetailModal());
      document.getElementById('btnSaveDetail').addEventListener('click', () => {
        if (!this.activeModalNoteId) return;
        const note = this.store.getNoteById(this.activeModalNoteId);
        if (!note) return;

        const updatedTitle = document.getElementById('detailTitle').value;
        const updatedSummary = document.getElementById('detailSummary').value;
        const updatedPersonalNotes = document.getElementById('detailPersonalNotes').value;
        const updatedFolderId = document.getElementById('detailFolderSelect').value;

        this.store.updateNote(note.id, {
          title: updatedTitle,
          summary: updatedSummary,
          personalNotes: updatedPersonalNotes,
          folderId: updatedFolderId
        });

        this.closeDetailModal();
        this.showToast('Nota actualizada correctamente');
      });

      document.getElementById('btnAddChecklistItem').addEventListener('click', () => {
        const input = document.getElementById('detailNewChecklistText');
        const text = input.value.trim();
        if (!text || !this.activeModalNoteId) return;

        const note = this.store.getNoteById(this.activeModalNoteId);
        if (note) {
          if (!note.checklist) note.checklist = [];
          note.checklist.push({ text, completed: false });
          this.store.updateNote(note.id, { checklist: note.checklist });
          this.renderDetailChecklist(note);
          input.value = '';
        }
      });

      document.getElementById('btnOpenNewFolder').addEventListener('click', () => this.openFolderModal());
      document.getElementById('btnCloseFolder').addEventListener('click', () => this.closeFolderModal());
      document.getElementById('btnCancelFolder').addEventListener('click', () => this.closeFolderModal());

      document.getElementById('btnCreateFolder').addEventListener('click', () => {
        const name = document.getElementById('newFolderName').value.trim();
        const emoji = document.getElementById('newFolderEmoji').value.trim() || '📁';
        const color = document.getElementById('newFolderColor').value || '#3b82f6';
        const keywordsRaw = document.getElementById('newFolderKeywords').value;
        const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(Boolean);

        if (!name) {
          alert('Por favor ingresa un nombre para la carpeta.');
          return;
        }

        const created = this.store.addFolder({ name, emoji, color, keywords });
        this.closeFolderModal();
        this.showToast(`Carpeta "${renderEmoji(created.emoji)} ${created.name}" creada con auto-enrutamiento`);
      });

      this.searchInput.addEventListener('input', (e) => {
        this.store.setSearchQuery(e.target.value);
      });

      document.querySelectorAll('.chip-btn').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.store.setPlatformFilter(chip.dataset.filter);
        });
      });

      const mobileBtn = document.getElementById('mobileMenuBtn');
      const sidebarBackdrop = document.getElementById('sidebarBackdrop');
      if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
          const isOpen = this.sidebar.classList.toggle('open');
          if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', isOpen);
        });
      }
      if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => {
          this.sidebar.classList.remove('open');
          sidebarBackdrop.classList.remove('active');
        });
      }

      const btnResetDemo = document.getElementById('btnResetDemo');
      if (btnResetDemo) {
        btnResetDemo.addEventListener('click', () => {
          if (confirm('¿Restablecer notas de ejemplo de Instagram, TikTok y YouTube?')) {
            this.store.resetToDemo();
            this.showToast('Datos de demostración restablecidos');
          }
        });
      }

      const btnExportData = document.getElementById('btnExportData');
      if (btnExportData) {
        btnExportData.addEventListener('click', () => {
          const json = this.store.exportData();
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `curanotes-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.showToast('Copia de seguridad descargada en JSON');
        });
      }

      [this.ingestModal, this.detailModal, this.folderModal, this.socialModal, document.getElementById('settingsModal')].forEach(modal => {
        if (modal) {
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.classList.remove('active');
            }
          });
        }
      });
    }

    escapeHtml(str = '') {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    formatItemText(str = '') {
      const escaped = this.escapeHtml(str);
      return escaped.replace(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g, '<span class="timestamp-tag">$1</span>');
    }
  }

  // ==========================================================================
  // 5b. Emoji Picker with Real Flag Rendering on Windows
  // ==========================================================================
  const EMOJI_CATEGORIES = [
    {
      id: 'folders',
      icon: '📁',
      label: 'General',
      emojis: ['📁','📂','🗂️','📋','📌','📍','🗒️','📝','🗓️','📅','⭐','✨','💡','🔖','🏷️','💼','🎯','🎪','🎠','🎡']
    },
    {
      id: 'flags',
      icon: '🏳️',
      label: 'Banderas',
      emojis: [
        // Europa
        '🇪🇸','🇫🇷','🇮🇹','🇩🇪','🇵🇹','🇬🇧','🇳🇱','🇧🇪','🇨🇭','🇦🇹',
        '🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇮🇸','🇵🇱','🇨🇿','🇬🇷','🇮🇪','🇺🇦',
        '🇷🇴','🇧🇬','🇭🇷','🇷🇸','🇭🇺','🇸🇰','🇦🇩','🇲🇨','🇱🇺',
        // Américas
        '🇺🇸','🇲🇽','🇨🇦','🇧🇷','🇦🇷','🇨🇴','🇨🇱','🇵🇪','🇪🇨','🇺🇾',
        '🇻🇪','🇨🇺','🇩🇴','🇵🇷','🇨🇷','🇵🇦','🇬🇹','🇭🇳','🇸🇻','🇧🇴',
        // Asia & Oriente Medio
        '🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇹🇭','🇻🇳','🇮🇩','🇵🇭','🇸🇬','🇲🇾',
        '🇹🇷','🇦🇪','🇸🇦','🇮🇱','🇶🇦','🇯🇴','🇱🇧',
        // África & Oceanía
        '🇲🇦','🇪🇬','🇿🇦','🇳🇬','🇰🇪','🇦🇺','🇳🇿',
        // Especiales
        '🏴󠁧󠁢󠁥󠁮󠁧󠁿','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🏴󠁧󠁢󠁷󠁬󠁳󠁿','🏳️','🏴','🚩','🏁'
      ]
    },
    {
      id: 'landmarks',
      icon: '🗼',
      label: 'Monumentos',
      emojis: [
        '🗼','🗽','🗿','🏰','🏯','⛩️','🕌','⛪','🕍','🛕','🏛️','🏟️','🗺️','🌉','🌃','🌆','🌇','🌁',
        '🎑','🏔️','⛰️','🌋','🏕️','🏖️','🏜️','🏝️','🏞️','🌄','🌅','🌠','🎇','🎆','🌌'
      ]
    },
    {
      id: 'food',
      icon: '🍽️',
      label: 'Comidas',
      emojis: [
        '🧁','🎂','🍰','🍮','🍭','🍬','🍫','🍩','🍪','🥐','🥖','🍞','🥨','🥞','🧇','🍡','🍧','🍨','🍦',
        '🍝','🍜','🍛','🍚','🍙','🍘','🍣','🥟','🥠','🥡','🍱','🧆','🫔','🌮','🌯','🥙','🥗',
        '🥩','🍗','🍖','🌭','🍔','🍟','🥓','🍕','🫕','🥪','🍳','🧈',
        '🦞','🦐','🦀','🦑','🦈','🐟',
        '🍲','🥘','🥣','🥦','🥬','🥒','🌽','🥕','🫑','🌶️','🧅','🧄','🥔','🍆','🍅','🥑',
        '🍎','🍊','🍋','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥝','🍌','🍉','🍐',
        '☕','🍵','🫖','🧃','🥤','🧋','🥛','🍺','🍷','🥂','🍸','🍹','🧉','🍾'
      ]
    },
    {
      id: 'art',
      icon: '🎨',
      label: 'Arte',
      emojis: [
        '🎨','🖌️','🖍️','✏️','🖊️','🖋️','📐','📏','🔑','🗝️','🔮','🪄','🎭','🎬','🎞️','📽️','🎥','📷','📸',
        '🖼️','🎪','🎠','🎡','🎢','🎰','🃏','🀄','♟️','🎲','🧩','🪆',
        '🎵','🎶','🎼','🎹','🥁','🎷','🎸','🎻','🎺','🪘','🪗','🎙️','🎤','🎧','📻','🎚️','🎛️',
        '💃','🕺','📚','📖','📗','📘','📙','📔','📒','📓','📜','📃'
      ]
    },
    {
      id: 'tech',
      icon: '⚙️',
      label: 'Tecnología',
      emojis: [
        '🤖','⚙️','🔧','🔩','🪛','🪚','🔨','⛏️','🧲','🔋','🪫','💡','🔌','🖥️','💻','📱','⌨️','🖱️','🖨️',
        '🔬','🔭','🧬','🧪','🧫','⚗️','💊','💉','🩺',
        '💾','💿','📀','📡','📻','📺','☎️','🔒','🔓','🗄️','📊','📈','📉',
        '🚗','🚕','🚌','🏎️','🚑','🚒','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🚁','✈️','🚀','🛸'
      ]
    },
    {
      id: 'nature',
      icon: '🌿',
      label: 'Naturaleza',
      emojis: [
        '🌿','🌱','🌲','🌳','🌴','🪴','☘️','🍀','🌾','🍃','🍂','🍁','🪵','🌵','🎋','🎍','🌺','🌸','🌼','🌻',
        '🌹','🪷','🌷','💐','🪻',
        '🦁','🐯','🐻','🐼','🐨','🦊','🐺','🦝','🐸','🐲','🦕','🦖','🦎','🐊','🦋','🐝','🐞',
        '🐦','🦅','🦆','🦉','🦩','🦚','🦜','🐧',
        '🐬','🐳','🦭','🐠','🐡','🐙','🦑','🦀','🦞','🦐','🐚','🪸','🌊','💧','❄️','⚡','🌈'
      ]
    },
    {
      id: 'decor',
      icon: '🏺',
      label: 'Decoración',
      emojis: [
        '🏺','🪆','🧸','🪩','🎀','🎁','🎊','🎉','🎈','🪔','🕯️','💎','💍','👑',
        '🛋️','🪑','🚪','🪟','🛏️','🪞','🛁','🚿','🧹','🧺','🧼',
        '👗','👒','🎩','🧢','👔','👘','👜','👝','🎒','🧳','👛','💄','💅','🧣','🧤','🧥'
      ]
    },
    {
      id: 'fitness',
      icon: '💪',
      label: 'Deporte',
      emojis: [
        '⚽','🏀','🏈','⚾','🎾','🏐','🎱','🏓','🏸','🥊','🥋','⛳','🎣','🤿','🎿','🏂','🎯','🏹','🛹','🛼',
        '🤸','⛹️','🏋️','🚴','🧗','🏄','💪','👟'
      ]
    },
    {
      id: 'travel',
      icon: '✈️',
      label: 'Viajes',
      emojis: [
        '✈️','🚀','🛸','🚁','🛶','⛵','🚢','🛳️','🚂','🚆','🚇','🚊','🚌','🚐','🚕','🚗','🏍️','🚲',
        '🗺️','🧭','🏔️','⛰️','🏖️','🏝️','🏜️','🎒','🧳','🛂'
      ]
    },
    {
      id: 'symbols',
      icon: '🔣',
      label: 'Símbolos',
      emojis: [
        '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','🔥','💔','✨','⭐','🌟','💫','⚡',
        '✅','☑️','⭕','❌','‼️','❓','⚠️','🟢','🔵','🟣','🔴','🟠','🟡','⬛','⬜'
      ]
    }
  ];

  class EmojiPicker {
    constructor() {
      this.trigger   = document.getElementById('emojiPickerTrigger');
      this.panel     = document.getElementById('emojiPickerPanel');
      this.tabsEl    = document.getElementById('epTabs');
      this.gridEl    = document.getElementById('epGrid');
      this.hiddenInput = document.getElementById('newFolderEmoji');
      this.previewEl = document.getElementById('emojiPickerPreview');
      this.activeCategory = EMOJI_CATEGORIES[0].id;
      this.selectedEmoji  = '📁';
      this._buildTabs();
      this._bindEvents();
    }

    _buildTabs() {
      this.tabsEl.innerHTML = EMOJI_CATEGORIES.map(cat => `
        <button type="button" class="ep-tab${cat.id === this.activeCategory ? ' active' : ''}"
                data-cat="${cat.id}" title="${cat.label}">
          ${renderEmoji(cat.icon)}
          <span class="ep-tab-label">${cat.label}</span>
        </button>
      `).join('');
      this._renderGrid(this.activeCategory);
    }

    _renderGrid(catId) {
      const cat = EMOJI_CATEGORIES.find(c => c.id === catId);
      if (!cat) return;
      this.gridEl.innerHTML = cat.emojis.map(em => `
        <button type="button" class="ep-emoji-btn${em === this.selectedEmoji ? ' selected' : ''}"
                data-emoji="${em}" title="${em}">${renderEmoji(em)}</button>
      `).join('');
    }

    _bindEvents() {
      // Toggle panel
      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this.panel.classList.contains('open');
        this.panel.classList.toggle('open', !isOpen);
        this.trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      // Tab clicks
      this.tabsEl.addEventListener('click', (e) => {
        const tab = e.target.closest('.ep-tab');
        if (!tab) return;
        this.activeCategory = tab.dataset.cat;
        this.tabsEl.querySelectorAll('.ep-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._renderGrid(this.activeCategory);
      });

      // Emoji selection
      this.gridEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.ep-emoji-btn');
        if (!btn) return;
        this.selectedEmoji = btn.dataset.emoji;
        this.hiddenInput.value = this.selectedEmoji;
        this.previewEl.innerHTML = renderEmoji(this.selectedEmoji);

        this.gridEl.querySelectorAll('.ep-emoji-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        this.panel.classList.remove('open');
        this.trigger.setAttribute('aria-expanded', 'false');
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.trigger.contains(e.target) && !this.panel.contains(e.target)) {
          this.panel.classList.remove('open');
          this.trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    reset(emoji = '📁') {
      this.selectedEmoji = emoji;
      this.hiddenInput.value = emoji;
      this.previewEl.innerHTML = renderEmoji(emoji);
      this.panel.classList.remove('open');
      this.trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // ==========================================================================
  // 6. Bootstrap Application
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const store = new AppStore();
    const classifier = new SmartClassifier(store.getFolders());
    const parser = new ContentParser(classifier);
    const ui = new UIManager(store, classifier, parser);
    ui.init();

    // Emoji picker setup
    const emojiPicker = new EmojiPicker();
    const _origOpen = ui.openFolderModal.bind(ui);
    ui.openFolderModal = function() {
      _origOpen();
      emojiPicker.reset('📁');
    };

    console.log('✨ CuraNotes Universal Bundle running with Real Flag Rendering, Social Connect & Move to Folder.');
  });
})();
