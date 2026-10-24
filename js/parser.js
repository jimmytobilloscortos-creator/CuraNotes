/* ==========================================================================
   CuraNotes - Smart URL Ingestion & Content Parser
   ========================================================================== */

export class ContentParser {
  constructor(classifier) {
    this.classifier = classifier;
  }

  /**
   * Detects the platform origin from a URL
   */
  detectPlatform(url = '') {
    const cleanUrl = url.toLowerCase().trim();
    if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
      return 'instagram';
    }
    if (cleanUrl.includes('tiktok.com')) {
      return 'tiktok';
    }
    return 'web';
  }

  /**
   * Extracts hashtags from text
   */
  extractHashtags(text = '') {
    const matches = text.match(/#[\w\u00C0-\u017F]+/g) || [];
    return Array.from(new Set(matches.map(m => m.toLowerCase())));
  }

  /**
   * Extracts checklist items from text (lines with "-", "*", numbers, or common keywords)
   */
  extractChecklist(text = '') {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const items = [];

    lines.forEach(line => {
      // Check for markdown task "- [ ]" or "- [x]"
      if (line.match(/^-\s*\[([ xX])\]\s*(.*)/)) {
        const match = line.match(/^-\s*\[([ xX])\]\s*(.*)/);
        items.push({
          text: match[2].trim(),
          completed: match[1].toLowerCase() === 'x'
        });
      }
      // Check for bullet list or numbered list
      else if (line.match(/^[-*•]\s+(.*)/)) {
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

  /**
   * Parses input data (URL, title, description, or notes) and produces a structured note
   */
  parseInput({ url = '', title = '', description = '', customFolderId = null }) {
    const platform = this.detectPlatform(url);
    const hashtags = this.extractHashtags(`${title} ${description}`);
    const checklist = this.extractChecklist(description);

    // If title is empty, derive a sensible title from the text or URL
    let resolvedTitle = title.trim();
    if (!resolvedTitle) {
      if (description) {
        resolvedTitle = description.split('\n')[0].substring(0, 75);
      } else if (url) {
        resolvedTitle = `Guardado desde ${platform === 'instagram' ? 'Instagram' : platform === 'tiktok' ? 'TikTok' : 'la Web'}`;
      } else {
        resolvedTitle = 'Nota sin título';
      }
    }

    // Determine author handle
    let author = '@guardado';
    if (url.includes('tiktok.com/@')) {
      const match = url.match(/@([^/?#]+)/);
      if (match) author = `@${match[1]}`;
    } else if (url.includes('instagram.com')) {
      author = '@instagram_creator';
    }

    // Run classifier to auto-route to folder if user didn't force a specific folder
    const classification = this.classifier.classify(`${resolvedTitle} ${description}`, hashtags);
    const targetFolderId = customFolderId || classification.folderId;

    // Pick appropriate high quality thematic cover image based on detected folder
    const defaultCovers = {
      food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      places: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      art: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      diy: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80',
      research: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    };

    const coverImage = defaultCovers[targetFolderId] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    // Highlight badges based on category
    const badges = [];
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
    } else {
      badges.push('🔬 Investigación');
    }

    const now = new Date();
    const timeString = `Hoy, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return {
      id: 'note-' + Date.now(),
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
