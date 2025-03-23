
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';

const OtherViews: React.FC = () => {
  // Récupérer les images déjà enregistrées depuis le localStorage
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem('other-views');
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(10).fill(undefined);
  });
  
  // Mettre à jour le localStorage quand les images changent
  useEffect(() => {
    localStorage.setItem('other-views', JSON.stringify(images));
  }, [images]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    const newImages = [...images];
    newImages[index] = {
      id: `other-views-${index}`,
      src: imageData,
      caption,
      date
    };
    setImages(newImages);
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
            Cliquez sur une case vide pour télécharger une photo, ou sur une photo existante pour voir ses détails.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
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
