/* ==========================================================================
   CuraNotes - Main Application Entrypoint
   ========================================================================== */

import { AppStore } from './store.js';
import { SmartClassifier } from './classifier.js';
import { ContentParser } from './parser.js';
import { UIManager } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize central reactive store
  const store = new AppStore();

  // 2. Initialize classifier with active folders
  const classifier = new SmartClassifier(store.getFolders());

  // 3. Initialize content & URL parser
  const parser = new ContentParser(classifier);

  // 4. Initialize UI manager
  const ui = new UIManager(store, classifier, parser);
  ui.init();

  console.log('✨ CuraNotes initialized with Smart Content Routing & Visual Note Cards.');
});
