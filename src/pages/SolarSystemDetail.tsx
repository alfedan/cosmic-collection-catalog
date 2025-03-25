
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';

interface SolarSystemImage {
  id: string;
  src: string;
  caption: string;
  date: string;
  objectName?: string;
}

const SolarSystemDetail: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<SolarSystemImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les images depuis le localStorage
    const savedImages = localStorage.getItem('solar-system');
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages);
      const imageIndex = parseInt(imageId || '0', 10);
      
      if (parsedImages[imageIndex]) {
        setImage(parsedImages[imageIndex]);
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
      </div>
    </Layout>
  );
};

export default SolarSystemDetail;
