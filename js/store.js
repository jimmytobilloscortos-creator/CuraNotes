/* ==========================================================================
   CuraNotes - Central Reactive Store & Local Persistence
   ========================================================================== */

import { INITIAL_FOLDERS, INITIAL_NOTES } from './sampleData.js';

const STORAGE_KEY = 'curanotes_app_data_v1';

export class AppStore {
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
          return {
            notes: parsed.notes,
            folders: parsed.folders,
            activeFolderId: 'all',
            platformFilter: 'all', // 'all' | 'instagram' | 'tiktok' | 'starred'
            searchQuery: ''
          };
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial seed data.', e);
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
      console.error('Failed to save state to localStorage', e);
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

  getState() {
    return this.state;
  }

  // --- Folder Actions ---
  getFolders() {
    return this.state.folders;
  }

  getFolderById(id) {
    return this.state.folders.find(f => f.id === id);
  }

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

    // Move notes in this folder to 'all' or 'research'
    this.state.notes.forEach(note => {
      if (note.folderId === folderId) {
        note.folderId = 'research';
      }
    });

    this.state.folders = this.state.folders.filter(f => f.id !== folderId);
    if (this.state.activeFolderId === folderId) {
      this.state.activeFolderId = 'all';
    }
    this.notify();
  }

  // --- Note Actions ---
  getNotes() {
    return this.state.notes;
  }

  getNoteById(id) {
    return this.state.notes.find(n => n.id === id);
  }

  addNote(note) {
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

  moveNoteToFolder(noteId, newFolderId) {
    const note = this.getNoteById(noteId);
    if (note) {
      note.folderId = newFolderId;
      this.notify();
    }
  }

  // --- Filter Actions ---
  setPlatformFilter(filter) {
    this.state.platformFilter = filter;
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify();
  }

  // --- Computed Views ---
  getFilteredNotes() {
    const { notes, activeFolderId, platformFilter, searchQuery } = this.state;
    const q = searchQuery.toLowerCase().trim();

    return notes.filter(note => {
      // 1. Folder filter
      if (activeFolderId !== 'all' && note.folderId !== activeFolderId) {
        return false;
      }

      // 2. Platform / Starred filter
      if (platformFilter === 'instagram' && note.source !== 'instagram') return false;
      if (platformFilter === 'tiktok' && note.source !== 'tiktok') return false;
      if (platformFilter === 'starred' && !note.starred) return false;

      // 3. Search query (matches title, summary, author, tags, checklist items)
      if (q) {
        const titleMatch = note.title.toLowerCase().includes(q);
        const summaryMatch = note.summary.toLowerCase().includes(q);
        const authorMatch = note.author.toLowerCase().includes(q);
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

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.notes && parsed.folders) {
        this.state.notes = parsed.notes;
        this.state.folders = parsed.folders;
        this.notify();
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    return false;
  }
}
