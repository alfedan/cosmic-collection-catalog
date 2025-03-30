
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';
import { 
  safeSetItem, 
  safeGetItem, 
  compressImageData, 
  addJournalEntry,
  safeSetItemInAstroFolder
} from '../utils/storageUtils';

const OtherViews: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // Récupérer les images déjà enregistrées depuis le localStorage
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    return safeGetItem('other-views', Array(10).fill(undefined));
  });
  
  // Mettre à jour le localStorage quand les images changent
  useEffect(() => {
    // Compresser les images avant de les sauvegarder
    const compressedImages = images.map(img => {
      if (!img) return undefined;
      return {
        ...img,
        src: compressImageData(img.src, 100)
      };
    });
    
    safeSetItem('other-views', JSON.stringify(compressedImages));
  }, [images]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    if (!isAdmin) return;
    
    const newImages = [...images];
    const imageId = `other-views-${index}`;
    
    newImages[index] = {
      id: imageId,
      src: imageData,
      caption,
      date
    };
    setImages(newImages);
    
    // Sauvegarder l'image dans le dossier astro
    const astroFileName = `autres-vues-${imageId}-${new Date().getTime()}`;
    safeSetItemInAstroFolder(astroFileName, JSON.stringify({
      id: imageId,
      src: compressImageData(imageData, 200),
      caption,
      date,
      section: "Autres Vues"
    }));
    
    // Ajouter une entrée au journal
    const journalEntry = {
      action: 'upload',
      section: 'Autres Vues',
      caption: caption,
      imageDate: date,
      date: new Date().toISOString(),
      id: imageId,
      src: imageData
    };
    
    addJournalEntry(journalEntry);
    
    // Notification de succès
    toast({
      title: "Image ajoutée",
      description: "Votre image a été ajoutée aux Autres Vues et sauvegardée dans le dossier astro"
    });
  };
  
  const handleImageDelete = (id: string) => {
    if (!isAdmin) return;
    
    const newImages = [...images];
    const index = newImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      const imageData = newImages[index];
      newImages[index] = undefined;
      setImages(newImages);
      
      // Ajouter une entrée au journal
      if (imageData) {
        const journalEntry = {
          action: 'delete',
          section: 'Autres Vues',
          caption: imageData.caption,
          imageDate: imageData.date,
          date: new Date().toISOString(),
          id: id
        };
        
        addJournalEntry(journalEntry);
      }
      
      // Notification de suppression
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Collection
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Autres Vues Astronomiques
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explorez d'autres vues astronomiques fascinantes à travers vos propres photos. 
            {!isAdmin && " Connectez-vous en tant qu'administrateur pour télécharger ou gérer les images."}
          </p>
          
          {!isAdmin && (
            <div className="mt-4 flex justify-center">
              <div className="bg-amber-800/30 border border-amber-700/30 text-amber-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Mode lecture seule. <Link to="/admin" className="underline hover:text-white transition-colors">Se connecter en tant qu'administrateur</Link></span>
              </div>
            </div>
          )}
          
          {isAdmin && (
            <div className="mt-4 flex justify-center">
              <div className="bg-green-800/30 border border-green-700/30 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>Mode administrateur actif. Vous pouvez modifier le contenu.</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
              onDelete={handleImageDelete}
              to={image ? `/other-views/detail/${index}` : undefined}
              index={index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OtherViews;
