
import React, { useState } from 'react';
import { Download, Trash2, Lock, X, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SecureImageMenuProps {
  imageId: string;
  imageSrc: string;
  onDelete: () => void;
}

const PASSWORD = "AstroBoy";

const SecureImageMenu: React.FC<SecureImageMenuProps> = ({ imageId, imageSrc, onDelete }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [action, setAction] = useState<'download' | 'delete' | null>(null);
  const [error, setError] = useState(false);
  
  const handleAction = (actionType: 'download' | 'delete') => {
    setAction(actionType);
    setShowPasswordModal(true);
    setPassword('');
    setError(false);
  };
  
  const handlePasswordSubmit = () => {
    if (password === PASSWORD) {
      setError(false);
      
      if (action === 'download') {
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `image-${imageId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (action === 'delete') {
        onDelete();
      }
      
      setShowPasswordModal(false);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm p-1.5 rounded-full z-10">
            <Lock className="w-4 h-4 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-cosmic-navy border border-white/10 text-white">
          <DropdownMenuItem 
            className="flex items-center gap-2 hover:bg-cosmic-indigo/30 cursor-pointer"
            onClick={() => handleAction('download')}
          >
            <Download className="w-4 h-4" />
            <span>Télécharger l'image</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
            onClick={() => handleAction('delete')}
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer la vignette</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-cosmic-navy border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {action === 'download' ? 'Télécharger l\'image' : 'Supprimer la vignette'}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Veuillez entrer le mot de passe pour continuer
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/80 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className={`bg-cosmic-dark/50 border ${
                    error ? 'border-red-500 animate-shake' : 'border-white/10'
                  } text-white`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePasswordSubmit();
                    }
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm">Mot de passe incorrect</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordModal(false)}
              className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
            >
              Annuler
            </Button>
            <Button 
              onClick={handlePasswordSubmit}
              className={`${
                action === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-cosmic-purple hover:bg-cosmic-purple/90'
              } text-white`}
            >
              {action === 'download' ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  <span>Télécharger</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Supprimer</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecureImageMenu;
