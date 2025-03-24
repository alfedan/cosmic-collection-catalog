import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCard, { ImageData } from '../components/ImageCard';
import { toast } from "@/components/ui/use-toast";

const getMessierName = (number: number): string => {
  const messierObjects: Record<number, string> = {
    1: "M1 - Nébuleuse du Crabe",
    2: "M2 - Amas globulaire",
    3: "M3 - Amas globulaire",
    4: "M4 - Amas globulaire",
    5: "M5 - Amas globulaire",
    6: "M6 - Amas du Papillon",
    7: "M7 - Amas de Ptolémée",
    8: "M8 - Nébuleuse de la Lagune",
    9: "M9 - Amas globulaire",
    10: "M10 - Amas globulaire",
    11: "M11 - Amas du Canard Sauvage",
    12: "M12 - Amas globulaire",
    13: "M13 - Grand amas d'Hercule",
    14: "M14 - Amas globulaire",
    15: "M15 - Amas globulaire",
    16: "M16 - Nébuleuse de l'Aigle",
    17: "M17 - Nébuleuse Oméga",
    18: "M18 - Amas ouvert",
    19: "M19 - Amas globulaire",
    20: "M20 - Nébuleuse Trifide",
    21: "M21 - Amas ouvert",
    22: "M22 - Amas globulaire",
    23: "M23 - Amas ouvert",
    24: "M24 - Nuage stellaire du Sagittaire",
    25: "M25 - Amas ouvert",
    26: "M26 - Amas ouvert",
    27: "M27 - Nébuleuse de l'Haltère",
    28: "M28 - Amas globulaire",
    29: "M29 - Amas ouvert",
    30: "M30 - Amas globulaire",
    31: "M31 - Galaxie d'Andromède",
    32: "M32 - Galaxie elliptique",
    33: "M33 - Galaxie du Triangle",
    34: "M34 - Amas ouvert",
    35: "M35 - Amas ouvert",
    36: "M36 - Amas ouvert",
    37: "M37 - Amas ouvert",
    38: "M38 - Amas ouvert",
    39: "M39 - Amas ouvert",
    40: "M40 - Double étoile Winnecke 4",
    41: "M41 - Amas ouvert",
    42: "M42 - Nébuleuse d'Orion",
    43: "M43 - Partie de la nébuleuse d'Orion",
    44: "M44 - Amas de la Ruche",
    45: "M45 - Amas des Pléiades",
    46: "M46 - Amas ouvert",
    47: "M47 - Amas ouvert",
    48: "M48 - Amas ouvert",
    49: "M49 - Galaxie elliptique",
    50: "M50 - Amas ouvert",
    51: "M51 - Galaxie du Tourbillon",
    52: "M52 - Amas ouvert",
    53: "M53 - Amas globulaire",
    54: "M54 - Amas globulaire",
    55: "M55 - Amas globulaire",
    56: "M56 - Amas globulaire",
    57: "M57 - Nébuleuse de l'Anneau",
    58: "M58 - Galaxie spirale",
    59: "M59 - Galaxie elliptique",
    60: "M60 - Galaxie elliptique",
    61: "M61 - Galaxie spirale",
    62: "M62 - Amas globulaire",
    63: "M63 - Galaxie du Tournesol",
    64: "M64 - Galaxie de l'Œil Noir",
    65: "M65 - Galaxie du trio du Lion",
    66: "M66 - Galaxie du trio du Lion",
    67: "M67 - Amas ouvert",
    68: "M68 - Amas globulaire",
    69: "M69 - Amas globulaire",
    70: "M70 - Amas globulaire",
    71: "M71 - Amas globulaire",
    72: "M72 - Amas globulaire",
    73: "M73 - Groupe d'étoiles",
    74: "M74 - Galaxie spirale",
    75: "M75 - Amas globulaire",
    76: "M76 - Petite nébuleuse de l'Haltère",
    77: "M77 - Galaxie de Cetus",
    78: "M78 - Nébuleuse par réflexion",
    79: "M79 - Amas globulaire",
    80: "M80 - Amas globulaire",
    81: "M81 - Galaxie de Bode",
    82: "M82 - Galaxie du Cigare",
    83: "M83 - Galaxie du Moulinet",
    84: "M84 - Galaxie lenticulaire",
    85: "M85 - Galaxie lenticulaire",
    86: "M86 - Galaxie lenticulaire",
    87: "M87 - Galaxie elliptique",
    88: "M88 - Galaxie spirale",
    89: "M89 - Galaxie elliptique",
    90: "M90 - Galaxie spirale",
    91: "M91 - Galaxie spirale barrée",
    92: "M92 - Amas globulaire",
    93: "M93 - Amas ouvert",
    94: "M94 - Galaxie spirale",
    95: "M95 - Galaxie spirale barrée",
    96: "M96 - Galaxie spirale",
    97: "M97 - Nébuleuse du Hibou",
    98: "M98 - Galaxie spirale",
    99: "M99 - Galaxie spirale",
    100: "M100 - Galaxie spirale",
    101: "M101 - Galaxie du Moulinet",
    102: "M102 - Identification incertaine",
    103: "M103 - Amas ouvert",
    104: "M104 - Galaxie du Sombrero",
    105: "M105 - Galaxie elliptique",
    106: "M106 - Galaxie spirale",
    107: "M107 - Amas globulaire",
    108: "M108 - Galaxie spirale",
    109: "M109 - Galaxie spirale barrée",
    110: "M110 - Galaxie elliptique naine",
  };
  
  return messierObjects[number] || `M${number}`;
};

const MessierPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const page = parseInt(pageId || '1');
  
  useEffect(() => {
    if (isNaN(page) || page < 1 || page > 11) {
      navigate('/messier');
    }
  }, [page, navigate]);
  
  const [images, setImages] = useState<(ImageData | undefined)[]>(() => {
    const savedImages = localStorage.getItem(`messier-page-${page}`);
    if (savedImages) {
      return JSON.parse(savedImages);
    }
    return Array(10).fill(undefined);
  });
  
  useEffect(() => {
    localStorage.setItem(`messier-page-${page}`, JSON.stringify(images));
  }, [images, page]);
  
  const handleImageUpload = (index: number, imageData: string, caption: string, date: string) => {
    const messierNumber = (page - 1) * 10 + index + 1;
    const objectName = getMessierName(messierNumber);
    
    const newImages = [...images];
    newImages[index] = {
      id: `messier-${page}-${index}`,
      src: imageData,
      caption,
      date,
      objectName
    };
    setImages(newImages);
    
    toast({
      title: "Image ajoutée",
      description: `Image ajoutée pour ${objectName}`,
    });
  };
  
  const handleImageDelete = (id: string) => {
    const newImages = [...images];
    const index = newImages.findIndex(img => img?.id === id);
    
    if (index !== -1) {
      const objectName = newImages[index]?.objectName;
      newImages[index] = undefined;
      setImages(newImages);
      
      localStorage.removeItem(`messier-extra-${page}-${index}`);
      
      toast({
        title: "Image supprimée",
        description: `L'image de ${objectName} a été supprimée`,
        variant: "destructive",
      });
    }
  };
  
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
          {images.map((image, index) => {
            const messierNumber = (page - 1) * 10 + index + 1;
            const objectName = getMessierName(messierNumber);
            
            return (
              <ImageCard
                key={index}
                image={image}
                onUpload={image ? undefined : (imageData, caption, date) => handleImageUpload(index, imageData, caption, date)}
                onDelete={handleImageDelete}
                to={image ? `/messier/detail/${page}/${index}` : undefined}
                index={index}
                objectName={objectName}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default MessierPage;
