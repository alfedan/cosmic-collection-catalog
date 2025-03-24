
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminButton: React.FC = () => {
  const { isAdmin, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isAdmin ? 'bg-cosmic-indigo/30' : 'bg-transparent'}`}
          aria-label="Admin"
        >
          <Shield className={`w-5 h-5 ${isAdmin ? 'text-white' : 'text-white/60'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-cosmic-navy border border-white/10 text-white">
        {isAdmin ? (
          <>
            <DropdownMenuItem className="text-cosmic-indigo flex items-center gap-2 pointer-events-none">
              <Shield className="w-4 h-4" />
              <span>Mode administrateur actif</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center gap-2 hover:bg-cosmic-indigo/30 cursor-pointer">
              <Shield className="w-4 h-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminButton;
