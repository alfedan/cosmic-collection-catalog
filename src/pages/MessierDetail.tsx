
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';
import ImageCard, { ImageData } from '../components/ImageCard';

const MessierDetail: React.FC = () => {
  const { pageId, imageId } = useParams<{ pageId: string; imageId: string }>();
  const navigate = useNavigate();
  
  const page = parseInt(pageId || '1');
  const imageIndex = parseInt(imageId || '0');
  
  // Récupérer l'image principale et les images supplémentaires depuis le localStorage
  const [mainImage, setMainImage] = useState<ImageData | null>(null);
  const [extraImages, setExtraImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem(`messier-extra-${page}-${imageIndex}`);
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(9).fill(undefined);
  });
  
  // Charger l'image principale
  useEffect(() => {
    const savedImages = localStorage.getItem(`messier-page-${page}`);
    if (savedImages) {
      const images = JSON.parse(savedImages);
      if (images[imageIndex]) {
        setMainImage(images[imageIndex]);
      } else {
        navigate(`/messier/page/${page}`);
      }
    } else {
      navigate(`/messier/page/${page}`);
    }
  }, [page, imageIndex, navigate]);
  
  // Mettre à jour le localStorage quand les images supplémentaires changent
  useEffect(() => {
    localStorage.setItem(`messier-extra-${page}-${imageIndex}`, JSON.stringify(extraImages));
  }, [extraImages, page, imageIndex]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    const newImages = [...extraImages];
    newImages[index] = {
      id: `messier-extra-${page}-${imageIndex}-${index}`,
      src: imageData,
      caption,
      date
    };
    setExtraImages(newImages);
  };
  
  if (!mainImage) {
    return null; // Attendre que l'image soit chargée
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <ImageDetail image={mainImage} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-gradient mb-6">Images supplémentaires de {mainImage.objectName || `M${(page - 1) * 10 + imageIndex + 1}`}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {extraImages.map((image, index) => (
              <ImageCard
                key={index}
                image={image}
                onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
                to={image ? `/messier/extra/${page}/${imageIndex}/${index}` : undefined}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessierDetail;
