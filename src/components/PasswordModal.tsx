
import React, { useState } from 'react';
import { X, Lock, Calendar, MessageSquare } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
  file: File | null;
  caption: string;
  setCaption: (caption: string) => void;
  date: string;
  setDate: (date: string) => void;
}

const PASSWORD = "AstroBoy";

const PasswordModal: React.FC<PasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onFailure,
  file,
  caption,
  setCaption,
  date,
  setDate
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file && isOpen) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    return () => {
      setPassword('');
      setError(false);
    };
  }, [file, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-cosmic-navy rounded-xl overflow-hidden shadow-2xl animate-scale-in border border-white/10">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Ajouter une image</h3>
          <button 
            onClick={onFailure}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <div className="p-6">
          {preview && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-white/20">
                <img 
                  src={preview} 
                  alt="Aperçu" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-cosmic-dark border border-white/10 text-white focus:ring-2 focus:ring-cosmic-purple/50 focus:border-cosmic-purple/50 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Description
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Décrivez votre image..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-cosmic-dark border border-white/10 text-white focus:ring-2 focus:ring-cosmic-purple/50 focus:border-cosmic-purple/50 outline-none resize-none"
              />
            </div>
            
            <div>
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
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">Mot de passe incorrect</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onFailure}
                className="px-4 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-cosmic-purple text-white hover:bg-cosmic-purple/90 transition-colors"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
