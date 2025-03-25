
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import MessierCatalog from "./pages/MessierCatalog";
import MessierPage from "./pages/MessierPage";
import MessierDetail from "./pages/MessierDetail";
import MessierExtraDetail from "./pages/MessierExtraDetail";
import SolarSystem from "./pages/SolarSystem";
import SolarSystemDetail from "./pages/SolarSystemDetail";
import OtherViews from "./pages/OtherViews";
import OtherViewsDetail from "./pages/OtherViewsDetail";
import NightCam from "./pages/NightCam";
import Search from "./pages/Search";
import Journal from "./pages/Journal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/messier" element={<MessierCatalog />} />
            <Route path="/messier/page/:pageId" element={<MessierPage />} />
            <Route path="/messier/detail/:pageId/:imageId" element={<MessierDetail />} />
            <Route path="/messier/extra/:pageId/:imageId/:extraId" element={<MessierExtraDetail />} />
            <Route path="/solar-system" element={<SolarSystem />} />
            <Route path="/solar-system/detail/:imageId" element={<SolarSystemDetail />} />
            <Route path="/other-views" element={<OtherViews />} />
            <Route path="/other-views/detail/:imageId" element={<OtherViewsDetail />} />
            <Route path="/nightcam" element={<NightCam />} />
            <Route path="/search" element={<Search />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
