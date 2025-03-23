
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Sun, Image } from 'lucide-react';

interface NavItemProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Navigation: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto my-8">
      <NavItem 
        to="/messier"
        title="Catalogue de Messier"
        description="Explorez les 110 objets du ciel profond catalogués par Charles Messier."
        icon={<Star className="w-12 h-12 text-star-gold" />}
      />
      
      <NavItem 
        to="/solar-system"
        title="Système Solaire"
        description="Découvrez les planètes, lunes et autres corps célestes de notre système solaire."
        icon={<Sun className="w-12 h-12 text-star-blue" />}
      />
      
      <NavItem 
        to="/other-views"
        title="Autres Vues Astronomiques"
        description="Contemplez d'autres vues remarquables du cosmos: galaxies, nébuleuses et plus encore."
        icon={<Image className="w-12 h-12 text-star-white" />}
      />
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ to, title, description, icon }) => {
  return (
    <Link 
      to={to}
      className="glass-card glass-card-hover cosmic-glow-hover rounded-xl p-6 flex flex-col items-center justify-center text-center h-80 group"
    >
      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-cosmic-indigo/40 mb-6 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-medium text-gradient mb-2">{title}</h3>
      
      <p className="text-white/70 text-sm">{description}</p>
      
      <div className="mt-6 px-4 py-2 rounded-full bg-cosmic-purple/20 text-white/90 text-sm border border-cosmic-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
        Explorer
      </div>
    </Link>
  );
};

export default Navigation;
