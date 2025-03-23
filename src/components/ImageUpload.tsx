
import React, { useState, useRef } from 'react';
import { Upload, Check, X } from 'lucide-react';
import PasswordModal from './PasswordModal';

interface ImageUploadProps {
  onImageUploaded: (imageData: string, caption: string, date: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsModalOpen(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setIsModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          onImageUploaded(event.target.result, caption, date);
          setFile(null);
          setCaption('');
          setDate('');
        }
      };
      reader.readAsDataURL(file);
    }
    setIsModalOpen(false);
  };

  const handlePasswordFailure = () => {
    setIsModalOpen(false);
    setFile(null);
  };

  return (
    <>
      <div 
        className={`relative w-full h-full flex flex-col items-center justify-center p-4 glass-card rounded-xl cursor-pointer transition-all duration-300 ${
          isHovering ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
        } ${className}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isHovering ? 'bg-cosmic-purple/30' : 'bg-cosmic-indigo/20'
          } transition-colors duration-300`}>
            <Upload className="w-6 h-6 text-white/80" />
          </div>
          
          <div className="text-center">
            <p className="text-white/80 text-sm">Cliquez ou glissez une image</p>
            <p className="text-white/50 text-xs mt-1">JPG, PNG, WEBP</p>
          </div>
        </div>
      </div>
      
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePasswordSuccess}
        onFailure={handlePasswordFailure}
        file={file}
        caption={caption}
        setCaption={setCaption}
        date={date}
        setDate={setDate}
      />
    </>
  );
};

export default ImageUpload;
