
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const MessierCatalog: React.FC = () => {
  // Générer les numéros de pages de 1 à 11
  const pages = Array.from({ length: 11 }, (_, i) => i + 1);
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-4 inline-block border border-cosmic-purple/30">
            Catalogue
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Catalogue de Messier</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Le catalogue de Messier répertorie 110 objets du ciel profond compilés par l'astronome français Charles Messier.
            Choisissez une page pour commencer à explorer et à compléter votre collection.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
          {pages.map((page, index) => (
            <Link 
              key={page}
              to={`/messier/page/${page}`}
              className="aspect-[3/4] glass-card glass-card-hover cosmic-glow-hover rounded-xl p-4 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-4 backdrop-blur-sm border border-white/10">
                <span className="text-xl font-medium text-white">{page}</span>
              </div>
              
              <h3 className="text-gradient text-lg font-medium mb-2">Page {page}</h3>
              <p className="text-white/60 text-sm">
                Objets Messier {((page - 1) * 10) + 1} à {Math.min(page * 10, 110)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MessierCatalog;
