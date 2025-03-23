
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Info } from 'lucide-react';
import ImageUpload from './ImageUpload';

export interface ImageData {
  id: string;
  src: string;
  caption: string;
  date: string;
}

interface ImageCardProps {
  image?: ImageData;
  onUpload?: (imageData: string, caption: string, date: string) => void;
  to?: string;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onUpload, to, index }) => {
  // Animation delay based on index
  const animationDelay = `${0.05 * (index % 10)}s`;
  
  if (!image && onUpload) {
    return (
      <div 
        className="aspect-square animate-fade-in-up"
        style={{ animationDelay }}
      >
        <ImageUpload 
          onImageUploaded={onUpload}
          className="h-full"
        />
      </div>
    );
  }
  
  if (!image) {
    return (
      <div 
        className="aspect-square glass-card rounded-xl animate-fade-in-up"
        style={{ animationDelay }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/30">Image non disponible</span>
        </div>
      </div>
    );
  }
  
  const content = (
    <div className="h-full w-full overflow-hidden rounded-xl relative group">
      <img 
        src={image.src} 
        alt={image.caption || 'Image astronomique'} 
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {image.caption && (
          <p className="text-white text-sm line-clamp-2">{image.caption}</p>
        )}
        
        {image.date && (
          <div className="flex items-center mt-2 text-white/70 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{image.date}</span>
          </div>
        )}
      </div>
      
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
          <Info className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
  
  if (to) {
    return (
      <Link 
        to={to} 
        className="block aspect-square glass-card glass-card-hover rounded-xl overflow-hidden animate-fade-in-up"
        style={{ animationDelay }}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <div 
      className="aspect-square glass-card rounded-xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay }}
    >
      {content}
    </div>
  );
};

export default ImageCard;
