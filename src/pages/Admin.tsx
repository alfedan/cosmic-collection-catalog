
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, LogOut, Key, User } from 'lucide-react';

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        {isAdmin ? (
          <div className="animate-fade-in rounded-xl p-6 glass-card border border-white/20">
            <div className="flex items-center justify-center mb-6 gap-3">
              <div className="bg-cosmic-indigo/40 w-12 h-12 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Panneau d'administration</h1>
            </div>
            
            <p className="text-white/70 mb-6 text-center">
              Vous êtes connecté en tant qu'administrateur. Vous pouvez maintenant modifier le contenu du site.
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in rounded-xl p-6 glass-card border border-white/20">
            <div className="flex items-center justify-center mb-6 gap-3">
              <div className="bg-cosmic-indigo/40 w-12 h-12 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Administration</h1>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/80 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Identifiant
                </label>
                <Input
                  type="text"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-cosmic-dark/50 border-white/10 text-white focus:border-cosmic-indigo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/80 flex items-center gap-2 text-sm">
                  <Key className="w-4 h-4" />
                  Mot de passe
                </label>
                <Input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-cosmic-dark/50 border-white/10 text-white focus:border-cosmic-indigo"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-cosmic-indigo hover:bg-cosmic-indigo/90"
              >
                Se connecter
              </Button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
