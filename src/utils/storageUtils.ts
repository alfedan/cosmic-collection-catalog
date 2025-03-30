
// Utilitaires pour la gestion du stockage local et des images

// Fonction pour compresser les données d'image
export const compressImageData = (imageData: string, maxSizeKB: number = 100): string => {
  if (!imageData.startsWith('data:image')) {
    return imageData;
  }
  
  // Vérifier la taille actuelle
  const currentSizeKB = Math.round(imageData.length / 1024);
  if (currentSizeKB <= maxSizeKB) {
    return imageData;
  }
  
  // Pour les images très volumineuses, stocker un placeholder
  if (currentSizeKB > 500) {
    return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#4A4A6A"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle">Image trop grande</text></svg>')}`;
  }
  
  // Pour les images moyennes, créer une version miniature (approche simplifiée)
  return imageData;
};

// Fonction pour sauvegarder en toute sécurité dans le localStorage
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Erreur lors du stockage des données pour ${key}:`, error);
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.warn("Espace de stockage dépassé");
    }
    return false;
  }
};

// Fonction pour ajouter une entrée au journal en toute sécurité
export const addJournalEntry = (entry: any): boolean => {
  try {
    const existingJournal = localStorage.getItem('astro-journal');
    let journal = existingJournal ? JSON.parse(existingJournal) : [];
    
    // Limiter les entrées du journal aux 50 plus récentes
    journal = [entry, ...journal.slice(0, 49)];
    
    // Si l'entrée a une source d'image, la compresser
    if (entry.src) {
      entry.src = compressImageData(entry.src, 20); // Utiliser une taille plus petite pour les miniatures du journal
    }
    
    return safeSetItem('astro-journal', JSON.stringify(journal));
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une entrée au journal:", error);
    return false;
  }
};

// Fonction pour récupérer les données en toute sécurité
export const safeGetItem = (key: string, defaultValue: any): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${key}:`, error);
    return defaultValue;
  }
};

// Fonction pour récupérer les fichiers du dossier astro
export const getAstroFolderFiles = (): any[] => {
  try {
    const files = localStorage.getItem('astro-folder');
    return files ? JSON.parse(files) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers du dossier astro:", error);
    return [];
  }
};

// Fonction pour ajouter un fichier au dossier astro
export const addAstroFolderFile = (file: any): boolean => {
  try {
    const existingFiles = getAstroFolderFiles();
    const newFiles = [file, ...existingFiles];
    
    // Si le fichier a une source d'image, la compresser
    if (file.src) {
      file.src = compressImageData(file.src);
    }
    
    return safeSetItem('astro-folder', JSON.stringify(newFiles));
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un fichier au dossier astro:", error);
    return false;
  }
};

// Fonction pour supprimer un fichier du dossier astro
export const removeAstroFolderFile = (fileId: string): boolean => {
  try {
    const existingFiles = getAstroFolderFiles();
    const newFiles = existingFiles.filter(file => file.id !== fileId);
    
    return safeSetItem('astro-folder', JSON.stringify(newFiles));
  } catch (error) {
    console.error("Erreur lors de la suppression d'un fichier du dossier astro:", error);
    return false;
  }
};
