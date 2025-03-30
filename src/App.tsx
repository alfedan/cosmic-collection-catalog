
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import SolarSystem from './pages/SolarSystem';
import SolarSystemDetail from './pages/SolarSystemDetail';
import MessierCatalog from './pages/MessierCatalog';
import MessierPage from './pages/MessierPage';
import MessierDetail from './pages/MessierDetail';
import MessierExtraDetail from './pages/MessierExtraDetail';
import OtherViews from './pages/OtherViews';
import OtherViewsDetail from './pages/OtherViewsDetail';
import NightCam from './pages/NightCam';
import Journal from './pages/Journal';
import Admin from './pages/Admin';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import StarryBackground from './components/StarryBackground';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from "@/components/ui/toaster"
import AstroFolder from './pages/AstroFolder';

function App() {
  const location = useLocation();
  const [showBackground, setShowBackground] = useState(true);
  
  useEffect(() => {
    // Désactiver l'arrière-plan sur la page d'administration
    setShowBackground(location.pathname !== '/admin');
  }, [location]);
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster />
        <div className="app">
          <StarryBackground />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/solar-system" element={<SolarSystem />} />
            <Route path="/solar-system/detail/:imageId" element={<SolarSystemDetail />} />
            <Route path="/messier" element={<MessierCatalog />} />
            <Route path="/messier/page/:pageId" element={<MessierPage />} />
            <Route path="/messier/detail/:pageId/:imageId" element={<MessierDetail />} />
            <Route path="/messier/extra/:pageId/:imageId/:extraId" element={<MessierExtraDetail />} />
            <Route path="/other-views" element={<OtherViews />} />
            <Route path="/other-views/detail/:imageId" element={<OtherViewsDetail />} />
            <Route path="/nightcam" element={<NightCam />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/astro-folder" element={<AstroFolder />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
