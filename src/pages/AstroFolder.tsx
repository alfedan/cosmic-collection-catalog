
import React from 'react';
import Layout from '../components/Layout';
import { ImageData } from '../components/ImageCard';
import { Card, CardContent } from '../components/ui/card';
import { Folder, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/ui/skeleton';

// Exemple d'images permanentes stockées dans le dépôt
const permanentImages: ImageData[] = [
  {
    id: 'permanent-1',
    src: '/images/galaxy1.jpg', // Ces images seront stockées dans le dossier public/images
    caption: 'Galaxie d\'Andromède (M31)',
    date: '2023-01-15',
    objectName: 'M31'
  },
  {
    id: 'permanent-2',
    src: '/images/nebula1.jpg',
    caption: 'Nébuleuse d\'Orion (M42)',
    date: '2023-02-20',
    objectName: 'M42'
  },
  {
    id: 'permanent-3',
    src: '/images/moon1.jpg',
    caption: 'Pleine lune en haute résolution',
    date: '2023-03-10',
    objectName: 'Lune'
  },
  {
    id: 'permanent-4',
    src: '/images/M27_20240919.jpg', // Correction du nom du fichier
    caption: 'Nébuleuse de l\'Haltère (M27)',
    date: '2024-09-19',
    objectName: 'M27'
  }
];

const AstroFolder: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-full bg-cosmic-indigo/30 flex items-center justify-center group-hover:bg-cosmic-indigo/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Retour</span>
        </button>
        
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-cosmic-indigo/40 flex items-center justify-center mr-4">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Images Permanentes</h1>
        </div>
        
        <p className="text-white/80 mb-8">
          Cette collection contient des images permanentes stockées directement dans l'application. 
          Elles sont accessibles sur tous vos appareils et ne sont pas dépendantes du stockage local du navigateur.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {permanentImages.map((image, index) => (
            <Card key={image.id} className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${0.05 * index}s` }}>
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={image.src} 
                  alt={image.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onLoad={(e) => {
                    console.log(`Image chargée: ${image.src}`);
                    (e.target as HTMLImageElement).classList.remove('opacity-0');
                    (e.target as HTMLImageElement).classList.add('opacity-100');
                  }}
                  onError={(e) => {
                    console.error(`Erreur de chargement d'image: ${image.src}`);
                    // Fallback pour les images qui ne chargent pas
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full absolute" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-white mb-1">{image.objectName}</h3>
                <p className="text-sm text-white/70">{image.caption}</p>
                <div className="text-xs text-white/50 mt-2">{image.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-cosmic-indigo/20 border border-cosmic-indigo/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Comment ajouter vos propres images permanentes</h3>
          <ol className="list-decimal pl-5 text-white/80 space-y-2">
            <li>Ajoutez vos images dans le dossier <code className="bg-black/20 px-1 rounded">public/images</code> de votre projet</li>
            <li>Référencez-les dans votre code avec le chemin <code className="bg-black/20 px-1 rounded">/images/nom-image.jpg</code></li>
            <li>Ces images seront alors disponibles sur tous les appareils où l'application est hébergée</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default AstroFolder;
