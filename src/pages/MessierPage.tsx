
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';

const MessierPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const page = parseInt(pageId || '1');
  
  // Vérifier que la page est valide (entre 1 et 11)
  useEffect(() => {
    if (isNaN(page) || page < 1 || page > 11) {
      navigate('/messier');
    }
  }, [page, navigate]);
  
  // Récupérer les images déjà enregistrées depuis le localStorage
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem(`messier-page-${page}`);
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(10).fill(undefined);
  });
  
  // Mettre à jour le localStorage quand les images changent
  useEffect(() => {
    localStorage.setItem(`messier-page-${page}`, JSON.stringify(images));
  }, [images, page]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    const newImages = [...images];
    newImages[index] = {
      id: `messier-${page}-${index}`,
      src: imageData,
      caption,
      date
    };
    setImages(newImages);
  };
  
  // Calcul des numéros de Messier pour cette page
  const startNumber = (page - 1) * 10 + 1;
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Collection
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Catalogue Messier - Page {page}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Objets M{startNumber} à M{Math.min(startNumber + 9, 110)}. 
            Cliquez sur une case vide pour télécharger une photo, ou sur une photo existante pour voir ses détails.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
              to={image ? `/messier/detail/${page}/${index}` : undefined}
              index={index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MessierPage;
