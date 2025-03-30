
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminButton from './AdminButton';
import { Star, Sun, Image, Home, Moon, BookOpen, Search, Shield } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  const links = [
    { path: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { path: '/messier', label: 'Catalogue Messier', icon: <Star className="w-4 h-4" /> },
    { path: '/solar-system', label: 'Système Solaire', icon: <Sun className="w-4 h-4" /> },
    { path: '/other-views', label: 'Autres Vues', icon: <Image className="w-4 h-4" /> },
    { path: '/nightcam', label: 'NightCam', icon: <Moon className="w-4 h-4" /> },
    { path: '/journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/search', label: 'Recherche', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-cosmic-dark/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-white flex items-center space-x-2">
              <span className="text-2xl">✧</span>
              <span className="font-bold text-xl tracking-tight text-gradient">Cosmos Observer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-300 ${
                    activeLink === link.path || 
                    (link.path !== '/' && activeLink.startsWith(link.path))
                      ? 'text-white bg-cosmic-indigo/20 border border-white/10'
                      : 'text-white/70 hover:text-white hover:bg-cosmic-indigo/40'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Admin Button - Always visible */}
          <div className="flex items-center">
            <AdminButton />
          </div>

          {/* Mobile menu button */}
          {isMobile && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-cosmic-indigo/20 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobile && (
        <div
          ref={mobileMenuRef}
          className={`${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } md:hidden fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-cosmic-navy/80 backdrop-blur-xl transition-all duration-300 ease-in-out z-50 border-l border-white/10 overflow-auto`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium ${
                  activeLink === link.path || 
                  (link.path !== '/' && activeLink.startsWith(link.path))
                    ? 'text-white bg-cosmic-indigo/20'
                    : 'text-white/70 hover:bg-cosmic-indigo/10 hover:text-white'
                }`}
                onClick={handleNavLinkClick}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
