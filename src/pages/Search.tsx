
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';
import { Search as SearchIcon } from 'lucide-react';

// Définition de mots-clés pour les catégories
const categories = [
  { id: 'galaxie', name: 'Galaxies', keywords: ['galaxie', 'galaxy', 'andromède', 'voie lactée', 'tourbillon', 'spiral'] },
  { id: 'nebuleuse', name: 'Nébuleuses', keywords: ['nébuleuse', 'nebula', 'emission', 'crabe', 'aigle', 'orion', 'lagune'] },
  { id: 'amas', name: 'Amas', keywords: ['amas', 'cluster', 'globulaire', 'ouvert', 'hercule', 'pléiades'] },
  { id: 'planete', name: 'Planètes', keywords: ['planète', 'planet', 'jupiter', 'mars', 'saturne', 'venus', 'mercure', 'uranus', 'neptune'] },
  { id: 'lune', name: 'Lune', keywords: ['lune', 'moon', 'crater', 'cratère', 'mare'] },
  { id: 'soleil', name: 'Soleil', keywords: ['soleil', 'sun', 'solar', 'prominences', 'taches'] },
];

interface SearchResult {
  id: string;
  src: string;
  caption: string;
  date: string;
  objectName?: string;
  source: string; // messier, solar-system, etc.
  link: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fonction pour collecter toutes les images de l'application
  const getAllImages = () => {
    const results: SearchResult[] = [];
    
    // Messier pages
    for (let page = 1; page <= 11; page++) {
      const messierImages = JSON.parse(localStorage.getItem(`messier-page-${page}`) || '[]');
      if (messierImages && messierImages.length) {
        messierImages.forEach((img: ImageData | undefined, index: number) => {
          if (img) {
            results.push({
              ...img,
              source: 'Messier',
              link: `/messier/detail/${page}/${index}`
            });
            
            // Extras de Messier
            const extrasKey = `messier-extra-${page}-${index}`;
            const extras = JSON.parse(localStorage.getItem(extrasKey) || '[]');
            if (extras && extras.length) {
              extras.forEach((extraImg: ImageData | undefined, extraIndex: number) => {
                if (extraImg) {
                  results.push({
                    ...extraImg,
                    source: 'Messier (Supplémentaire)',
                    link: `/messier/extra/${page}/${index}/${extraIndex}`
                  });
                }
              });
            }
          }
        });
      }
    }
    
    // Système solaire
    const solarImages = JSON.parse(localStorage.getItem('solar-system') || '[]');
    if (solarImages && solarImages.length) {
      solarImages.forEach((img: ImageData | undefined, index: number) => {
        if (img) {
          results.push({
            ...img,
            source: 'Système Solaire',
            link: `/solar-system/detail/${index}`
          });
        }
      });
    }
    
    // NightCam
    const nightcamPages = JSON.parse(localStorage.getItem('nightcam-pages') || '[]');
    if (nightcamPages && nightcamPages.length) {
      nightcamPages.forEach((page: { id: string; name: string }) => {
        const pageImages = JSON.parse(localStorage.getItem(`nightcam-${page.id}`) || '[]');
        if (pageImages && pageImages.length) {
          pageImages.forEach((img: ImageData | undefined, index: number) => {
            if (img) {
              results.push({
                ...img,
                source: `NightCam - ${page.name}`,
                link: `/nightcam/${page.id}/${index}`
              });
            }
          });
        }
      });
    }
    
    // Autres vues
    const otherImages = JSON.parse(localStorage.getItem('other-views') || '[]');
    if (otherImages && otherImages.length) {
      otherImages.forEach((img: ImageData | undefined, index: number) => {
        if (img) {
          results.push({
            ...img,
            source: 'Autres Vues',
            link: `/other-views/detail/${index}`
          });
        }
      });
    }
    
    return results;
  };
  
  // Effectuer une recherche
  const performSearch = (term: string = '', category: string | null = null) => {
    const allImages = getAllImages();
    
    if (!term && !category) {
      setSearchResults(allImages);
      return;
    }
    
    let filtered = allImages;
    
    // Filtrer par terme de recherche
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(img => 
        (img.caption && img.caption.toLowerCase().includes(searchLower)) ||
        (img.objectName && img.objectName.toLowerCase().includes(searchLower)) ||
        (img.date && img.date.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrer par catégorie
    if (category) {
      const categoryObj = categories.find(cat => cat.id === category);
      if (categoryObj) {
        filtered = filtered.filter(img => {
          const textToSearch = [
            img.caption || '',
            img.objectName || '',
            img.date || ''
          ].join(' ').toLowerCase();
          
          return categoryObj.keywords.some(keyword => 
            textToSearch.includes(keyword.toLowerCase())
          );
        });
      }
    }
    
    setSearchResults(filtered);
  };
  
  // Effectuer une recherche initiale (toutes les images)
  useEffect(() => {
    performSearch();
  }, []);
  
  // Rechercher quand le terme ou la catégorie change
  useEffect(() => {
    performSearch(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Recherche
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Rechercher des images
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Retrouvez facilement vos images astronomiques par mot-clé ou catégorie.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-cosmic-dark border border-white/10 text-white focus:ring-2 focus:ring-cosmic-purple/50 focus:border-cosmic-purple/50 outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-cosmic-purple text-white'
                  : 'bg-cosmic-navy/50 text-white/70 hover:bg-cosmic-navy hover:text-white'
              }`}
            >
              Tout
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cosmic-purple text-white'
                    : 'bg-cosmic-navy/50 text-white/70 hover:bg-cosmic-navy hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <p className="text-white/50">Aucune image trouvée</p>
          </div>
        ) : (
          <>
            <p className="text-white/70 mb-4">{searchResults.length} résultat(s) trouvé(s)</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {searchResults.map((result, index) => (
                <Link
                  key={result.id}
                  to={result.link}
                  className="flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${0.05 * (index % 10)}s` }}
                >
                  <div className="aspect-square glass-card glass-card-hover rounded-xl overflow-hidden relative group">
                    <img 
                      src={result.src} 
                      alt={result.caption || 'Image astronomique'} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      {result.caption && (
                        <p className="text-white text-sm line-clamp-2">{result.caption}</p>
                      )}
                      
                      <div className="mt-1 text-white/70 text-xs">
                        {result.source}
                      </div>
                    </div>
                  </div>
                  
                  {result.objectName && (
                    <div className="text-center mt-2 text-white/80 text-sm">
                      {result.objectName}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Search;
