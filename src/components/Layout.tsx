
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Sun, Image } from 'lucide-react';
import StarryBackground from './StarryBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isHome = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      
      {!isHome && (
        <header className="w-full z-10">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <Link 
              to="/" 
              className="text-gradient-cosmic text-2xl font-bold tracking-tight flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl">✧</span>
              <span>Cosmos Observer</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink 
                to="/messier" 
                icon={<Star className="w-4 h-4" />}
                label="Catalogue de Messier"
                isActive={isActive('/messier')}
              />
              <NavLink 
                to="/solar-system" 
                icon={<Sun className="w-4 h-4" />}
                label="Système Solaire"
                isActive={isActive('/solar-system')}
              />
              <NavLink 
                to="/other-views" 
                icon={<Image className="w-4 h-4" />}
                label="Autres Vues"
                isActive={isActive('/other-views')}
              />
            </nav>
          </div>
        </header>
      )}
      
      <main className="flex-grow container mx-auto px-4 py-6 w-full">
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

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-300 ease-in-out
      ${isActive 
        ? 'bg-cosmic-indigo/80 text-white border border-white/10' 
        : 'text-white/70 hover:text-white hover:bg-cosmic-indigo/40'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Layout;
