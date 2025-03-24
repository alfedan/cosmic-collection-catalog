
import React, { useState } from 'react';
import { Download, Trash2, Lock, X, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-cosmic-navy rounded-xl overflow-hidden shadow-2xl animate-scale-in border border-white/10">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">
                {action === 'download' ? 'Télécharger l\'image' : 'Supprimer la vignette'}
              </h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/70 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className={`w-full px-3 py-2 rounded-md bg-cosmic-dark border ${
                    error ? 'border-red-500 animate-shake' : 'border-white/10'
                  } text-white focus:ring-2 focus:ring-cosmic-purple/50 focus:border-cosmic-purple/50 outline-none transition-colors`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePasswordSubmit();
                    }
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">Mot de passe incorrect</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    action === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-cosmic-purple hover:bg-cosmic-purple/90'
                  } text-white transition-colors`}
                >
                  {action === 'download' ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecureImageMenu;
