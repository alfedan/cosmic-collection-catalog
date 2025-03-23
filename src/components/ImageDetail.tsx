
import React from 'react';
import { Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageData } from './ImageCard';

interface ImageDetailProps {
  image: ImageData;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ image }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
      >
        <div className="w-8 h-8 rounded-full bg-cosmic-indigo/30 flex items-center justify-center group-hover:bg-cosmic-indigo/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span>Retour</span>
      </button>
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="w-full aspect-video md:aspect-[16/9] overflow-hidden">
          <img 
            src={image.src} 
            alt={image.caption || 'Image astronomique'} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          {/* Display object name if available */}
          {image.objectName && (
            <h2 className="text-2xl font-bold mb-4 text-gradient">{image.objectName}</h2>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {image.date && (
              <div className="flex items-center text-white/70 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{image.date}</span>
              </div>
            )}
          </div>
          
          {image.caption && (
            <div className="mt-4">
              <div className="flex items-start gap-2 text-white mb-2">
                <MessageSquare className="w-5 h-5 text-cosmic-purple mt-0.5" />
                <h3 className="text-lg font-medium">Description</h3>
              </div>
              <p className="text-white/80 whitespace-pre-line">{image.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
