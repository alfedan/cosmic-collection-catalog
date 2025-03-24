
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

const solarSystemObjects = [
  "Soleil",
  "Mercure",
  "Venus",
  "Terre",
  "Lune",
  "Mars",
  "Jupiter",
  "Saturne",
  "Uranus",
  "Neptune"
];

const SolarSystem: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // Récupérer les images déjà enregistrées depuis le localStorage
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem('solar-system');
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(10).fill(undefined);
  });
  
  // Mettre à jour le localStorage quand les images changent
  useEffect(() => {
    localStorage.setItem('solar-system', JSON.stringify(images));
  }, [images]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    if (!isAdmin) return;
    
    const objectName = solarSystemObjects[index];
    
    const newImages = [...images];
    newImages[index] = {
      id: `solar-system-${index}`,
      src: imageData,
      caption,
      date,
      objectName
    };
    setImages(newImages);
    
    // Notification de succès
    toast({
      title: "Image ajoutée",
      description: `Image ajoutée pour ${objectName}`,
    });
  };
  
  const handleImageDelete = (id: string) => {
    if (!isAdmin) return;
    
    const newImages = [...images];
    const index = newImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      const objectName = newImages[index]?.objectName;
      newImages[index] = undefined;
      setImages(newImages);
      
      // Notification de suppression
      toast({
        title: "Image supprimée",
        description: `L'image de ${objectName} a été supprimée`,
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
            Système Solaire
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explorez notre système solaire à travers vos propres photos astronomiques. 
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
              to={image ? `/solar-system/detail/${index}` : undefined}
              index={index}
              objectName={solarSystemObjects[index]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SolarSystem;
