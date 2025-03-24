
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleSubmit = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          onImageUploaded(event.target.result, caption, date);
          setFile(null);
          setCaption('');
          setDate('');
          toast({
            title: "Image ajoutée",
            description: "L'image a été ajoutée avec succès",
          });
        }
      };
      reader.readAsDataURL(file);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
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
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-cosmic-navy border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Ajouter une image</DialogTitle>
          </DialogHeader>
          
          {file && (
            <div className="flex justify-center py-4">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Aperçu" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-cosmic-dark/50 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Décrivez votre image..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-cosmic-dark/50 border border-white/10 text-white focus:ring-2 focus:ring-cosmic-purple/50 focus:border-cosmic-purple/50 outline-none resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-cosmic-purple hover:bg-cosmic-purple/90 text-white"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
