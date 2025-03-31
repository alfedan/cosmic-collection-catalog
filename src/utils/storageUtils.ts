
// Utilitaires pour la gestion du stockage local et des images

// Fonction pour compresser les données d'image
export const compressImageData = (imageData: string, maxSizeKB: number = 100): string => {
  if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image')) {
    return imageData || '';
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

// Fonction pour vérifier si localStorage est disponible
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Fonction pour sauvegarder en toute sécurité dans le localStorage
export const safeSetItem = (key: string, value: string): boolean => {
  if (!key || typeof value !== 'string') {
    console.error(`Données invalides pour ${key}`);
    return false;
  }
  
  if (!isLocalStorageAvailable()) {
    console.error('localStorage n\'est pas disponible');
    return false;
  }
  
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
  if (!entry) {
    console.error("Entrée de journal invalide");
    return false;
  }
  
  try {
    let journal = [];
    const existingJournal = localStorage.getItem('astro-journal');
    
    if (existingJournal) {
      try {
        journal = JSON.parse(existingJournal);
        if (!Array.isArray(journal)) {
          journal = [];
        }
      } catch (e) {
        console.warn("Journal existant invalide, création d'un nouveau journal");
        journal = [];
      }
    }
    
    // S'assurer que l'entrée a un ID et une date
    if (!entry.id) entry.id = `entry-${Date.now()}`;
    if (!entry.date) entry.date = new Date().toISOString();
    
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
export const safeGetItem = (key: string, defaultValue: any = null): any => {
  if (!key || !isLocalStorageAvailable()) {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch (parseError) {
      console.warn(`Erreur lors de l'analyse JSON pour ${key}, retour de la valeur brute:`, parseError);
      return item; // Retourner la valeur brute si le parsing JSON échoue
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${key}:`, error);
    return defaultValue;
  }
};
