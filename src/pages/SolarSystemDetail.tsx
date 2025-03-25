
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';
import ImageCard from '../components/ImageCard';
import { AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SolarSystemImage {
  id: string;
  src: string;
  caption: string;
  date: string;
  objectName?: string;
}

interface SecondaryImage {
  id: string;
  src: string;
  caption: string;
  date: string;
}

const SolarSystemDetail: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [image, setImage] = useState<SolarSystemImage | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<(SecondaryImage | undefined)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les images depuis le localStorage
    const savedImages = localStorage.getItem('solar-system');
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages);
      const imageIndex = parseInt(imageId || '0', 10);
      
      if (parsedImages[imageIndex]) {
        setImage(parsedImages[imageIndex]);
        
        // Récupérer les images secondaires
        const savedSecondaryImages = localStorage.getItem(`solar-system-secondary-${imageIndex}`);
        if (savedSecondaryImages) {
          setSecondaryImages(JSON.parse(savedSecondaryImages));
        } else {
          // Initialiser avec 12 emplacements vides
          setSecondaryImages(Array(12).fill(undefined));
        }
      } else {
        // Image non trouvée, rediriger vers la page principale
        navigate('/solar-system');
      }
    } else {
      // Aucune image trouvée, rediriger vers la page principale
      navigate('/solar-system');
    }
    
    setLoading(false);
  }, [imageId, navigate]);

  // Fonction pour gérer l'upload d'une image secondaire
  const handleSecondaryImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    if (!isAdmin || !imageId) return;
    
    const imageIndex = parseInt(imageId, 10);
    
    const newSecondaryImages = [...secondaryImages];
    newSecondaryImages[index] = {
      id: `solar-system-secondary-${imageIndex}-${index}`,
      src: imageData,
      caption,
      date
    };
    
    setSecondaryImages(newSecondaryImages);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem(`solar-system-secondary-${imageIndex}`, JSON.stringify(newSecondaryImages));
  };

  // Fonction pour supprimer une image secondaire
  const handleSecondaryImageDelete = (id: string) => {
    if (!isAdmin || !imageId) return;
    
    const newSecondaryImages = [...secondaryImages];
    const index = newSecondaryImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      newSecondaryImages[index] = undefined;
      setSecondaryImages(newSecondaryImages);
      
      // Mettre à jour le localStorage
      localStorage.setItem(`solar-system-secondary-${parseInt(imageId, 10)}`, JSON.stringify(newSecondaryImages));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto flex items-center justify-center py-12">
          <div className="animate-pulse text-white/50">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!image) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gradient mb-4">Image non trouvée</h1>
          <p className="text-white/70">L'image que vous recherchez n'est pas disponible.</p>
          <button 
            onClick={() => navigate('/solar-system')}
            className="mt-6 px-4 py-2 bg-cosmic-indigo/40 hover:bg-cosmic-indigo/60 transition-colors rounded-md text-white"
          >
            Retourner à la galerie
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 max-w-5xl mx-auto">
        <ImageDetail image={image} />
        
        {/* Section pour les images secondaires */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gradient mb-4">Images supplémentaires</h2>
            <p className="text-white/70">Découvrez plus de photos de {image.objectName || 'cet objet céleste'}</p>
            
            {!isAdmin && (
              <div className="mt-4 mb-6">
                <div className="bg-amber-800/30 border border-amber-700/30 text-amber-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mode lecture seule. <Link to="/admin" className="underline hover:text-white transition-colors">Se connecter en tant qu'administrateur</Link> pour ajouter des images.</span>
                </div>
              </div>
            )}
            
            {isAdmin && (
              <div className="mt-4 mb-6">
                <div className="bg-green-800/30 border border-green-700/30 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Mode administrateur actif. Vous pouvez ajouter ou supprimer des images.</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {secondaryImages.map((image, index) => (
              <ImageCard
                key={index}
                image={image}
                onUpload={image ? undefined : (imageData, caption, date) => handleSecondaryImageUpload(index, imageData, caption, date)}
                onDelete={handleSecondaryImageDelete}
                index={index}
                to={undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SolarSystemDetail;
