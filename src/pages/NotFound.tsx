
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-cosmic-indigo/40 flex items-center justify-center backdrop-blur-md border border-white/10">
            <span className="text-4xl">404</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient">Page non trouvée</h1>
          
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic-indigo/30 hover:bg-cosmic-indigo/50 transition-colors rounded-md text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner à l'accueil</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
