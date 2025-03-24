
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';
import { Plus, Shield, AlertTriangle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';

const NightCam: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // État pour stocker les pages de vignettes
  const [pages, setPages] = useState<{ id: string; name: string }[]>(() => {
    const savedPages = localStorage.getItem('nightcam-pages');
    if (savedPages) {
      return JSON.parse(savedPages);
    }
    return [{ id: 'page-1', name: 'Session 1' }];
  });
  
  // Page actuellement sélectionnée
  const [currentPage, setCurrentPage] = useState<string>('page-1');
  
  // Images de la page actuelle - 12 vignettes
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem(`nightcam-${currentPage}`);
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(12).fill(undefined);
  });
  
  // Mettre à jour le localStorage quand les pages changent
  useEffect(() => {
    localStorage.setItem('nightcam-pages', JSON.stringify(pages));
  }, [pages]);
  
  // Charger les images quand la page change
  useEffect(() => {
    const savedImages = localStorage.getItem(`nightcam-${currentPage}`);
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    } else {
      setImages(Array(12).fill(undefined));
    }
  }, [currentPage]);
  
  // Sauvegarder les images quand elles changent
  useEffect(() => {
    localStorage.setItem(`nightcam-${currentPage}`, JSON.stringify(images));
  }, [images, currentPage]);
  
  const handleAddPage = () => {
    if (!isAdmin) return;
    
    const pageId = `page-${pages.length + 1}`;
    const pageName = `Session ${pages.length + 1}`;
    
    setPages([...pages, { id: pageId, name: pageName }]);
    setCurrentPage(pageId);
    
    toast({
      title: "Nouvelle page ajoutée",
      description: `Page "${pageName}" créée avec succès`
    });
  };
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    if (!isAdmin) return;
    
    const objectName = `NightCam - ${date}`;
    
    const newImages = [...images];
    newImages[index] = {
      id: `nightcam-${currentPage}-${index}`,
      src: imageData,
      caption,
      date,
      objectName
    };
    setImages(newImages);
    
    // Ajouter au journal
    const journal = JSON.parse(localStorage.getItem('astro-journal') || '[]');
    journal.unshift({
      action: 'upload',
      section: 'NightCam',
      page: pages.find(p => p.id === currentPage)?.name,
      caption,
      date: new Date().toISOString(),
      imageDate: date,
      id: `nightcam-${currentPage}-${index}`
    });
    localStorage.setItem('astro-journal', JSON.stringify(journal.slice(0, 20)));
    
    toast({
      title: "Image ajoutée",
      description: `Image ajoutée à ${pages.find(p => p.id === currentPage)?.name}`
    });
  };
  
  const handleImageDelete = (id: string) => {
    if (!isAdmin) return;
    
    const newImages = [...images];
    const index = newImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      newImages[index] = undefined;
      setImages(newImages);
      
      // Ajouter au journal
      const journal = JSON.parse(localStorage.getItem('astro-journal') || '[]');
      journal.unshift({
        action: 'delete',
        section: 'NightCam',
        page: pages.find(p => p.id === currentPage)?.name,
        date: new Date().toISOString(),
        id
      });
      localStorage.setItem('astro-journal', JSON.stringify(journal.slice(0, 20)));
      
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
            NightCam
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Capturez vos sessions d'observation nocturne. 
            {isAdmin ? "Ajoutez des pages pour organiser vos différentes sessions." : 
              "Connectez-vous en tant qu'administrateur pour télécharger ou gérer les images."}
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
        
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                currentPage === page.id
                ? 'bg-cosmic-indigo text-white'
                : 'bg-cosmic-navy/50 text-white/70 hover:bg-cosmic-navy/80 hover:text-white'
              }`}
            >
              {page.name}
            </button>
          ))}
          
          {isAdmin && (
            <button
              onClick={handleAddPage}
              className="px-3 py-2 rounded-full bg-cosmic-indigo/30 text-white/90 hover:bg-cosmic-indigo/50 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
              onDelete={handleImageDelete}
              to={image ? `/nightcam/${currentPage}/${index}` : undefined}
              index={index}
              objectName={image?.date ? `Session du ${image.date}` : undefined}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NightCam;
