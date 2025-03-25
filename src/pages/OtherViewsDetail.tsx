
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';
import { ImageData } from '../components/ImageCard';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Calendar, X } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

const OtherViewsDetail: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  
  const imageIndex = parseInt(imageId || '0');
  
  // Récupérer l'image depuis le localStorage
  const [image, setImage] = useState<ImageData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Charger l'image
  useEffect(() => {
    const savedImages = localStorage.getItem('other-views');
    if (savedImages) {
      const images = JSON.parse(savedImages);
      if (images[imageIndex]) {
        setImage(images[imageIndex]);
      } else {
        navigate('/other-views');
      }
    } else {
      navigate('/other-views');
    }
  }, [imageIndex, navigate]);
  
  if (!image) {
    return null; // Attendre que l'image soit chargée
  }
  
  const handleImageClick = () => {
    setDialogOpen(true);
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <ImageDetail image={image} />
        
        {/* Bouton pour afficher l'image en plein écran */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleImageClick}
            className="px-4 py-2 bg-cosmic-indigo/40 hover:bg-cosmic-indigo/60 transition-colors rounded-md text-white flex items-center gap-2"
          >
            <span>Voir en plein écran</span>
          </button>
        </div>
      </div>
      
      {/* Modal pour afficher l'image en grand format */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-cosmic-dark border-cosmic-indigo/50 max-w-3xl w-[90vw] p-0">
          <DialogTitle className="sr-only">Image détaillée</DialogTitle>
          <div className="relative">
            <button 
              onClick={() => setDialogOpen(false)} 
              className="absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-700/70 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="w-full max-h-[80vh] overflow-hidden">
              <img 
                src={image.src} 
                alt={image.caption || 'Image astronomique'} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-4 bg-cosmic-dark border-t border-cosmic-indigo/20">
              {image.caption && (
                <p className="text-white/90 font-medium mb-2">{image.caption}</p>
              )}
              
              {image.date && (
                <div className="flex items-center text-white/60 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{image.date}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OtherViewsDetail;
