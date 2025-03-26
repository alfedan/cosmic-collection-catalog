
import React from 'react';
import { useLocation } from 'react-router-dom';
import StarryBackground from './StarryBackground';
import MainNavigation from './MainNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      
      <MainNavigation />
      
      <main className="flex-grow container mx-auto px-4 pt-20 pb-6 w-full">
        {children}
      </main>
      
      <footer className="py-8 w-full neo-blur mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-white/60">
          <p>Cosmos Observer — Catalogue d'images astronomiques</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
