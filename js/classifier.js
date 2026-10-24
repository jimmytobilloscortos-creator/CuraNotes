/* ==========================================================================
   CuraNotes - Smart Content Classifier & Folder Auto-Routing Engine
   ========================================================================== */

export class SmartClassifier {
  constructor(folders = []) {
    this.folders = folders;
    
    // Built-in lexical knowledge base for automatic thematic routing
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

  /**
   * Normalizes text for keyword matching (lowercases, removes accents, extracts tokens)
   */
  tokenize(text = '') {
    if (!text) return [];
    const normalized = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s#]/g, ' ');

    return normalized.split(/\s+/).filter(word => word.length > 2);
  }

  /**
   * Evaluates text against all folders and returns the best matching folder
   * with confidence score and detected keywords.
   */
  classify(text = '', extraTags = []) {
    const tokens = this.tokenize(text);
    const tagTokens = extraTags.map(t => this.tokenize(t)).flat();
    const allTokens = [...tokens, ...tagTokens];

    if (allTokens.length === 0) {
      return { folderId: 'all', confidence: 0, matchedKeywords: [] };
    }

    const scores = {};
    const matchedWords = {};

    this.folders.forEach(folder => {
      // Don't score the "All" synthetic folder
      if (folder.id === 'all') return;

      scores[folder.id] = 0;
      matchedWords[folder.id] = new Set();

      // Combine built-in keywords with custom user-configured keywords for this folder
      const builtIn = this.defaultKeywords[folder.id] || [];
      const userKeywords = (folder.keywords || []).map(k => this.tokenize(k)).flat();
      const folderVocabulary = new Set([...builtIn, ...userKeywords]);

      // Check tokens
      allTokens.forEach(token => {
        // Direct match
        if (folderVocabulary.has(token)) {
          scores[folder.id] += 3;
          matchedWords[folder.id].add(token);
        } else {
          // Substring / stem match (e.g., 'recetas' matches 'receta')
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

      // Bonus if folder title or emoji is matched
      const folderTitleTokens = this.tokenize(folder.name);
      folderTitleTokens.forEach(ft => {
        if (allTokens.includes(ft)) {
          scores[folder.id] += 4;
          matchedWords[folder.id].add(ft);
        }
      });
    });

    // Find the folder with highest score
    let bestFolderId = null;
    let highestScore = 0;

    Object.entries(scores).forEach(([fId, score]) => {
      if (score > highestScore) {
        highestScore = score;
        bestFolderId = fId;
      }
    });

    if (!bestFolderId || highestScore < 1.5) {
      return {
        folderId: 'research', // Fallback default folder
        folderName: 'Temas para Investigar',
        confidence: 0.35,
        matchedKeywords: [],
        isDefaultFallback: true
      };
    }

    const matchedList = Array.from(matchedWords[bestFolderId]);
    // Confidence calculation bounded between 0.50 and 0.99
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
