/* ==========================================================================
   CuraNotes - User Interface Controller & DOM Renderer
   ========================================================================== */

export class UIManager {
  constructor(store, classifier, parser) {
    this.store = store;
    this.classifier = classifier;
    this.parser = parser;
    this.activeModalNoteId = null;

    // Cache essential DOM elements
    this.sidebar = document.getElementById('sidebar');
    this.folderList = document.getElementById('folderList');
    this.notesGrid = document.getElementById('notesGrid');
    this.currentFolderTitle = document.getElementById('currentFolderTitle');
    this.currentFolderSubtitle = document.getElementById('currentFolderSubtitle');
    this.currentFolderEmoji = document.getElementById('currentFolderEmoji');
    this.notesCountBadge = document.getElementById('notesCountBadge');
    this.searchInput = document.getElementById('searchInput');
    this.toastContainer = document.getElementById('toastContainer');

    // Modals
    this.ingestModal = document.getElementById('ingestModal');
    this.detailModal = document.getElementById('detailModal');
    this.folderModal = document.getElementById('folderModal');

    // Ingest Modal Inputs
    this.inputUrl = document.getElementById('inputUrl');
    this.inputTitle = document.getElementById('inputTitle');
    this.inputDesc = document.getElementById('inputDesc');
    this.inputCustomFolder = document.getElementById('inputCustomFolder');
    this.routingPreviewBox = document.getElementById('routingPreviewBox');
    this.detectedFolderBadge = document.getElementById('detectedFolderBadge');
    this.detectedFolderConfidence = document.getElementById('detectedFolderConfidence');

    this.initEventListeners();
  }

  init() {
    this.renderFolders();
    this.renderNotes();
    this.populateFolderSelects();

    // Subscribe to store updates
    this.store.subscribe(() => {
      this.classifier.setFolders(this.store.getFolders());
      this.renderFolders();
      this.renderNotes();
      this.populateFolderSelects();
    });
  }

  // --- Toast Notifications ---
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

