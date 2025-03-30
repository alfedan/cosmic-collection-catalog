
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { toast } from "@/components/ui/use-toast";
import { Trash2, FolderOpen, Download, Search, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  getAstroFolderFiles, 
  getItemFromAstroFolder, 
  removeItemFromAstroFolder 
} from '../utils/storageUtils';

interface AstroFile {
  id: string;
  fileName: string;
  src: string;
  caption: string;
  date: string;
  section: string;
  objectName?: string;
}

const AstroFolder: React.FC = () => {
  const { isAdmin } = useAuth();
  const [files, setFiles] = useState<AstroFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'section' | 'name'>('date');
  
  // Charger les fichiers du dossier astro
  useEffect(() => {
    const loadFiles = () => {
      const fileNames = getAstroFolderFiles();
      const loadedFiles: AstroFile[] = [];
      
      fileNames.forEach(fileName => {
        const fileData = getItemFromAstroFolder(fileName, null);
        if (fileData) {
          loadedFiles.push({
            ...fileData,
            fileName
          });
        }
      });
      
      setFiles(loadedFiles);
    };
    
    loadFiles();
  }, []);
  
  const handleDelete = (fileName: string) => {
    if (!isAdmin) return;
    
    removeItemFromAstroFolder(fileName);
    setFiles(files.filter(file => file.fileName !== fileName));
    
    toast({
      title: "Fichier supprimé",
      description: "Le fichier a été supprimé du dossier astro",
      variant: "destructive"
    });
  };
  
  const handleDownload = (file: AstroFile) => {
    // Créer un lien pour télécharger l'image
    const link = document.createElement('a');
    link.href = file.src;
    link.download = `${file.section}-${file.date.split('T')[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'image est en cours de téléchargement"
    });
  };
  
  // Filtrer et trier les fichiers
  const filteredFiles = files
    .filter(file => {
      const searchLower = searchTerm.toLowerCase();
      return (
        file.caption.toLowerCase().includes(searchLower) ||
        file.section.toLowerCase().includes(searchLower) ||
        (file.objectName && file.objectName.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'section') {
        return a.section.localeCompare(b.section);
      } else {
        return a.caption.localeCompare(b.caption);
      }
    });
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Stockage
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Dossier Astro
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Tous vos fichiers astronomiques sauvegardés au même endroit.
            {!isAdmin && " Connectez-vous en tant qu'administrateur pour gérer les fichiers."}
          </p>
          
          {isAdmin ? (
            <div className="mt-4 inline-flex items-center bg-green-800/30 border border-green-700/30 text-green-200 px-4 py-2 rounded-lg gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Mode administrateur actif</span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center bg-amber-800/30 border border-amber-700/30 text-amber-200 px-4 py-2 rounded-lg gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Mode lecture seule</span>
            </div>
          )}
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher des fichiers..."
              className="pl-9 bg-cosmic-navy/50 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              onClick={() => setSortBy('date')}
              className={sortBy === 'date' ? 'bg-cosmic-indigo' : 'bg-cosmic-navy/50 border-white/10 text-white/70'}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'section' ? 'default' : 'outline'}
              onClick={() => setSortBy('section')}
              className={sortBy === 'section' ? 'bg-cosmic-indigo' : 'bg-cosmic-navy/50 border-white/10 text-white/70'}
            >
              Section
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              className={sortBy === 'name' ? 'bg-cosmic-indigo' : 'bg-cosmic-navy/50 border-white/10 text-white/70'}
            >
              Nom
            </Button>
          </div>
        </div>
        
        {files.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-xl">
            <FolderOpen className="mx-auto w-12 h-12 text-white/30 mb-4" />
            <h3 className="text-xl font-medium text-white/70">Dossier vide</h3>
            <p className="text-white/50 mt-2">Téléchargez des images depuis les différentes sections de l'application</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-xl">
            <Search className="mx-auto w-12 h-12 text-white/30 mb-4" />
            <h3 className="text-xl font-medium text-white/70">Aucun résultat</h3>
            <p className="text-white/50 mt-2">Essayez une recherche différente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.fileName} className="glass-card rounded-xl overflow-hidden group relative">
                <div className="relative aspect-video">
                  <img 
                    src={file.src} 
                    alt={file.caption} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white/80">
                    {file.section}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1 line-clamp-1">
                    {file.caption || (file.objectName || "Sans titre")}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-white/60 text-sm">
                      {new Date(file.date).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-1 h-8 w-8"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      {isAdmin && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1 h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleDelete(file.fileName)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AstroFolder;
