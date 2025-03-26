
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';
import ImageCard, { ImageData } from '../components/ImageCard';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';
import { safeSetItem, safeGetItem, compressImageData, addJournalEntry } from '../utils/storageUtils';

const MessierDetail: React.FC = () => {
  const { isAdmin } = useAuth();
  const { pageId, imageId } = useParams<{ pageId: string; imageId: string }>();
  const navigate = useNavigate();
  
  const page = parseInt(pageId || '1');
  const imageIndex = parseInt(imageId || '0');
  
  // Récupérer l'image principale et les images supplémentaires depuis le localStorage
  const [mainImage, setMainImage] = useState<ImageData | null>(null);
  const [extraImages, setExtraImages] = useState<(ImageData | undefined)[]>(() => {
    return safeGetItem(`messier-extra-${page}-${imageIndex}`, Array(9).fill(undefined));
  });
  
  // Charger l'image principale
  useEffect(() => {
    const images = safeGetItem(`messier-page-${page}`, []);
    if (images[imageIndex]) {
      setMainImage(images[imageIndex]);
    } else {
      navigate(`/messier/page/${page}`);
    }
  }, [page, imageIndex, navigate]);
  
  // Mettre à jour le localStorage quand les images supplémentaires changent
  useEffect(() => {
    // Compresser les images avant de les sauvegarder
    const compressedImages = extraImages.map(img => {
      if (!img) return undefined;
      return {
        ...img,
        src: compressImageData(img.src, 100)
      };
    });
    
    safeSetItem(`messier-extra-${page}-${imageIndex}`, JSON.stringify(compressedImages));
  }, [extraImages, page, imageIndex]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    if (!isAdmin) return;
    
    const newImages = [...extraImages];
    newImages[index] = {
      id: `messier-extra-${page}-${imageIndex}-${index}`,
      src: imageData,
      caption,
      date,
      objectName: mainImage?.objectName // Transmettre le nom de l'objet aux images supplémentaires
    };
    setExtraImages(newImages);
    
    // Ajouter une entrée au journal
    const journalEntry = {
      action: 'upload',
      section: 'Messier',
      page: `Image supplémentaire ${mainImage?.objectName}`,
      caption: caption,
      imageDate: date,
      date: new Date().toISOString(),
      id: `messier-extra-${page}-${imageIndex}-${index}`,
      src: imageData
    };
    
    addJournalEntry(journalEntry);
    
    // Notification de succès
    toast({
      title: "Image supplémentaire ajoutée",
      description: `Image ajoutée pour ${mainImage?.objectName || `M${(page - 1) * 10 + imageIndex + 1}`}`,
    });
  };
  
  const handleImageDelete = (id: string) => {
    if (!isAdmin) return;
    
    const newImages = [...extraImages];
    const index = newImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      const imageData = newImages[index];
      newImages[index] = undefined;
      setExtraImages(newImages);
      
      // Ajouter une entrée au journal
      if (imageData) {
        const journalEntry = {
          action: 'delete',
          section: 'Messier',
          page: `Image supplémentaire ${mainImage?.objectName}`,
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
        description: `L'image supplémentaire a été supprimée`,
        variant: "destructive",
      });
    }
  };
  
  if (!mainImage) {
    return null; // Attendre que l'image soit chargée
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <ImageDetail image={mainImage} />
        
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-gradient">
              Images supplémentaires de {mainImage.objectName || `M${(page - 1) * 10 + imageIndex + 1}`}
            </h2>
            
            {!isAdmin && (
              <div className="bg-amber-800/30 border border-amber-700/30 text-amber-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Mode lecture seule. <Link to="/admin" className="underline hover:text-white transition-colors">Se connecter</Link></span>
              </div>
            )}
            
            {isAdmin && (
              <div className="bg-green-800/30 border border-green-700/30 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>Mode administrateur actif</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {extraImages.map((image, index) => (
              <ImageCard
                key={index}
                image={image}
                onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
                onDelete={handleImageDelete}
                to={image ? `/messier/extra/${page}/${imageIndex}/${index}` : undefined}
                index={index}
                objectName={mainImage.objectName}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessierDetail;
