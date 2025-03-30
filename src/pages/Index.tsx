
import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle, Star, Sun, Image as ImageIcon, Moon, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAdmin } = useAuth();
  
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-7xl mx-auto text-center animate-fade-in">
        <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-6 border border-cosmic-purple/30">
          Explorez l'univers
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
          Cosmos Observer
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-2xl">
          Votre collection personnelle d'images astronomiques
        </p>
        
        {!isAdmin && (
          <div className="mt-4 mb-8 flex justify-center">
            <div className="bg-amber-800/30 border border-amber-700/30 text-amber-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Mode lecture seule. <Link to="/admin" className="underline hover:text-white transition-colors">Se connecter en tant qu'administrateur</Link></span>
            </div>
          </div>
        )}
        
        {isAdmin && (
          <div className="mt-4 mb-8 flex justify-center">
            <div className="bg-green-800/30 border border-green-700/30 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Mode administrateur actif. Vous pouvez modifier le contenu.</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
          <Link 
            to="/messier"
            className="aspect-square glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gradient text-lg font-medium mb-2">Catalogue Messier</h3>
          </Link>
          
          <Link 
            to="/solar-system"
            className="aspect-square glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gradient text-lg font-medium mb-2">Système Solaire</h3>
          </Link>
          
          <Link 
            to="/other-views"
            className="aspect-square glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gradient text-lg font-medium mb-2">Autres Vues</h3>
          </Link>
          
          <Link 
            to="/nightcam"
            className="aspect-square glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gradient text-lg font-medium mb-2">NightCam</h3>
          </Link>
          
          <Link 
            to="/astro-folder"
            className="aspect-square glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gradient text-lg font-medium mb-2">Images Permanentes</h3>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
