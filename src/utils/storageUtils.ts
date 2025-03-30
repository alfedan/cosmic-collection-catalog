
// Utilitaires pour la gestion du stockage local et des images

// Préfixe pour les éléments du dossier astro
const ASTRO_FOLDER_PREFIX = 'astro:';

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

// Fonction pour sauvegarder en toute sécurité dans le localStorage avec le prefix astro:
export const safeSetItemInAstroFolder = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(`${ASTRO_FOLDER_PREFIX}${key}`, value);
    
    // Mettre à jour la liste des fichiers dans le dossier astro
    const astroFiles = getAstroFolderFiles();
    if (!astroFiles.includes(key)) {
      astroFiles.push(key);
      localStorage.setItem(`${ASTRO_FOLDER_PREFIX}files`, JSON.stringify(astroFiles));
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du stockage des données pour ${key} dans le dossier astro:`, error);
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.warn("Espace de stockage dépassé");
    }
    return false;
  }
};

// Fonction pour récupérer un élément depuis le dossier astro
export const getItemFromAstroFolder = (key: string, defaultValue: any): any => {
  try {
    const item = localStorage.getItem(`${ASTRO_FOLDER_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${key} depuis le dossier astro:`, error);
    return defaultValue;
  }
};

// Fonction pour lister tous les fichiers dans le dossier astro
export const getAstroFolderFiles = (): string[] => {
  try {
    const files = localStorage.getItem(`${ASTRO_FOLDER_PREFIX}files`);
    return files ? JSON.parse(files) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers du dossier astro:", error);
    return [];
  }
};

// Fonction pour supprimer un élément du dossier astro
export const removeItemFromAstroFolder = (key: string): boolean => {
  try {
    localStorage.removeItem(`${ASTRO_FOLDER_PREFIX}${key}`);
    
    // Mettre à jour la liste des fichiers
    const astroFiles = getAstroFolderFiles();
    const updatedFiles = astroFiles.filter(file => file !== key);
    localStorage.setItem(`${ASTRO_FOLDER_PREFIX}files`, JSON.stringify(updatedFiles));
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key} du dossier astro:`, error);
    return false;
  }
};

// Les fonctions originales restent inchangées pour maintenir la compatibilité
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
      
      // Également sauvegarder l'image dans le dossier astro si c'est un upload
      if (entry.action === 'upload') {
        const imageFileName = `${entry.section.toLowerCase()}-${entry.id}-${new Date().getTime()}`;
        safeSetItemInAstroFolder(imageFileName, JSON.stringify({
          id: entry.id,
          src: compressImageData(entry.src, 100),
          caption: entry.caption || '',
          date: entry.imageDate || new Date().toISOString(),
          section: entry.section,
          objectName: entry.objectName || ''
        }));
      }
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

