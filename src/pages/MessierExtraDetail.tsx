
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageDetail from '../components/ImageDetail';
import { ImageData } from '../components/ImageCard';

const MessierExtraDetail: React.FC = () => {
  const { pageId, imageId, extraId } = useParams<{ pageId: string; imageId: string; extraId: string }>();
  const navigate = useNavigate();
  
  const page = parseInt(pageId || '1');
  const imageIndex = parseInt(imageId || '0');
  const extraIndex = parseInt(extraId || '0');
  
  // Récupérer l'image supplémentaire depuis le localStorage
  const [image, setImage] = useState<ImageData | null>(null);
  
  // Charger l'image supplémentaire
  useEffect(() => {
    const savedImages = localStorage.getItem(`messier-extra-${page}-${imageIndex}`);
    if (savedImages) {
      const images = JSON.parse(savedImages);
      if (images[extraIndex]) {
        setImage(images[extraIndex]);
      } else {
        navigate(`/messier/detail/${page}/${imageIndex}`);
      }
    } else {
      navigate(`/messier/detail/${page}/${imageIndex}`);
    }
  }, [page, imageIndex, extraIndex, navigate]);
  
  if (!image) {
    return null; // Attendre que l'image soit chargée
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <ImageDetail image={image} />
      </div>
    </Layout>
  );
};

export default MessierExtraDetail;
