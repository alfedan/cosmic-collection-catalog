
import React from 'react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-7xl mx-auto text-center animate-fade-in">
        <span className="text-sm px-2.5 py-1 rounded-full bg-cosmic-purple/30 text-white/90 mb-6 border border-cosmic-purple/30">
          Explorez l'univers
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
          Cosmos Observer
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl">
          Votre collection personnelle d'images astronomiques
        </p>
        
        <div className="w-full">
          <Navigation />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
