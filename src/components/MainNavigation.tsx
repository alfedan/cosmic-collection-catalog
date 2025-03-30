import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sun, Moon, Cloud, Search, Image, List, Folder } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Switch } from "@/components/ui/switch"

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { isAdmin, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navigationLinks = [
    { title: "Accueil", path: "/" },
    { title: "Système Solaire", path: "/solar-system" },
    { title: "Catalogue Messier", path: "/messier" },
    { title: "Autres vues", path: "/other-views" },
    { title: "NightCam", path: "/nightcam" },
    { title: "Dossier Astro", path: "/astro-folder" },
    { title: "Journal", path: "/journal" },
  ];
  
  return (
    <nav className="glass-card fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-lg">
              Astro Album
            </Link>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.title}
                    to={link.path}
                    className={`text-white/70 hover:bg-cosmic-indigo/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-cosmic-indigo text-white' : ''}`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Switch id="theme"  onCheckedChange={toggleTheme} defaultChecked={theme === 'dark'} />
            
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="bg-cosmic-indigo/50 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-cosmic-indigo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isLoggedIn ? (
              <button 
                onClick={logout}
                className="text-white/70 hover:bg-cosmic-indigo/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            ) : (
              isAdmin && (
                <Link
                  to="/admin"
                  className="text-white/70 hover:bg-cosmic-indigo/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationLinks.map((link) => (
            <Link
              key={link.title}
              to={link.path}
              onClick={closeMenu}
              className={`text-white/70 hover:bg-cosmic-indigo/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === link.path ? 'bg-cosmic-indigo text-white' : ''}`}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