  // --- Folder List Rendering ---
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
          <span class="folder-emoji">${folder.emoji}</span>
          <span class="folder-name">${folder.name}</span>
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
          if (confirm(`¿Eliminar la carpeta "${folder.name}"? Las notas se conservarán.`)) {
            this.store.deleteFolder(fId);
            this.showToast('Carpeta eliminada', 'info');
          }
          return;
        }
        this.store.setActiveFolder(folder.id);
        if (window.innerWidth <= 900) {
          this.sidebar.classList.remove('open');
        }
      });

      this.folderList.appendChild(li);
    });

    // Update main view title
    const activeFolder = this.store.getFolderById(activeFolderId) || {
      name: 'Todos los Guardados',
      emoji: '✨',
      description: 'Vista unificada de todas tus notas'
    };

    this.currentFolderTitle.textContent = activeFolder.name;
    this.currentFolderSubtitle.textContent = activeFolder.description || 'Notas organizadas por contenido';
    this.currentFolderEmoji.textContent = activeFolder.emoji;
  }

  // --- Notes Grid Rendering ---
  renderNotes() {
    const notes = this.store.getFilteredNotes();
    this.notesCountBadge.textContent = `${notes.length} ${notes.length === 1 ? 'nota' : 'notas'}`;

    this.notesGrid.innerHTML = '';

    if (notes.length === 0) {
      this.notesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <h3>No hay notas en esta sección</h3>
          <p>Convierte tus guardados de Instagram o TikTok pegando un enlace o crea una nota para que el clasificador la coloque aquí automáticamente.</p>
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
      const folder = this.store.getFolderById(note.folderId) || { name: 'General', emoji: '📁', color: '#6366f1' };
      const card = document.createElement('div');
      card.className = 'note-card';
      card.dataset.noteId = note.id;

      // Build checklist preview HTML if note has checklist items
      let checklistHtml = '';
      if (note.checklist && note.checklist.length > 0) {
        const previewItems = note.checklist.slice(0, 4);
        checklistHtml = `
          <div class="card-checklist-container">
            <div class="checklist-title">
              <span>${note.checklistTitle || 'Lista'}</span>
              <span>${note.checklist.filter(c => c.completed).length}/${note.checklist.length}</span>
            </div>
            <ul class="checklist-items">
              ${previewItems.map((item, idx) => `
                <li class="checklist-row ${item.completed ? 'checked' : ''}" data-item-idx="${idx}">
                  <input type="checkbox" ${item.completed ? 'checked' : ''} data-checklist-toggle="${idx}">
                  <span>${this.escapeHtml(item.text)}</span>
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

      // Build highlight badges
      let badgesHtml = '';
      if (note.highlightBadges && note.highlightBadges.length > 0) {
        badgesHtml = `
          <div class="card-highlight-badges">
            ${note.highlightBadges.map(b => `<span class="highlight-badge">${this.escapeHtml(b)}</span>`).join('')}
          </div>
        `;
      }

      // Build tags
      let tagsHtml = '';
      if (note.tags && note.tags.length > 0) {
        tagsHtml = `
          <div class="card-tags">
            ${note.tags.map(t => `<span class="tag-item">${this.escapeHtml(t)}</span>`).join('')}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="card-header-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="card-origin-pill ${note.source}">
              ${note.source === 'instagram' ? 'IG Reel' : note.source === 'tiktok' ? 'TikTok' : 'Web'}
            </span>
            <span class="card-folder-badge" style="border-color: ${folder.color}44;">
              <span>${folder.emoji}</span>
              <span>${folder.name}</span>
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
            <button class="footer-btn" data-open-detail="${note.id}" title="Ver y editar nota">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="footer-btn btn-delete" data-delete-note="${note.id}" title="Eliminar nota">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;

      // Event listener for card checklist checkboxes
      card.querySelectorAll('[data-checklist-toggle]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          e.stopPropagation();
          const itemIdx = parseInt(chk.dataset.checklistToggle, 10);
          this.store.toggleChecklistItem(note.id, itemIdx);
        });
      });

      // Event listener for star toggle
      const starBtn = card.querySelector('[data-star-btn]');
      if (starBtn) {
        starBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.store.toggleStar(note.id);
          this.showToast(note.starred ? 'Nota retirada de favoritos' : 'Nota guardada en favoritos ⭐');
        });
      }

      // Event listener for delete note
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

      // Event listener for opening detail modal
      card.querySelectorAll('[data-open-detail]').forEach(el => {
        el.addEventListener('click', () => this.openDetailModal(note.id));
      });

      this.notesGrid.appendChild(card);
    });
  }

  // --- Folder Selects Populator (in Modals) ---
  populateFolderSelects() {
    const folders = this.store.getFolders().filter(f => f.id !== 'all');
    
    // Ingestion modal select
    this.inputCustomFolder.innerHTML = '<option value="">🤖 Detección Automática por Contenido</option>';
    folders.forEach(f => {
      this.inputCustomFolder.innerHTML += `<option value="${f.id}">${f.emoji} ${f.name}</option>`;
    });

    // Detail modal select
    const detailFolderSelect = document.getElementById('detailFolderSelect');
    if (detailFolderSelect) {
      detailFolderSelect.innerHTML = '';
      folders.forEach(f => {
        detailFolderSelect.innerHTML += `<option value="${f.id}">${f.emoji} ${f.name}</option>`;
      });
    }
  }

  // --- Live Classifier Route Preview in Ingestion Modal ---
  updateLiveClassifier() {
    const title = this.inputTitle.value;
    const desc = this.inputDesc.value;
    const customFolder = this.inputCustomFolder.value;

    if (customFolder) {
      const f = this.store.getFolderById(customFolder);
      this.detectedFolderBadge.innerHTML = `<span>${f.emoji}</span><span>${f.name}</span>`;
      this.detectedFolderConfidence.textContent = 'Asignación manual';
      return;
    }

    const classification = this.classifier.classify(`${title} ${desc}`);
    const pct = Math.round(classification.confidence * 100);
    this.detectedFolderBadge.innerHTML = `<span>${classification.folderEmoji}</span><span>${classification.folderName}</span>`;
    this.detectedFolderConfidence.textContent = `${pct}% afinidad temática`;
  }

  // --- Modal Openers & Closers ---
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
    const folder = this.store.getFolderById(note.folderId) || { name: 'General', emoji: '📁' };

    document.getElementById('detailCoverImg').src = note.coverImage;
    document.getElementById('detailTitle').value = note.title;
    document.getElementById('detailSummary').value = note.summary;
    document.getElementById('detailPersonalNotes').value = note.personalNotes || '';
    document.getElementById('detailPlatformPill').className = `card-origin-pill ${note.source}`;
    document.getElementById('detailPlatformPill').textContent = note.source.toUpperCase();
    document.getElementById('detailAuthor').textContent = note.author;
    document.getElementById('detailSourceLink').href = note.sourceUrl;
    document.getElementById('detailFolderSelect').value = note.folderId;

    // Render Checklist Editor
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
          <span>${this.escapeHtml(item.text)}</span>
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

  // --- Presets Handler (One-Click Demo in Ingest Modal) ---
  loadPreset(type) {
    const presets = {
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
      watercolor: {
        url: 'https://www.instagram.com/p/C9kLo20Xcv/',
        title: 'Técnica de Acuarela Húmedo sobre Húmedo para Flores Silvestres',
        desc: 'Cómo lograr degradados suaves de color y transparencias sin que la pintura se empaste. Uso de papel 100% algodón de 300g.\n- [ ] Papel Arches grano fino 300g\n- [ ] Pincel redondo de marta Kolinsky Nº 6\n- [ ] Pigmentos Winsor & Newton (Azul Cobalto, Rosa Ópera, Amarillo Limón)\n#arte #acuarela #tecnicadearte #ilustracion #pintura'
      },
      woodlamp: {
        url: 'https://www.tiktok.com/@woodcraft/video/7391028471',
        title: 'DIY Repisa Hexagonal Flotante con Encastre Oculto',
        desc: 'Manualidad paso a paso para crear repisas geométricas de pared utilizando listones de pino reciclados y tinte nogal.\n- [ ] 6 listones de pino cortados con ángulo de 30 grados\n- [ ] Cola para madera Titebond II\n- [ ] Lija de grano 120, 240 y 400\n- [ ] Cera natural de abejas para sellado\n#diy #manualidades #madera #homedecor #hazlotumismo'
      },
      blackhole: {
        url: 'https://www.tiktok.com/@astro.universe/video/7382019482',
        title: 'El Límite de Chandrasekhar y el Colapso de Estrellas Masivas',
        desc: 'Curiosidad astronómica: por qué una estrella debe superar 1.44 masas solares para colapsar en una estrella de neutrones o agujero negro.\n- [ ] Investigar la radiación de Hawking y evaporación de agujeros negros\n- [ ] Revisar fotos de la sombra del agujero negro M87 por el EHT\n- [ ] Leer sobre supernovas de tipo Ia\n#ciencia #astronomia #espacio #fisica #curiosidades'
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

  // --- Event Listeners Setup ---
  initEventListeners() {
    // Open Ingest Modal
    document.getElementById('btnOpenIngest').addEventListener('click', () => this.openIngestModal());
    document.getElementById('btnCloseIngest').addEventListener('click', () => this.closeIngestModal());
    document.getElementById('btnCancelIngest').addEventListener('click', () => this.closeIngestModal());

    // Live typing in Ingest Modal updates classification
    this.inputTitle.addEventListener('input', () => this.updateLiveClassifier());
    this.inputDesc.addEventListener('input', () => this.updateLiveClassifier());
    this.inputCustomFolder.addEventListener('change', () => this.updateLiveClassifier());

    // Preset pills click
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadPreset(btn.dataset.preset);
      });
    });

    // Save Note Form Submission
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

      const folder = this.store.getFolderById(newNote.folderId);
      this.showToast(`Nota guardada y clasificada en: ${folder ? folder.emoji + ' ' + folder.name : 'Carpeta'}`);
    });

    // Detail Modal Events
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

    // Detail Modal: Add new item to checklist
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

    // Folder Modal Events
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
      this.showToast(`Carpeta "${created.emoji} ${created.name}" creada con auto-enrutamiento inteligente`);
    });

    // Search Input
    this.searchInput.addEventListener('input', (e) => {
      this.store.setSearchQuery(e.target.value);
    });

    // Platform Filter Chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.store.setPlatformFilter(chip.dataset.filter);
      });
    });

    // Mobile Sidebar Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        this.sidebar.classList.toggle('open');
      });
    }

    // Reset to Demo Data
    const btnResetDemo = document.getElementById('btnResetDemo');
    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        if (confirm('¿Restablecer notas de ejemplo de Instagram y TikTok?')) {
          this.store.resetToDemo();
          this.showToast('Datos de demostración restablecidos');
        }
      });
    }

    // Export Data
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

    // Backdrop clicks close active modal
    [this.ingestModal, this.detailModal, this.folderModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
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
}
